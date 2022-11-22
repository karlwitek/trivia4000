const { Pool } = require('pg');

const pool = new Pool({
  host: 'postgresql-vertical-71910',
  user: 'karl',
  database: 'players',
  password: 'karl123',
  port: 5432,
});

module.exports = pool;
