import { calculateBusinessDate } from './src/services/date.service';

async function testFix() {
  console.log('Testing the fix...');

  // Same input as test-functions.ts
  const result = await calculateBusinessDate(0, 1, "2025-01-17T22:00:00.000Z");
  console.log('Result:', result);

  // Expected: 2025-01-20T14:00:00.000Z
  if (result === '2025-01-20T14:00:00.000Z') {
    console.log('✅ Fix successful!');
  } else {
    console.log('❌ Fix failed, got:', result);
  }
}

testFix().catch(console.error);