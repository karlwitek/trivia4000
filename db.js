const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  database: 'players',
  port: 5432,
});

module.exports = pool;
