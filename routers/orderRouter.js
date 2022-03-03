const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {orders} = require('../controllers/orderController')

router.route('/')
    .get(auth, orders)

module.exports = router
