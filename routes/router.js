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
   });
});

router.get('/', (req, res) => {
  res.status(200);
  res.sendFile(path.join(__dirname, '../index.html'));
});

router.get('/data', (req, res) => {
  console.log('in data route');

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
  pool.query('SELECT * FROM users WHERE active=true', (err, result) => {
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
      process.exit(1);
    } else {
      res.send(result.rows);
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
  let gameStatsObj = req.body.gameStats;
  let filterObj = req.body.filter;
  
  let query = 'UPDATE users SET correct=correct + $1, incorrect = incorrect + $2, totalguesses=totalguesses + $3, numgamesplayed = numgamesplayed + 1 WHERE username = $4 AND userpassword = $5';

  pool.query(query, [gameStatsObj.correct, gameStatsObj.incorrect, gameStatsObj.totalGuesses, filterObj.username, filterObj.userpassword], (err, result) => {
    if (err) {
      console.log(err.stack);
      process.exit(1);
    } else {
      res.send('updated');
    }
  });
});

module.exports = router;