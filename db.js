const { Pool } = require('pg');

const pool = new Pool({
  host: 'http://trivia4000.herokuapp.com',
  user: 'karl',
  database: 'players',
  password: 'karl123',
  port: 5432,
});

module.exports = pool;
