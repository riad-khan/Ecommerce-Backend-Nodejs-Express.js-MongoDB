const userRouter = require('./routers/userRouter');
const categoryRouter = require('./routers/categoryRouter');
const productRouters = require('./routers/productRouter');
const CartRouters = require('./routers/cartRouter');
const ProfileRouters = require('./routers/Profile');
const PaymentRouter = require('./routers/paymentRouter');

module.exports = (app)=>{
   
    app.use('/api/user',userRouter);
    app.use('/api/category',categoryRouter);
    app.use('/api/product',productRouters);
    app.use('/api/cart',CartRouters);
    app.use('/api/profile',ProfileRouters);
    app.use('/api/payment',PaymentRouter)
}