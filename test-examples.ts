import { calculateBusinessDate } from './src/services/date.service';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const TIMEZONE = 'America/Bogota';

interface TestCase {
  name: string;
  startDate: string; // UTC
  days?: number;
  hours?: number;
  expectedDescription: string;
}

const testCases: TestCase[] = [
  {
    name: "Ejemplo 1: Viernes 5:00 PM + 1 hora",
    startDate: "2025-01-17T22:00:00.000Z", // Viernes 5:00 PM Colombia
    hours: 1,
    expectedDescription: "Lunes 9:00 AM Colombia (14:00 UTC)"
  },
  {
    name: "Ejemplo 2: Sábado 2:00 PM + 1 hora", 
    startDate: "2025-01-18T19:00:00.000Z", // Sábado 2:00 PM Colombia
    hours: 1,
    expectedDescription: "Lunes 9:00 AM Colombia (14:00 UTC)"
  },
  {
    name: "Ejemplo 3: Martes 3:00 PM + 1 día + 3 horas",
    startDate: "2025-01-14T20:00:00.000Z", // Martes 3:00 PM Colombia
    days: 1,
    hours: 3,
    expectedDescription: "Jueves 10:00 AM Colombia (15:00 UTC)"
  },
  {
    name: "Ejemplo 4: Domingo 6:00 PM + 1 día",
    startDate: "2025-01-19T23:00:00.000Z", // Domingo 6:00 PM Colombia
    days: 1,
    expectedDescription: "Martes 8:00 AM Colombia (13:00 UTC)"
  },
  {
    name: "Ejemplo 5: Día laboral 8:00 AM + 8 horas",
    startDate: "2025-01-15T13:00:00.000Z", // Miércoles 8:00 AM Colombia
    hours: 8,
    expectedDescription: "Mismo día 5:00 PM Colombia (22:00 UTC)"
  },
  {
    name: "Ejemplo 6: Día laboral 8:00 AM + 1 día",
    startDate: "2025-01-15T13:00:00.000Z", // Miércoles 8:00 AM Colombia
    days: 1,
    expectedDescription: "Jueves 8:00 AM Colombia (13:00 UTC)"
  },
  {
    name: "Ejemplo 7: Día laboral 12:30 PM + 1 día",
    startDate: "2025-01-15T17:30:00.000Z", // Miércoles 12:30 PM Colombia
    days: 1,
    expectedDescription: "Jueves 1:30 PM Colombia (18:30 UTC)"
  },
  {
    name: "Ejemplo 8: Día laboral 11:30 AM + 3 horas",
    startDate: "2025-01-15T16:30:00.000Z", // Miércoles 11:30 AM Colombia
    hours: 3,
    expectedDescription: "Mismo día 3:30 PM Colombia (20:30 UTC)"
  }
];

async function runTests() {
  console.log('🧪 Ejecutando pruebas de ejemplos de la especificación...\n');
  
  for (const testCase of testCases) {
    try {
      console.log(`📋 ${testCase.name}`);
      
      // Mostrar fecha de inicio en Colombia
      const startDateColombia = toZonedTime(new Date(testCase.startDate), TIMEZONE);
      console.log(`   Inicio: ${startDateColombia.toLocaleString('es-CO', { timeZone: TIMEZONE })} (Colombia)`);
      console.log(`   Parámetros: days=${testCase.days || 0}, hours=${testCase.hours || 0}`);
      
      // Ejecutar cálculo
      const result = await calculateBusinessDate(testCase.days, testCase.hours, testCase.startDate);
      
      // Mostrar resultado en Colombia y UTC
      const resultDateColombia = toZonedTime(new Date(result), TIMEZONE);
      console.log(`   Resultado: ${resultDateColombia.toLocaleString('es-CO', { timeZone: TIMEZONE })} (Colombia)`);
      console.log(`   UTC: ${result}`);
      console.log(`   Esperado: ${testCase.expectedDescription}`);
      console.log('   ✅ Ejecutado correctamente\n');
      
    } catch (error) {
      console.log(`   ❌ Error: ${error}`);
      console.log('');
    }
  }
  
  // Prueba adicional con festivos
  console.log('🎉 Prueba con festivos (Abril 2025):');
  try {
    const result = await calculateBusinessDate(5, 4, "2025-04-10T15:00:00.000Z");
    const resultDateColombia = toZonedTime(new Date(result), TIMEZONE);
    console.log(`   Resultado: ${resultDateColombia.toLocaleString('es-CO', { timeZone: TIMEZONE })} (Colombia)`);
    console.log(`   UTC: ${result}`);
    console.log('   ✅ Prueba con festivos ejecutada\n');
  } catch (error) {
    console.log(`   ❌ Error en prueba con festivos: ${error}\n`);
  }
  
  // Prueba de rendimiento con grandes cantidades
  console.log('⚡ Prueba de rendimiento (100 días + 50 horas):');
  try {
    const startTime = Date.now();
    const result = await calculateBusinessDate(100, 50, "2025-01-15T13:00:00.000Z");
    const endTime = Date.now();
    
    const resultDateColombia = toZonedTime(new Date(result), TIMEZONE);
    console.log(`   Resultado: ${resultDateColombia.toLocaleString('es-CO', { timeZone: TIMEZONE })} (Colombia)`);
    console.log(`   UTC: ${result}`);
    console.log(`   Tiempo de ejecución: ${endTime - startTime}ms`);
    console.log('   ✅ Prueba de rendimiento completada\n');
  } catch (error) {
    console.log(`   ❌ Error en prueba de rendimiento: ${error}\n`);
  }
}

runTests().catch(console.error);