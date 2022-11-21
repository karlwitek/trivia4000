const express = require('express');
const router = express.Router();
const pool = require('../db');
const path = require('path');

router.use(express.json());

router.get('/', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, '../index.html'));
});

// posts

router.post('/new', (req, res) => {
  pool.query('INSERT INTO users(username, userpassword) VALUES($1, $2)', [req.body.username, req.body.userpassword],
    (err, result) => {
      if (err) {
        console.log(err.stack);
        process.exit(1);
      } else {
        res.send('new user saved.');
      };
    });
});


// router.use('/', (req, res) => {
//   pool.query('SELECT * FROM users', (err, result) => {
//     if (err) { console.log(err.stack); }
//     res.send(result.rows);
//   });
// });


module.exports = router;