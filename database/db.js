const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    logging: (msg) => {
        if (msg && msg.includes('ERROR')) {
            console.error(msg);
        }
    }
});

module.exports = sequelize;