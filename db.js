const { Pool } = require('pg');
let pool;

if (process.env.NODE_ENV === 'development') {
  pool = new Pool({
    host: 'localhost',
    user: 'karl',
    database: 'players',
    password: 'karl123',
    port: 5432,
  });
} else {
  const connectionString = process.env.DATABASE_URL;
pool = new Pool({
  connectionString,
});
}

module.exports = pool;
