require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./routers/userRouter');
const error = require('./middlewares/error')

app.use(express.json());
app.use(cors());
app.use('/api/user',userRouter);


app.use(error)

module.exports = app ;