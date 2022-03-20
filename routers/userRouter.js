const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authorization')
const { signIn, signUp } = require('../controllers/userController');


router.route('/sign-up')
    .post(signUp);

router.route('/sign-in')
    .post(signIn);

router.route('/me')
    .get(auth, (req, res) => {
        return res.send(req.user);
    })

   
module.exports = router