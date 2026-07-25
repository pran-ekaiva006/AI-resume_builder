const https = require('https');

const origins = [
  'http://localhost:5173',
  'https://ai-resume-builder-frontend-umber.vercel.app',
  'https://ai-resume-builder-frontend-umber.vercel.app/',
  'https://capable-churros-e51954.netlify.app'
];

async function testOrigin(origin) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'ai-resume-builder-omega-sandy.vercel.app',
      path: '/api/auth/demo-login',
      method: 'OPTIONS',
      headers: {
        'Origin': origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    };

    const req = https.request(options, (res) => {
      console.log(`Origin: ${origin}`);
      console.log(`Status: ${res.statusCode}`);
      console.log(`Access-Control-Allow-Origin: ${res.headers['access-control-allow-origin'] || 'MISSING'}\n`);
      resolve();
    });

    req.on('error', (e) => {
      console.error(e);
      resolve();
    });
    req.end();
  });
}

async function run() {
  for (const origin of origins) {
    await testOrigin(origin);
  }
}

run();
