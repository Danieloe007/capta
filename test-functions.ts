import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { getHolidays } from './src/utils/holidays';

// Copiar las funciones para testear directamente
import { add, set, getDay, isSameDay, startOfDay } from 'date-fns';

const TIMEZONE = 'America/Bogota';
const WORK_START_HOUR = 8;
const LUNCH_START_HOUR = 12;
const LUNCH_END_HOUR = 13;
const WORK_END_HOUR = 17;

const isWeekend = (date: Date): boolean => {
  const day = getDay(date);
  return day === 0 || day === 6;
};

const isHoliday = (date: Date, holidays: any[]): boolean => {
  const dateStart = startOfDay(date);
  return holidays.some(holiday => {
    const holidayDate = startOfDay(new Date(holiday.date));
    return isSameDay(dateStart, holidayDate);
  });
};

const isNonWorkingDay = (date: Date, holidays: any[]): boolean => {
  return isWeekend(date) || isHoliday(date, holidays);
};

const adjustToNextWorkingMoment = (date: Date, holidays: any[]): Date => {
  let adjustedDate = new Date(date);
  
  console.log(`  adjustToNextWorkingMoment input: ${adjustedDate.toString()}`);
  
  // Si es un día no laboral, mover al siguiente día laboral a las 8:00 AM
  while (isNonWorkingDay(adjustedDate, holidays)) {
    console.log(`  Es día no laboral, moviendo al siguiente día...`);
    adjustedDate = add(adjustedDate, { days: 1 });
    adjustedDate = set(adjustedDate, { 
      hours: WORK_START_HOUR, 
      minutes: 0, 
      seconds: 0, 
      milliseconds: 0 
    });
    console.log(`  Después de mover: ${adjustedDate.toString()}`);
  }
  
  const currentHour = adjustedDate.getHours();
  const currentMinute = adjustedDate.getMinutes();
  
  console.log(`  Hora actual: ${currentHour}:${currentMinute}`);
  
  // Si es antes del horario laboral, ajustar a las 8:00 AM
  if (currentHour < WORK_START_HOUR) {
    console.log(`  Antes del horario laboral, ajustando a 8:00 AM`);
    adjustedDate = set(adjustedDate, { 
      hours: WORK_START_HOUR, 
      minutes: 0, 
      seconds: 0, 
      milliseconds: 0 
    });
  }
  // Si es después del horario laboral, mover al siguiente día laboral a las 8:00 AM
  else if (currentHour >= WORK_END_HOUR) {
    console.log(`  Después del horario laboral, moviendo al siguiente día`);
    adjustedDate = add(adjustedDate, { days: 1 });
    adjustedDate = set(adjustedDate, { 
      hours: WORK_START_HOUR, 
      minutes: 0, 
      seconds: 0, 
      milliseconds: 0 
    });
    console.log(`  Después de mover al siguiente día: ${adjustedDate.toString()}`);
    return adjustToNextWorkingMoment(adjustedDate, holidays);
  }
  // Si está en horario de almuerzo, ajustar a la 1:00 PM manteniendo los minutos
  else if (currentHour >= LUNCH_START_HOUR && currentHour < LUNCH_END_HOUR) {
    console.log(`  En horario de almuerzo, ajustando a 1:00 PM`);
    adjustedDate = set(adjustedDate, { 
      hours: LUNCH_END_HOUR, 
      minutes: currentMinute, 
      seconds: adjustedDate.getSeconds(), 
      milliseconds: adjustedDate.getMilliseconds() 
    });
  }
  
  console.log(`  adjustToNextWorkingMoment output: ${adjustedDate.toString()}`);
  return adjustedDate;
};

const addBusinessHours = (date: Date, hours: number, holidays: any[]): Date => {
  if (hours === 0) return new Date(date);
  
  let resultDate = new Date(date);
  let hoursToAdd = hours;
  
  console.log(`  addBusinessHours input: ${resultDate.toString()}, hours: ${hours}`);
  
  // Agregar las horas restantes
  while (hoursToAdd > 0) {
    console.log(`  Horas restantes: ${hoursToAdd}, fecha actual: ${resultDate.toString()}`);
    
    // Asegurar que estamos en un momento laboral válido
    if (isNonWorkingDay(resultDate, holidays)) {
      console.log(`  Día no laboral, ajustando...`);
      resultDate = adjustToNextWorkingMoment(resultDate, holidays);
      continue;
    }
    
    const currentHour = resultDate.getHours();
    
    // Si estamos en horario de almuerzo, saltar a la 1:00 PM
    if (currentHour >= LUNCH_START_HOUR && currentHour < LUNCH_END_HOUR) {
      console.log(`  En horario de almuerzo, saltando a 1:00 PM`);
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
      console.log(`  Fuera del horario laboral, ajustando...`);
      resultDate = adjustToNextWorkingMoment(resultDate, holidays);
      continue;
    }
    
    // Agregar 1 hora
    console.log(`  Agregando 1 hora...`);
    resultDate = add(resultDate, { hours: 1 });
    hoursToAdd--;
    
    // Si llegamos exactamente al almuerzo, saltar a la 1:00 PM
    if (resultDate.getHours() === LUNCH_START_HOUR) {
      console.log(`  Llegamos al almuerzo, saltando a 1:00 PM`);
      resultDate = set(resultDate, { hours: LUNCH_END_HOUR });
    }
    
    // Si llegamos al final del día, mover al siguiente día laboral
    if (resultDate.getHours() >= WORK_END_HOUR) {
      console.log(`  Llegamos al final del día, moviendo al siguiente día laboral`);
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
  
  console.log(`  addBusinessHours output: ${resultDate.toString()}`);
  return resultDate;
};

async function testFunctions() {
  console.log('🔍 Test de funciones individuales');
  
  const holidays = await getHolidays();
  
  // Viernes 17 enero 2025, 5:00 PM Colombia = 22:00 UTC
  const startDateUTC = "2025-01-17T22:00:00.000Z";
  console.log(`1. Fecha inicio UTC: ${startDateUTC}`);
  
  // Convertir a Colombia
  let currentDate = toZonedTime(new Date(startDateUTC), TIMEZONE);
  console.log(`2. Fecha en Colombia: ${currentDate.toString()}`);
  
  // Ajustar al siguiente momento laboral válido
  console.log(`3. Llamando adjustToNextWorkingMoment...`);
  currentDate = adjustToNextWorkingMoment(currentDate, holidays);
  console.log(`4. Después de adjustToNextWorkingMoment: ${currentDate.toString()}`);
  
  // Agregar 1 hora
  console.log(`5. Llamando addBusinessHours...`);
  currentDate = addBusinessHours(currentDate, 1, holidays);
  console.log(`6. Después de addBusinessHours: ${currentDate.toString()}`);
  
  // Convertir de vuelta a UTC
  const finalUtc = fromZonedTime(currentDate, TIMEZONE);
  console.log(`7. Convertido a UTC: ${finalUtc.toISOString()}`);
}

testFunctions().catch(console.error);