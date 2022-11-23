const { Pool } = require('pg');


const pool = new Pool({
    host: 'localhost',
    user: 'karl',
    database: 'players',
    password: 'karl123',
    port: 5432,
  });

  // const connectionString = process.env.DATABASE_URL;
  // const pool = new Pool({
  //   connectionString,
  // });


// let pool;

// if (process.env.NODE_ENV === 'development') {
//   pool = new Pool({
//     host: 'localhost',
//     user: 'karl',
//     database: 'players',
//     password: 'karl123',
//     port: 5432,
//   });
// } else {

// };

module.exports = pool;
