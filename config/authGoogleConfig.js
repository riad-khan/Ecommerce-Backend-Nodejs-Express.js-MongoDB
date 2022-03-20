const passport = require('passport');
const { User } = require('../models/User');
const _ = require('lodash')

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const strategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/google/redirect"
}, async (accessToken, refreshToken, profile, cb) => {


    let user = await User.findOne({email: profile._json.email }).select({googleId : 1,email : 1, name :1});

    if (!user) {
        user = new User({ googleId: profile.id, email: profile._json.email, name: profile._json.name });
        await user.save()
        const token = await user.getJwt();
        const response = {
            user: _.pick(user, ['email', '_id']),
            token: token
        };
        cb(null, response)
    } else if ( user.googleId === '0') {
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