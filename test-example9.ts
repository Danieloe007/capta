import { calculateBusinessDate } from './src/services/date.service';

async function testExample9() {
  console.log('Testing example 9...');

  // date=2025-04-10T15:00:00.000Z, days=5, hours=4
  const result = await calculateBusinessDate(5, 4, "2025-04-10T15:00:00.000Z");
  console.log('Result:', result);

  // Expected: 2025-04-21T20:00:00.000Z
  if (result === '2025-04-21T20:00:00.000Z') {
    console.log('✅ Matches expected');
  } else {
    console.log('❌ Does not match, expected 2025-04-21T20:00:00.000Z');
  }
}

testExample9().catch(console.error);