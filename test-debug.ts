import { calculateBusinessDate } from './src/services/date.service';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { add } from 'date-fns';

const TIMEZONE = 'America/Bogota';

async function debugFullFlow() {
  console.log('🔍 Debug del flujo completo');
  
  // Viernes 17 enero 2025, 5:00 PM Colombia = 22:00 UTC
  const startDateUTC = "2025-01-17T22:00:00.000Z";
  console.log(`1. Fecha inicio UTC: ${startDateUTC}`);
  
  // Convertir a Colombia
  const startDateColombia = toZonedTime(new Date(startDateUTC), TIMEZONE);
  console.log(`2. Fecha inicio Colombia: ${startDateColombia.toLocaleString('es-CO', { timeZone: TIMEZONE })}`);
  
  // Simular lo que debería pasar:
  // - Es viernes 5:00 PM (fuera de horario laboral)
  // - Debe ir al siguiente día laboral (lunes) a las 8:00 AM
  // - Luego agregar 1 hora = 9:00 AM
  
  let simulatedDate = new Date(startDateColombia);
  console.log(`3. Fecha simulada inicial: ${simulatedDate.toLocaleString('es-CO', { timeZone: TIMEZONE })}`);
  
  // Mover al lunes 8:00 AM
  simulatedDate = new Date('2025-01-20T08:00:00');
  console.log(`4. Lunes 8:00 AM Colombia: ${simulatedDate.toLocaleString('es-CO', { timeZone: TIMEZONE })}`);
  
  // Agregar 1 hora
  simulatedDate = add(simulatedDate, { hours: 1 });
  console.log(`5. Después de agregar 1 hora: ${simulatedDate.toLocaleString('es-CO', { timeZone: TIMEZONE })}`);
  
  // Convertir a UTC
  const finalUtc = fromZonedTime(simulatedDate, TIMEZONE);
  console.log(`6. Resultado final UTC: ${finalUtc.toISOString()}`);
  
  console.log('\n--- Comparar con resultado real ---');
  const actualResult = await calculateBusinessDate(0, 1, startDateUTC);
  console.log(`Resultado real: ${actualResult}`);
  console.log(`Resultado esperado: ${finalUtc.toISOString()}`);
}

debugFullFlow().catch(console.error);