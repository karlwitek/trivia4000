const express = require('express');
const dotenv = require('dotenv');
const router = require('./routes/router.js');

const pool = require('./db');

const app = express();

const PORT = process.env.PORT || 3000;

// app.use('/', router);

app.use('/', (req, res) => {
  pool.query('SELECT * FROM users', (err, result) => {
    if (err) { console.log(err.stack); }
    res.send(result.rows);
  });
});

app.listen(PORT, console.log(`server running on port: ${PORT}`));