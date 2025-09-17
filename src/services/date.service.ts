import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';
import { add, set, getDay, isSameDay } from 'date-fns';
import { Holiday } from '../types';
import { getHolidays } from '../utils/holidays';

const TIMEZONE = 'America/Bogota';
const WORK_START_HOUR = 8;
const LUNCH_START_HOUR = 12;
const LUNCH_END_HOUR = 13;
const WORK_END_HOUR = 17;

const isWeekend = (date: Date): boolean => {
  const day = getDay(date);
  return day === 0 || day === 6;
};

const isHoliday = (date: Date, holidays: Holiday[]): boolean => {
  return holidays.some(holiday => isSameDay(new Date(holiday.date), date));
};

const isNonWorkingDay = (date: Date, holidays: Holiday[]): boolean => {
  return isWeekend(date) || isHoliday(date, holidays);
};

const adjustToNextWorkingMoment = (date: Date, holidays: Holiday[]): Date => {
  let adjustedDate = new Date(date);

  while (isNonWorkingDay(adjustedDate, holidays)) {
    adjustedDate = add(adjustedDate, { days: 1 });
    adjustedDate = set(adjustedDate, { hours: WORK_START_HOUR, minutes: 0, seconds: 0, milliseconds: 0 });
  }

  const currentHour = adjustedDate.getHours();

  if (currentHour < WORK_START_HOUR) {
    adjustedDate = set(adjustedDate, { hours: WORK_START_HOUR, minutes: 0, seconds: 0, milliseconds: 0 });
  } else if (currentHour >= WORK_END_HOUR) {
    adjustedDate = add(adjustedDate, { days: 1 });
    adjustedDate = set(adjustedDate, { hours: WORK_START_HOUR, minutes: 0, seconds: 0, milliseconds: 0 });
    return adjustToNextWorkingMoment(adjustedDate, holidays);
  } else if (currentHour >= LUNCH_START_HOUR && currentHour < LUNCH_END_HOUR) {
    adjustedDate = set(adjustedDate, { hours: LUNCH_END_HOUR, minutes: 0, seconds: 0, milliseconds: 0 });
  }

  return adjustedDate;
};

const addBusinessDays = (date: Date, days: number, holidays: Holiday[]): Date => {
  let resultDate = new Date(date);
  let daysAdded = 0;
  while (daysAdded < days) {
    resultDate = add(resultDate, { days: 1 });
    if (!isNonWorkingDay(resultDate, holidays)) {
      daysAdded++;
    }
  }
  return resultDate;
};

const addBusinessHours = (date: Date, hours: number, holidays: Holiday[]): Date => {
  let resultDate = new Date(date);
  let hoursToAdd = hours;
  while (hoursToAdd > 0) {
    const currentHour = resultDate.getHours();

    if (currentHour >= LUNCH_START_HOUR && currentHour < LUNCH_END_HOUR) {
        resultDate = set(resultDate, { hours: LUNCH_END_HOUR, minutes: 0 });
        continue;
    }

    if (currentHour >= WORK_END_HOUR) {
        resultDate = add(resultDate, { days: 1 });
        resultDate = set(resultDate, { hours: WORK_START_HOUR, minutes: 0 });
        while(isNonWorkingDay(resultDate, holidays)) {
            resultDate = add(resultDate, { days: 1 });
        }
        continue;
    }

    resultDate = add(resultDate, { hours: 1 });
    hoursToAdd--;

     if (resultDate.getHours() === LUNCH_START_HOUR) {
        resultDate = set(resultDate, { hours: LUNCH_END_HOUR, minutes: 0 });
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
  let currentDate = toZonedTime(initialDate, TIMEZONE);
  currentDate = adjustToNextWorkingMoment(currentDate, holidays);

  if (days && days > 0) {
    currentDate = addBusinessDays(currentDate, days, holidays);
  }
  if (hours && hours > 0) {
    currentDate = addBusinessHours(currentDate, hours, holidays);
  }

  const finalUtcDate = fromZonedTime(currentDate, TIMEZONE);
  return format(finalUtcDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
};