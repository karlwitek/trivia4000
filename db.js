const { Pool } = require('pg');

// const pool = new Pool({
//   host: 'trivia4000.herokuapp.com',
//   user: 'karl',
//   database: 'players',
//   password: 'karl123',
//   port: 5432,
// });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({
  connectionString,
});

module.exports = pool;
