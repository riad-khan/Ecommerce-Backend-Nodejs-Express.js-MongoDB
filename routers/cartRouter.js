const express = require('express');
const router = express.Router();
const { addToCart, getCartProducts, updateCart, DeleteCart } = require('../controllers/cartController');
const auth = require('../middlewares/authorization');


router.route('/')
    .get(auth, getCartProducts)
    .post(auth, addToCart)
    .put(auth, updateCart)

router.route('/:id')
    .delete(auth, DeleteCart)