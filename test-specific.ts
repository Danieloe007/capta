import { calculateBusinessDate } from './src/services/date.service';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Bogota';

async function testSpecificCase() {
  console.log('🔍 Prueba específica: Viernes 5:00 PM + 1 hora');
  
  // Viernes 17 enero 2025, 5:00 PM Colombia = 22:00 UTC
  const startDateUTC = "2025-01-17T22:00:00.000Z";
  const startDateColombia = toZonedTime(new Date(startDateUTC), TIMEZONE);
  
  console.log(`Fecha inicio UTC: ${startDateUTC}`);
  console.log(`Fecha inicio Colombia: ${startDateColombia.toLocaleString('es-CO', { timeZone: TIMEZONE })}`);
  console.log(`Día de la semana: ${startDateColombia.toLocaleDateString('es-CO', { weekday: 'long', timeZone: TIMEZONE })}`);
  
  const result = await calculateBusinessDate(0, 1, startDateUTC);
  const resultColombia = toZonedTime(new Date(result), TIMEZONE);
  
  console.log(`Resultado UTC: ${result}`);
  console.log(`Resultado Colombia: ${resultColombia.toLocaleString('es-CO', { timeZone: TIMEZONE })}`);
  console.log(`Día de la semana resultado: ${resultColombia.toLocaleDateString('es-CO', { weekday: 'long', timeZone: TIMEZONE })}`);
  
  // El resultado esperado es lunes 9:00 AM Colombia
  // Lunes 20 enero 2025, 9:00 AM Colombia = 14:00 UTC
  console.log(`Esperado: Lunes 20 enero 2025, 9:00 AM Colombia = 2025-01-20T14:00:00.000Z`);
}

testSpecificCase().catch(console.error);