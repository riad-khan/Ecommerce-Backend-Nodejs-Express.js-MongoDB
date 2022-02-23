require('express-async-errors');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const error = require('./middlewares/error');
require('./middlewares')(app);
require('./routes')(app);
app.use(error)

module.exports = app;