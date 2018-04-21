const env = process.env.NODE_ENV || 'development';

if (env === 'development') {
  const config = require('./config.json');
  process.env.SESSION_SECRET = config.SESSION_SECRET;
}
