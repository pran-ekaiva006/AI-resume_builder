import fs from 'fs';

// Use the VITE_BACKEND_URL environment variable set in your frontend hosting
// platform (e.g. Netlify). Update this fallback to your actual Vercel backend URL.
const backendUrl = process.env.VITE_BACKEND_URL || 'https://your-backend.vercel.app';

const redirects = `
/api/*  ${backendUrl}/api/:splat  200!
/*      /index.html   200
`;

fs.writeFileSync('dist/_redirects', redirects.trim());
console.log('✅ Generated Netlify _redirects file for API proxying.');
