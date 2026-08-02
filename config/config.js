require('dotenv').config();

// Used by sequelize-cli (npm run migrate / makemigrations) — kept in sync
// with database/db.js, which is what the running app actually connects with.
const config = {
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE,
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
};

module.exports = {
    development: config,
    test: config,
    production: config,
};
