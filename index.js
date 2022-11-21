const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const router = require('./routes/router.js');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
dotenv.config({ path: './config/config.env'});

app.use('/', router);



app.listen(PORT, console.log(`server running on port: ${PORT}`));