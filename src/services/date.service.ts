import { fromZonedTime, toZonedTime } from 'date-fns-tz';
import { add, set, getDay, isSameDay, startOfDay, differenceInMinutes } from 'date-fns';
import { Holiday } from '../types';
import { getHolidays } from '../utils/holidays';

const TIMEZONE = 'America/Bogota';
const WORK_START_HOUR = 8;
const LUNCH_START_HOUR = 12;
const LUNCH_END_HOUR = 13;
const WORK_END_HOUR = 17;

// Horas laborales por día (8 horas: 8-12 y 13-17)
const WORK_HOURS_PER_DAY = 8;

const isWeekend = (date: Date): boolean => {
  const day = getDay(date);
  return day === 0 || day === 6; // Domingo = 0, Sábado = 6
};

const isHoliday = (date: Date, holidays: Holiday[]): boolean => {
  const dateStart = startOfDay(date);
  return holidays.some(holiday => {
    const holidayDate = startOfDay(new Date(holiday.date));
    return isSameDay(dateStart, holidayDate);
  });
};

const isNonWorkingDay = (date: Date, holidays: Holiday[]): boolean => {
  return isWeekend(date) || isHoliday(date, holidays);
};

const isWorkingHour = (date: Date): boolean => {
  const hour = date.getHours();
  return (hour >= WORK_START_HOUR && hour < LUNCH_START_HOUR) ||
         (hour >= LUNCH_END_HOUR && hour < WORK_END_HOUR);
};

const adjustToNextWorkingMoment = (date: Date, holidays: Holiday[]): Date => {
  let adjustedDate = new Date(date);

  // Si es un día no laboral, mover al siguiente día laboral a las 8:00 AM
  while (isNonWorkingDay(adjustedDate, holidays)) {
    adjustedDate = add(adjustedDate, { days: 1 });
    adjustedDate = set(adjustedDate, {
      hours: WORK_START_HOUR,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });
  }

  const currentHour = adjustedDate.getHours();
  const currentMinute = adjustedDate.getMinutes();

  // Si es antes del horario laboral, ajustar a las 8:00 AM
  if (currentHour < WORK_START_HOUR) {
    adjustedDate = set(adjustedDate, {
      hours: WORK_START_HOUR,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });
  }
  // Si es después del horario laboral, mover al siguiente día laboral a las 8:00 AM
  else if (currentHour >= WORK_END_HOUR) {
    adjustedDate = add(adjustedDate, { days: 1 });
    adjustedDate = set(adjustedDate, {
      hours: WORK_START_HOUR,
      minutes: 0,
      seconds: 0,
      milliseconds: 0
    });
    return adjustToNextWorkingMoment(adjustedDate, holidays);
  }
  // Si está en horario de almuerzo, ajustar a la 1:00 PM manteniendo los minutos
  else if (currentHour >= LUNCH_START_HOUR && currentHour < LUNCH_END_HOUR) {
    adjustedDate = set(adjustedDate, {
      hours: LUNCH_END_HOUR,
      minutes: currentMinute,
      seconds: adjustedDate.getSeconds(),
      milliseconds: adjustedDate.getMilliseconds()
    });
  }

  return adjustedDate;
};

const addBusinessDays = (date: Date, days: number, holidays: Holiday[]): Date => {
  if (days === 0) return new Date(date);

  let resultDate = new Date(date);
  let daysAdded = 0;

  // Preservar la hora original para mantenerla después de agregar días
  const originalHour = resultDate.getHours();
  const originalMinute = resultDate.getMinutes();
  const originalSecond = resultDate.getSeconds();
  const originalMillisecond = resultDate.getMilliseconds();

  // Usar el método iterativo para precisión
  while (daysAdded < days) {
    resultDate = add(resultDate, { days: 1 });
    if (!isNonWorkingDay(resultDate, holidays)) {
      daysAdded++;
    }
  }

  // Restaurar la hora original
  resultDate = set(resultDate, {
    hours: originalHour,
    minutes: originalMinute,
    seconds: originalSecond,
    milliseconds: originalMillisecond
  });

  return resultDate;
};

const addBusinessHours = (date: Date, hours: number, holidays: Holiday[]): Date => {
  if (hours === 0) return new Date(date);

  let resultDate = new Date(date);
  let hoursToAdd = hours;

  // Agregar las horas de manera iterativa para precisión
  while (hoursToAdd > 0) {
    // Asegurar que estamos en un momento laboral válido
    if (isNonWorkingDay(resultDate, holidays)) {
      resultDate = adjustToNextWorkingMoment(resultDate, holidays);
      continue;
    }

    const currentHour = resultDate.getHours();

    // Si estamos en horario de almuerzo, saltar a la 1:00 PM
    if (currentHour >= LUNCH_START_HOUR && currentHour < LUNCH_END_HOUR) {
      resultDate = set(resultDate, {
        hours: LUNCH_END_HOUR,
        minutes: resultDate.getMinutes(),
        seconds: resultDate.getSeconds(),
        milliseconds: resultDate.getMilliseconds()
      });
      continue;
    }

    // Si estamos fuera del horario laboral, ajustar
    if (currentHour < WORK_START_HOUR || currentHour >= WORK_END_HOUR) {
      resultDate = adjustToNextWorkingMoment(resultDate, holidays);
      continue;
    }

    // Agregar 1 hora
    resultDate = add(resultDate, { hours: 1 });
    hoursToAdd--;

    // Si llegamos exactamente al almuerzo, saltar a la 1:00 PM
    if (resultDate.getHours() === LUNCH_START_HOUR) {
      resultDate = set(resultDate, { hours: LUNCH_END_HOUR });
    }

    // Si llegamos al final del día, mover al siguiente día laboral
    if (resultDate.getHours() >= WORK_END_HOUR) {
      resultDate = add(resultDate, { days: 1 });
      resultDate = set(resultDate, {
        hours: WORK_START_HOUR,
        minutes: 0,
        seconds: 0,
        milliseconds: 0
      });
      resultDate = adjustToNextWorkingMoment(resultDate, holidays);
    }
  }

  return resultDate;
};

export const calculateBusinessDate = async (
  days?: number,
  hours?: number,
  startDateUTC?: string
): Promise<string> => {
  const holidays = await getHolidays();
  const initialDate = startDateUTC ? new Date(startDateUTC) : new Date();

  // Convertir la fecha inicial a zona horaria de Colombia
  let currentDate = toZonedTime(initialDate, TIMEZONE);

  // Ajustar al siguiente momento laboral válido
  currentDate = adjustToNextWorkingMoment(currentDate, holidays);

  // Agregar días hábiles primero (si se especifican)
  if (days && days > 0) {
    currentDate = addBusinessDays(currentDate, days, holidays);
  }

  // Luego agregar horas hábiles (si se especifican)
  if (hours && hours > 0) {
    currentDate = addBusinessHours(currentDate, hours, holidays);
  }

  // IMPORTANTE: La fecha currentDate ya está en zona horaria de Colombia
  // Necesitamos convertirla de vuelta a UTC correctamente
  const finalUtcDate = fromZonedTime(currentDate, TIMEZONE);
  return finalUtcDate.toISOString();
};