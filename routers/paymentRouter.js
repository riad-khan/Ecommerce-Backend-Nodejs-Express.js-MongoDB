const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {initPayment} = require('../controllers/paymentController')

router.route('/')
.get(auth,initPayment)

module.exports = router