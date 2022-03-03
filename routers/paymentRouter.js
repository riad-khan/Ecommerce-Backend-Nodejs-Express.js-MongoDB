const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const { initPayment, ipn, PaymentSuccess, verify } = require('../controllers/paymentController')

router.route('/')
    .get(auth, initPayment)

router.route('/ipn')
    .post(ipn)

router.route('/success')
    .post(PaymentSuccess)

router.route('/verify')
    .get(auth, verify)
module.exports = router