const express = require('express');
const router = express.Router();
const pool = require('../db');
const path = require('path');

router.use(express.json());

router.get('/reset', (req, res) => {
  pool.query('UPDATE users SET active=false WHERE active=true',
   (err, result) => {
    if (err) {
      console.log(err.stack);
      process.exit(1);
    } else {
      res.send('reset');
    }
   })
});

router.get('/', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, '../index.html'));
});

// test route to inspect data
router.get('/testdata', (req, res) => {// type in url to see data
  pool.query('SELECT * FROM users', (err, result) => {
    if (err) {
      console.log(err.stack);
      process.exit(1);
    } else {
      res.send(result.rows);
    }
  });
});

router.get('/game', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, '../game.html'));
});

// posts

router.post('/login', (req, res) => {
  pool.query('SELECT * FROM users WHERE username=$1 AND userpassword=$2', [req.body.username, req.body.userpassword],
   (err, result) => {
    if (err) {
      console.log(err.stack);
      process.exit(1);// ..??
    } else {
      res.send(result.rows);// is []
    };

   });
});

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

router.post('/active', (req, res) => {
  pool.query('UPDATE users WHERE username=$1 AND userpassword=$2', [req.body.username, req.body.userpassword],
   (err, result) => {
    if (err) {
      console.log(err.stack);
      process.exit(1);
    } else {
      res.send('made user active');
    }
   });
});

// router.use('/', (req, res) => {
//   pool.query('SELECT * FROM users', (err, result) => {
//     if (err) { console.log(err.stack); }
//     res.send(result.rows);
//   });
// });


module.exports = router;