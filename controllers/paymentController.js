
const { Cart } = require("../models/Cart");
const { Profile } = require("../models/Profile");
const { Order } = require('../models/Order');
const { Payment } = require('../models/Payment');
const path = require('path');
const nodeMailer = require('nodemailer');
const hbs  = require('nodemailer-express-handlebars');




const PaymentSession = require("ssl-commerz-node").PaymentSession;
require("dotenv").config();

module.exports.ipn = async (req, res) => {
    const payment = new Payment(req.body);
    const tran_id = payment['tran_id'];
    if (payment['status'] === "VALID") {
        const order = await Order.updateOne({ tran_id: tran_id }, { paymentStatus: 'complete' });

        await Cart.deleteMany(order.cartItems);
    } else {
        await Order.deleteOne({ tran_id: tran_id });
    }
    await payment.save();
    return res.status(201).send('IPN message saved');


}

module.exports.initPayment = async (req, res) => {
    const cartItem = await Cart.find({ user: req.user.id }).populate('product','name')
    const total_amount = cartItem.map(item => item.count * item.price).reduce((a, b) => a + b, 0);
    const total_item = cartItem.map(item => item.count).reduce((a, b) => a + b, 0)
    const transectionId = '_' + Math.random().toString(36).substring(2, 9) + (new Date()).getTime();

    const profile = await Profile.findOne({ userId: req.user.id })
    const {phone, country, address, city, postCode } = profile
    
   const product = cartItem.product

    const payment = new PaymentSession(
        true,
        process.env.SSLCOMMERZ_STORE_ID,
        process.env.SSLCOMMERZ_STORE_PASSWORD
    );

    //email send with node mailer
        //step 1
    const transporter = nodeMailer.createTransport({
       host:'cwp.xpress.ltd',
       port: 465,
        auth: {
            user: 'info@riadhossain.me',
            pass: 'Diit54321@#$'
        }
    })

    

    const handlebarsOptions ={
        viewEngine : {
            extName : ".hbs",
            partialDir : path.join(__basedir + '/views'),
            defaultLayout : false,
        },
        viewPath : path.join(__basedir + '/views'),
        extName : '.hbs',
       
    }
    transporter.use('compile',hbs(handlebarsOptions))

console.log(product);
    
    const mailOptions = {
        from : 'info@riadhossain.me',
        to: `${profile.email}`,
        subject: 'demo email',
        text: 'checking node mailer',
        template: 'email',
        context :{
           customerName : `${profile.firstName} ${profile.lastName}`,
           cartItem : cartItem.map( item =>{
               return{
                   price : item.price,
                   name : item.product.name,
                   quantity : item.count
               }
           }),
           totalPrice : `${total_amount}`,
        }
    }

    // Set the urls
    payment.setUrls({
        success: "https://dry-atoll-52624.herokuapp.com/api/payment/success", // If payment Succeed
        fail: "yoursite.com/fail", // If payment failed
        cancel: "yoursite.com/cancel", // If user cancel payment
        ipn: "https://dry-atoll-52624.herokuapp.com/api/payment/ipn", // SSLCommerz will send http post request in this link
    });

    // Set order details
    payment.setOrderInfo({
        total_amount: total_amount, // Number field
        currency: "BDT", // Must be three character string
        tran_id: transectionId, // Unique Transaction id
        emi_option: 0, // 1 or 0

    });

    // Set customer info
    payment.setCusInfo({
        name: req.user.name,
        email: req.user.email,
        add1: address,
        city: city,
        postcode: postCode,
        country: country,
        phone: phone,

    });

    // Set shipping info
    payment.setShippingInfo({
        method: "Courier", //Shipping method of the order. Example: YES or NO or Courier
        num_item: total_item,
        name: req.user.name,
        add1: address,
        city: city,
        postcode: postCode,
        country: country,
        phone: phone,
    });

    // Set Product Profile
    payment.setProductInfo({
        product_name: "Computer",
        product_category: "Electronics",
        product_profile: "general",
    });

    response = await payment.paymentInit();
    const order = new Order({ cartItems: cartItem, user: req.user.id, tran_id: transectionId, address: profile });
    if (response.status === "SUCCESS") {
        order.sessionId = response['sessionkey'];
        await order.save();
        transporter.sendMail(mailOptions,(error, info)=>{
            if(error){
                console.log(error);
            }else{
                console.log(`email sent ${info.response}`);
            }
        })
    }
    return res.status(200).send(response)
}

module.exports.PaymentSuccess = async (req, res) => {
    res.sendFile(path.join(__basedir + "/public/success.html"))
}

module.exports.verify = async (req, res) => {

}
