import { calculateBusinessDate } from './src/services/date.service';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Bogota';

async function debugTimezoneConversion() {
  console.log('🔍 Debug de conversión de zona horaria');
  
  // Crear una fecha específica en UTC
  const utcDate = new Date("2025-01-20T09:00:00.000Z");
  console.log(`Fecha UTC: ${utcDate.toISOString()}`);
  
  // Convertir a Colombia
  const colombiaDate = toZonedTime(utcDate, TIMEZONE);
  console.log(`Fecha Colombia (toZonedTime): ${colombiaDate.toString()}`);
  console.log(`Fecha Colombia (toLocaleString): ${colombiaDate.toLocaleString('es-CO', { timeZone: TIMEZONE })}`);
  
  // Convertir de vuelta a UTC
  const backToUtc = fromZonedTime(colombiaDate, TIMEZONE);
  console.log(`De vuelta a UTC: ${backToUtc.toISOString()}`);
  
  console.log('\n--- Prueba con fecha esperada ---');
  const expectedUtc = new Date("2025-01-20T14:00:00.000Z");
  console.log(`Fecha UTC esperada: ${expectedUtc.toISOString()}`);
  
  const expectedColombia = toZonedTime(expectedUtc, TIMEZONE);
  console.log(`Fecha Colombia esperada: ${expectedColombia.toLocaleString('es-CO', { timeZone: TIMEZONE })}`);
}

debugTimezoneConversion().catch(console.error);