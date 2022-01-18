const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const admin = require('../middlewares/adminRole');
const { createProduct, getProductById, getProducts, updateProductById } = require('../controllers/productController');


router.route('/')
    .post([auth, admin], createProduct)
    .get(getProducts)

router.route('/:id')
    .get(getProductById)
    .put([auth, admin], updateProductById)