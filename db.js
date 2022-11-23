const { Pool } = require('pg');

if (process.env.NODE_ENV === 'development') {
  const pool = new Pool({
    host: 'localhost',
    user: 'karl',
    database: 'players',
    password: 'karl123',
    port: 5432,
  });
} else {
  const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});
}

module.exports = pool;
