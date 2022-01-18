const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');
const productRouters = require('./routers/productRouter')

module.exports = (app)=>{
    app.use('/api/user',userRouter);
    app.use('/api/category',categoryRouter);
    app.use('/api/product',productRouters)
}