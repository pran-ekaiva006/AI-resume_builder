const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/demo-login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': 0
  }
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log("demo-login response:", data);
    
    // Extract cookies
    const setCookie = res.headers['set-cookie'];
    if (!setCookie) { console.log("No cookies"); process.exit(1); }
    
    const cookies = setCookie.map(c => c.split(';')[0]).join('; ');
    
    const meOptions = {
      hostname: 'localhost',
      port: 5001,
      path: '/api/auth/me',
      method: 'GET',
      headers: {
        'Cookie': cookies
      }
    };
    
    const meReq = http.request(meOptions, (meRes) => {
      let meData = '';
      meRes.on('data', (chunk) => { meData += chunk; });
      meRes.on('end', () => {
        console.log("me response:", meData);
        process.exit(0);
      });
    });
    meReq.end();
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});
req.end();
