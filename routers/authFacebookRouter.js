const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/authFacebookConfig');

router.route('/')
    .get(passport.authenticate('facebook',{authType: 'reauthenticate',scope : ['email']}));

router.route('/redirect')
    .get(passport.authenticate('facebook',{
        session: false,
    }),(req, res) => {
        // res.send(req.user.token)
        if(req.user.status === 400){
            res.redirect('http://localhost:3000/login?error=' + req.user.status);
        }else{
            res.redirect('http://localhost:3000/login?token=' + req.user.token);
        }
        
    });
  
module.exports = router