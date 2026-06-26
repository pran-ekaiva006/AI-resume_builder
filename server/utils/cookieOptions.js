const getCookieOptions = (type = 'access') => {
  const isProd = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: type === 'refresh' ? 30 * 24 * 60 * 60 * 1000 : 15 * 60 * 1000 // 30 days or 15 mins
  };
};

module.exports = getCookieOptions;
