const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');
const productRouters = require('./routers/productRouter');
const CartRouters = require('./routers/cartRouter');
const ProfileRouters = require('./routers/Profile')

module.exports = (app)=>{
   
    app.use('/api/user',userRouter);
    app.use('/api/category',categoryRouter);
    app.use('/api/product',productRouters);
    app.use('/api/cart',CartRouters);
    app.use('/api/profile',ProfileRouters);
}