const { Pool } = require('pg');


const pool = new Pool({
    host: 'localhost',
    user: 'karl',
    database: 'players',
    password: 'karl123',
    port: 5432,
  });

module.exports = pool;
