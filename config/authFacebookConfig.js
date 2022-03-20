const passport = require('passport');
const { User } = require('../models/User');
const _ = require('lodash');

const fbStretegy = require('passport-facebook').Strategy;

const strategy = new fbStretegy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3001/auth/facebook/redirect",
    profileFields: ['id', 'displayName', 'photos', 'email']
},async(accessToken, refreshToken, profile, cb) => {

    let user = await User.findOne({email: profile._json.email }).select({facebookId : 1,email : 1, name :1});

    if (!user) {
        user = new User({ facebookId: profile.id, email: profile._json.email, name: profile._json.name });
        await user.save()
        const token = await user.getJwt();
        const response = {
            user: _.pick(user, ['email', '_id']),
            token: token
        };
        cb(null, response)
    } else if ( user.facebookId === '0') {
        const response ={
                status : 400,
                message : 'email already registerd',
            }
            cb(null, response)
    }else{
        const token = await user.getJwt();
                const response ={
                    user : _.pick(user,['email','_id']),
                    token : token
                }
                cb(null, response);
    }
   
})
passport.use(strategy)