const express = require('express');
const dotenv = require('dotenv');
const router = require('./routes/router.js');

const app = express();

const PORT = process.env.PORT || 3000;

// app.use('/', router);



app.listen(PORT, console.log(`server running on port: ${PORT}`));