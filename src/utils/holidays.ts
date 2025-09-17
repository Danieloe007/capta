import axios from 'axios';
import { Holiday } from '../types';

const HOLIDAYS_URL = 'https://content.capta.co/Recruitment/WorkingDays.json';

let holidaysCache: Holiday[] = [];
let lastFetchTimestamp: number = 0;
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas

export const getHolidays = async (): Promise<Holiday[]> => {
  const now = Date.now();
  if (holidaysCache.length > 0 && now - lastFetchTimestamp < CACHE_DURATION_MS) {
    return holidaysCache;
  }

  try {
    const response = await axios.get<Holiday[]>(HOLIDAYS_URL);
    holidaysCache = response.data;
    lastFetchTimestamp = now;
    return holidaysCache;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    return holidaysCache.length > 0 ? holidaysCache : [];
  }
};