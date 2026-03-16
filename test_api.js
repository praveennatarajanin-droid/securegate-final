const API_BASE_URL = 'http://localhost:8000/api';

async function testApi() {
  console.log('--- Testing Expanded Society API ---');

  try {
    // 1. Create Society with all fields
    console.log('\n1. Creating Society with expanded fields...');
    const societyRes = await fetch(`${API_BASE_URL}/societies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Antigravity Heights ' + Date.now(),
        type: 'Residential',
        email: 'contact@antigravity.com',
        phone: '+91 98765 43210',
        address: '99 Quantum Loop',
        city: 'Silicon City',
        state: 'Quantum State',
        postal_code: 'Q1-0101',
        unit_count: 500
      })
    });
    const societyData = await societyRes.json();
    console.log('Response:', societyData);
    if (!societyData.success) throw new Error('Society creation failed: ' + JSON.stringify(societyData));
    
    console.log('\n--- API Verification Passed ---');
  } catch (error) {
    console.error('\n--- API Verification Failed ---');
    console.error(error.message);
    process.exit(1);
  }
}

testApi();
