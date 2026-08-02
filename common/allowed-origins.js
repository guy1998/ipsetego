require('dotenv').config();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:8080,http://localhost:8081')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

module.exports = allowedOrigins;
