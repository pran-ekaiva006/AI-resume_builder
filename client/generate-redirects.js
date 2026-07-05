import fs from 'fs';

// Default to the known Render URL if VITE_BACKEND_URL is not set during Netlify build
const backendUrl = process.env.VITE_BACKEND_URL || 'https://ai-resume-builder-6-o5vo.onrender.com';

const redirects = `
/api/*  ${backendUrl}/api/:splat  200!
/*      /index.html   200
`;

fs.writeFileSync('dist/_redirects', redirects.trim());
console.log('✅ Generated Netlify _redirects file for API proxying.');
