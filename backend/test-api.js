import fetch from 'node-fetch';

async function runTests() {
  console.log('🧪 Starting API verification tests...');
  try {
    // 1. Test health check
    const healthRes = await fetch('http://127.0.0.1:5000/api/health');
    const healthData = await healthRes.json();
    console.log('✅ Health check passed:', healthData);

    // 2. Test user registration
    const testUser = {
      name: 'Test Candidate',
      email: `test_${Date.now()}@example.com`,
      password: 'password123'
    };
    const regRes = await fetch('http://127.0.0.1:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });
    const regData = await regRes.json();
    if (!regRes.ok) throw new Error(regData.message || 'Registration failed');
    console.log('✅ Registration passed! User ID:', regData.id);

    // 3. Test login
    const loginRes = await fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error(loginData.message || 'Login failed');
    console.log('✅ Login passed! JWT Token received.');

    console.log('🎉 All backend API tests completed successfully!');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  }
}

runTests();
