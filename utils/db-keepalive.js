const cron = require('node-cron');
const sequelize = require('../database/db');

// Free-tier Postgres providers (Supabase, Neon, Render, etc.) commonly pause
// or suspend the database after a period of inactivity, which then shows up
// as a slow/failed first query. This periodically pings the DB to keep it awake.
const ENABLED = process.env.DB_KEEPALIVE_ENABLED !== 'false';
const SCHEDULE = process.env.DB_KEEPALIVE_CRON || '*/5 * * * *';

const startDbKeepAlive = () => {
    if (!ENABLED) return;

    if (!cron.validate(SCHEDULE)) {
        console.error(`Invalid DB_KEEPALIVE_CRON expression "${SCHEDULE}" — database keep-alive disabled.`);
        return;
    }

    cron.schedule(SCHEDULE, async () => {
        try {
            await sequelize.query('SELECT 1');
        } catch (err) {
            console.error('DB keep-alive ping failed:', err.message);
        }
    });

    console.log(`Database keep-alive scheduled (${SCHEDULE}).`);
};

module.exports = { startDbKeepAlive };
