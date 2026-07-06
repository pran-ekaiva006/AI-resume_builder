const express = require('express');
const app = express();

const routesToTest = ['/*', '/(.*)', '/:path(.*)', '/{*path}'];

for (const route of routesToTest) {
  try {
    app.get(route, (req, res) => {});
    console.log(`✅ Route "${route}" is valid!`);
  } catch (e) {
    console.log(`❌ Route "${route}" failed: ${e.message}`);
  }
}
process.exit(0);
