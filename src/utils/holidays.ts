import axios from 'axios';
import { Holiday } from '../types';
import { startOfDay, parseISO } from 'date-fns';

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
    const response = await axios.get<string[]>(HOLIDAYS_URL);
    
    // El API devuelve un array de strings con fechas, convertir al formato Holiday
    holidaysCache = response.data
      .filter(dateString => dateString && typeof dateString === 'string')
      .map(dateString => ({
        date: startOfDay(parseISO(dateString.trim())).toISOString(),
        name: `Holiday ${dateString}`
      }));
    
    lastFetchTimestamp = now;
    console.log(`Loaded ${holidaysCache.length} holidays from API`);
    return holidaysCache;
  } catch (error) {
    console.error('Error fetching holidays:', error);
    
    // Si hay error pero tenemos cache, usarlo
    if (holidaysCache.length > 0) {
      console.log(`Using cached holidays (${holidaysCache.length} entries)`);
      return holidaysCache;
    }
    
    // Si no hay cache, devolver array vacío y loggear el problema
    console.warn('No holidays cache available, proceeding without holiday data');
    return [];
  }
};