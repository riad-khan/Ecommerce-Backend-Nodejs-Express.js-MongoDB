require('express-async-errors');
const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./routers/userRouter');
const error = require('./middlewares/error');
const categoryRouter = require('./routers/categoryRouter');
const productRouters = require('./routers/productRouter')

app.use(express.json());
app.use(cors());
app.use('/api/user',userRouter);
app.use('/api/category',categoryRouter);
app.use('/api/product',productRouters)


app.use(error)

module.exports = app ;