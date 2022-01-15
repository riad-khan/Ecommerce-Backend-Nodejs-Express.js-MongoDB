const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const admin = require('../middlewares/adminRole');
const { createCategory, getCategory } = require('../controllers/categoryController');


router.route('/')
    .post([auth, admin], createCategory)
    .get(getCategory)

module.exports = router

