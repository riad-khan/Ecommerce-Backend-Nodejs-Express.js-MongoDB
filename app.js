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

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
    });

    app.use(
        cors({
           origin: "http://localhost:3000", 
           // allow to server to accept request from different origin
           methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
           credentials: true // allow session cookie from browser to pass through
             })
          );

module.exports = app;