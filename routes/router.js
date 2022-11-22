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
router.get('/data', (req, res) => {// type in url to see data
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

router.get('/find', (req, res) => {
  pool.query('SELECT* FROM users WHERE active=true', (err, result) => {
    if (err) {
      console.log(err.stack);
      process.exit(1);
    } else {
      res.send(result.rows[0]);
    }
  });
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
  pool.query('UPDATE users SET active=true WHERE username=$1 AND userpassword=$2', [req.body.username, req.body.userpassword],
   (err, result) => {
    if (err) {
      console.log(err.stack);
      process.exit(1);
    } else {
      res.send('made user active');
    }
   });
});

router.post('/update', (req, res) => {
  let query = 'UPDATE users SET correct=correct + req.body.gameStats.correct' +
   'incorrect=incorrect + req.body.gameStats.incorrect' +
   'totalGuesses=totalGuesses + req.body.gameStats.totalGuesses WHERE' +
    'username=req.body.filter.username AND userpassword=req.body.filter.userpassword';
  pool.query(query, (err, result) => {
    if (err) {
      console.log(err.stack);
      process.exit(1);
    } else {
      res.send('updated');
    }
  });
});

module.exports = router;