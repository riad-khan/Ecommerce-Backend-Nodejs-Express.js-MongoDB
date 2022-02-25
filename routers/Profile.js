const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization');
const {addProfile, getProfile ,getPhoto} = require('../controllers/profileController')


router.route('/')
.post(auth,addProfile)
.get(auth,getProfile);

router.route('/photo/:id')
.get(getPhoto)

module.exports = router