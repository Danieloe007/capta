import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import { add, set } from 'date-fns';

const TIMEZONE = 'America/Bogota';

async function debugStepByStep() {
  console.log('🔍 Debug paso a paso');
  
  // Viernes 17 enero 2025, 5:00 PM Colombia = 22:00 UTC
  const startDateUTC = "2025-01-17T22:00:00.000Z";
  console.log(`1. Fecha inicio UTC: ${startDateUTC}`);
  
  // Convertir a Colombia
  let currentDate = toZonedTime(new Date(startDateUTC), TIMEZONE);
  console.log(`2. Fecha en Colombia: ${currentDate.toString()}`);
  console.log(`   Hora: ${currentDate.getHours()}:${currentDate.getMinutes()}`);
  
  // Simular adjustToNextWorkingMoment
  // Es viernes 5:00 PM (>= 17), así que debe ir al siguiente día laboral
  console.log(`3. Es >= 17 horas, moviendo al siguiente día laboral...`);
  
  currentDate = add(currentDate, { days: 1 }); // Sábado
  console.log(`4. Después de +1 día: ${currentDate.toString()}`);
  
  currentDate = add(currentDate, { days: 1 }); // Domingo  
  console.log(`5. Después de +1 día más: ${currentDate.toString()}`);
  
  currentDate = add(currentDate, { days: 1 }); // Lunes
  console.log(`6. Después de +1 día más (lunes): ${currentDate.toString()}`);
  
  // Establecer a las 8:00 AM
  currentDate = set(currentDate, { 
    hours: 8, 
    minutes: 0, 
    seconds: 0, 
    milliseconds: 0 
  });
  console.log(`7. Establecido a 8:00 AM: ${currentDate.toString()}`);
  
  // Agregar 1 hora
  currentDate = add(currentDate, { hours: 1 });
  console.log(`8. Después de +1 hora: ${currentDate.toString()}`);
  
  // Convertir de vuelta a UTC
  const finalUtc = fromZonedTime(currentDate, TIMEZONE);
  console.log(`9. Convertido a UTC: ${finalUtc.toISOString()}`);
}

debugStepByStep().catch(console.error);