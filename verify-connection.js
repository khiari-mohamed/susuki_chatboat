#!/usr/bin/env node

/**
 * Connection Verification Script
 * Tests frontend-backend connectivity
 */

const http = require('http');

const BACKEND_PORT = process.env.PORT || 8000;
const FRONTEND_PORT = 3000;

console.log('🔍 Suzuki Chatbot - Connection Verification\n');

// Test Backend
function testBackend() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${BACKEND_PORT}/`, (res) => {
      console.log(`✅ Backend: Running on port ${BACKEND_PORT} (Status: ${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', () => {
      console.log(`❌ Backend: NOT running on port ${BACKEND_PORT}`);
      console.log(`   → Start with: cd suzuki-backend && npm run start:dev`);
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      console.log(`❌ Backend: Timeout on port ${BACKEND_PORT}`);
      resolve(false);
    });
  });
}

// Test Frontend
function testFrontend() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${FRONTEND_PORT}/`, (res) => {
      console.log(`✅ Frontend: Running on port ${FRONTEND_PORT} (Status: ${res.statusCode})`);
      resolve(true);
    });
    
    req.on('error', () => {
      console.log(`❌ Frontend: NOT running on port ${FRONTEND_PORT}`);
      console.log(`   → Start with: cd chatboat && npm start`);
      resolve(false);
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      console.log(`❌ Frontend: Timeout on port ${FRONTEND_PORT}`);
      resolve(false);
    });
  });
}

// Test API Endpoint
function testAPI() {
  return new Promise((resolve) => {
    const postData = JSON.stringify({ message: 'test' });
    
    const options = {
      hostname: 'localhost',
      port: BACKEND_PORT,
      path: '/chat/message',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length,
        'Origin': `http://localhost:${FRONTEND_PORT}`
      }
    };
    
    const req = http.request(options, (res) => {
      console.log(`✅ API Endpoint: /chat/message responding (Status: ${res.statusCode})`);
      
      if (res.headers['access-control-allow-origin']) {
        console.log(`✅ CORS: Enabled for ${res.headers['access-control-allow-origin']}`);
      } else {
        console.log(`⚠️  CORS: Headers not found (might be blocked)`);
      }
      
      resolve(true);
    });
    
    req.on('error', (error) => {
      console.log(`❌ API Endpoint: Failed to connect`);
      console.log(`   Error: ${error.message}`);
      resolve(false);
    });
    
    req.setTimeout(3000, () => {
      req.destroy();
      console.log(`❌ API Endpoint: Timeout`);
      resolve(false);
    });
    
    req.write(postData);
    req.end();
  });
}

// Run all tests
async function runTests() {
  const backendOk = await testBackend();
  const frontendOk = await testFrontend();
  
  console.log('');
  
  if (backendOk) {
    await testAPI();
  }
  
  console.log('\n📋 Summary:');
  console.log(`   Backend:  ${backendOk ? '✅ OK' : '❌ NOT RUNNING'}`);
  console.log(`   Frontend: ${frontendOk ? '✅ OK' : '❌ NOT RUNNING'}`);
  
  if (backendOk && frontendOk) {
    console.log('\n🎉 All systems operational!');
    console.log(`   Frontend: http://localhost:${FRONTEND_PORT}`);
    console.log(`   Backend:  http://localhost:${BACKEND_PORT}`);
  } else {
    console.log('\n⚠️  Some services are not running. Please start them.');
  }
}

runTests();
