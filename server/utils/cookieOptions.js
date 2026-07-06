const getCookieOptions = (type = 'access') => {
  return {
    httpOnly: true,
    secure: true, // required for sameSite: 'none'
    sameSite: 'none', // allows cross-site cookies (e.g. frontend on Netlify, backend on Render)
    maxAge: type === 'refresh' ? 30 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000 // 30 days or 15 mins
  };
};

module.exports = getCookieOptions;
