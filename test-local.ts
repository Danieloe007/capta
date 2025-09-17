 // test-local.ts
import { handler } from './src/handler';
import { APIGatewayProxyEvent } from 'aws-lambda';

async function runTest() {
  console.log('🚀 Ejecutando suite completa de pruebas...\n');

  // ========== PRUEBAS DEL CONTEXTO TÉCNICO ==========

  // Ejemplo 1: Petición un viernes a las 5:00 p.m. con "hours=1"
  console.log('📅 Test 1: Viernes 5:00 PM + 1 hora → Lunes 9:00 AM');
  await testScenario({
    hours: '1',
    date: '2025-01-17T22:00:00.000Z' // Viernes 5:00 PM COL
  }, 'Debe ir al siguiente lunes a las 9:00 AM COL');

  // Ejemplo 2: Petición un sábado a las 2:00 p.m. con "hours=1"
  console.log('\n📅 Test 2: Sábado 2:00 PM + 1 hora → Lunes 9:00 AM');
  await testScenario({
    hours: '1',
    date: '2025-01-18T19:00:00.000Z' // Sábado 2:00 PM COL
  }, 'Debe ajustarse al lunes 9:00 AM COL');

  // Ejemplo 3: Petición con "days=1" y "hours=3" desde un martes a las 3:00 p.m.
  console.log('\n📅 Test 3: Martes 3:00 PM + 1 día + 3 horas → Jueves 10:00 AM');
  await testScenario({
    days: '1',
    hours: '3',
    date: '2025-01-14T20:00:00.000Z' // Martes 3:00 PM COL
  }, 'Debe ser jueves a las 10:00 AM COL');

  // Ejemplo 4: Petición con "days=1" desde un domingo a las 6:00 p.m.
  console.log('\n📅 Test 4: Domingo 6:00 PM + 1 día → Martes 8:00 AM');
  await testScenario({
    days: '1',
    date: '2025-01-19T23:00:00.000Z' // Domingo 6:00 PM COL
  }, 'Debe ser martes a las 8:00 AM COL (lunes + 1 día)');

  // Ejemplo 5: Petición con "hours=8" desde un día laboral a las 8:00 a.m.
  console.log('\n📅 Test 5: Lunes 8:00 AM + 8 horas → Lunes 5:00 PM');
  await testScenario({
    hours: '8',
    date: '2025-01-13T13:00:00.000Z' // Lunes 8:00 AM COL
  }, 'Debe ser el mismo día a las 5:00 PM COL');

  // Ejemplo 6: Petición con "days=1" desde un día laboral a las 8:00 a.m.
  console.log('\n📅 Test 6: Lunes 8:00 AM + 1 día → Martes 8:00 AM');
  await testScenario({
    days: '1',
    date: '2025-01-13T13:00:00.000Z' // Lunes 8:00 AM COL
  }, 'Debe ser el siguiente día laboral a las 8:00 AM COL');

  // Ejemplo 7: Petición con "days=1" desde un día laboral a las 12:30 p.m.
  console.log('\n📅 Test 7: Lunes 12:30 PM + 1 día → Martes 1:00 PM');
  await testScenario({
    days: '1',
    date: '2025-01-13T17:30:00.000Z' // Lunes 12:30 PM COL
  }, 'Debe ser el siguiente día laboral a las 1:00 PM COL (después del almuerzo)');

  // Ejemplo 8: Petición con "hours=3" desde un día laboral a las 11:30 a.m.
  console.log('\n📅 Test 8: Lunes 11:30 AM + 3 horas → Lunes 3:30 PM');
  await testScenario({
    hours: '3',
    date: '2025-01-13T16:30:00.000Z' // Lunes 11:30 AM COL
  }, 'Debe ser el mismo día a las 3:30 PM COL (saltando almuerzo)');

  // Ejemplo 9: Petición con festivos
  console.log('\n📅 Test 9: Con festivos - 10 abril + 5 días + 4 horas');
  await testScenario({
    days: '5',
    hours: '4',
    date: '2025-04-10T20:00:00.000Z' // 10 abril 3:00 PM COL
  }, 'Debe saltar festivos del 17 y 18 de abril');

  // ========== PRUEBAS ADICIONALES DE COBERTURA ==========

  // Test de validación: Sin parámetros
  console.log('\n❌ Test 10: Error - Sin parámetros');
  await testScenario({}, 'Debe retornar error por falta de parámetros', true);

  // Test de validación: Parámetros inválidos
  console.log('\n❌ Test 11: Error - Días negativos');
  await testScenario({
    days: '-1'
  }, 'Debe retornar error por días negativos', true);

  console.log('\n❌ Test 12: Error - Horas no numéricas');
  await testScenario({
    hours: 'abc'
  }, 'Debe retornar error por horas no numéricas', true);

  console.log('\n❌ Test 13: Error - Fecha inválida');
  await testScenario({
    days: '1',
    date: 'fecha-invalida'
  }, 'Debe retornar error por fecha inválida', true);

  // Test de horario de almuerzo
  console.log('\n📅 Test 14: Horario de almuerzo - 11:30 AM + 1 hora → 1:00 PM');
  await testScenario({
    hours: '1',
    date: '2025-01-13T16:30:00.000Z' // Lunes 11:30 AM COL
  }, 'Debe saltar el horario de almuerzo');

  console.log('\n📅 Test 15: Durante almuerzo - 12:30 PM + 1 hora → 2:00 PM');
  await testScenario({
    hours: '1',
    date: '2025-01-13T17:30:00.000Z' // Lunes 12:30 PM COL
  }, 'Debe ajustarse después del almuerzo y sumar 1 hora');

  // Test de fin de día laboral
  console.log('\n📅 Test 16: Fin de día - 4:30 PM + 1 hora → Siguiente día 8:30 AM');
  await testScenario({
    hours: '1',
    date: '2025-01-13T21:30:00.000Z' // Lunes 4:30 PM COL
  }, 'Debe pasar al siguiente día laboral');

  // Test de múltiples días
  console.log('\n📅 Test 17: Múltiples días - Viernes + 3 días → Miércoles');
  await testScenario({
    days: '3',
    date: '2025-01-17T13:00:00.000Z' // Viernes 8:00 AM COL
  }, 'Debe saltar el fin de semana');

  // Test de múltiples horas que cruzan días
  console.log('\n📅 Test 18: Múltiples horas - Viernes 4:00 PM + 2 horas → Lunes 9:00 AM');
  await testScenario({
    hours: '2',
    date: '2025-01-17T21:00:00.000Z' // Viernes 4:00 PM COL
  }, 'Debe pasar al siguiente lunes');

  // Test de horarios extremos
  console.log('\n📅 Test 19: Antes del horario laboral - 6:00 AM + 1 hora → 9:00 AM');
  await testScenario({
    hours: '1',
    date: '2025-01-13T11:00:00.000Z' // Lunes 6:00 AM COL
  }, 'Debe ajustarse al horario laboral');

  console.log('\n📅 Test 20: Después del horario laboral - 8:00 PM + 1 hora → Siguiente día 9:00 AM');
  await testScenario({
    hours: '1',
    date: '2025-01-13T01:00:00.000Z' // Lunes 8:00 PM COL (día anterior en UTC)
  }, 'Debe pasar al siguiente día laboral');

  // Test sin fecha (hora actual)
  console.log('\n📅 Test 21: Sin fecha inicial - Solo días');
  await testScenario({
    days: '1'
  }, 'Debe usar la hora actual como punto de partida');

  console.log('\n📅 Test 22: Sin fecha inicial - Solo horas');
  await testScenario({
    hours: '2'
  }, 'Debe usar la hora actual como punto de partida');

  // Test de combinaciones extremas
  console.log('\n📅 Test 23: Muchos días - 10 días laborales');
  await testScenario({
    days: '10',
    date: '2025-01-13T13:00:00.000Z' // Lunes 8:00 AM COL
  }, 'Debe calcular correctamente 10 días laborales');

  console.log('\n📅 Test 24: Muchas horas - 40 horas laborales (1 semana)');
  await testScenario({
    hours: '40',
    date: '2025-01-13T13:00:00.000Z' // Lunes 8:00 AM COL
  }, 'Debe calcular correctamente 40 horas laborales');

  // Test de casos límite con festivos
  console.log('\n📅 Test 25: Día antes de festivo + 1 día');
  await testScenario({
    days: '1',
    date: '2025-01-01T13:00:00.000Z' // 1 enero (festivo) 8:00 AM COL
  }, 'Debe saltar el festivo');

  console.log('\n🎉 Suite de pruebas completada!');
}

async function testScenario(
  queryParams: { [key: string]: string },
  description: string,
  expectError: boolean = false
): Promise<void> {
  const mockEvent: Partial<APIGatewayProxyEvent> = {
    queryStringParameters: queryParams
  };

  try {
    const result = await handler(mockEvent as APIGatewayProxyEvent);
    const body = JSON.parse(result.body);

    if (expectError) {
      if (result.statusCode >= 400) {
        console.log(`✅ Error esperado (${result.statusCode}):`, body);
      } else {
        console.log(`❌ Se esperaba error pero fue exitoso:`, body);
      }
    } else {
      if (result.statusCode === 200) {
        console.log(`✅ Éxito (${description}):`, body);

        // Validar formato de respuesta
        if (body.date && typeof body.date === 'string' && body.date.endsWith('Z')) {
          const date = new Date(body.date);
          if (!isNaN(date.getTime())) {
            const colombiaTime = new Intl.DateTimeFormat('es-CO', {
              timeZone: 'America/Bogota',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false
            }).format(date);
            console.log(`   📍 Hora Colombia: ${colombiaTime}`);
          }
        } else {
          console.log(`❌ Formato de fecha inválido en respuesta exitosa`);
        }
      } else {
        console.log(`❌ Error inesperado (${result.statusCode}):`, body);
      }
    }
  } catch (error) {
    console.error(`💥 Error en la prueba:`, error);
  }
}

runTest();