require('express-async-errors');
const compression = require('compression')
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(compression());
const error = require('./middlewares/error');
require('./middlewares')(app);
require('./routes')(app);
app.use(error)

module.exports = app;