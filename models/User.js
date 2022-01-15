const {Schema,model} = require('mongoose');
const jwt = require('jsonwebtoken');
const joi = require('joi');

const userSchema = Schema({
    name:{
        type: String,
        required:true,
        minlength: 4,
        maxlength: 25
    },
    email:{
        type: String,
        required: true,
        minlength: 8,
        maxlength : 255,
        unique : true
    },
    password : {
        type: String,
        required: true,
        minlength :6,
        maxlength: 1024,
    },
    role :{
        type: String,
        enum : ["user","admin"],
        default : 'user'
    }
},{timestamps : true});

userSchema.methods.getJwt = function(){
    const token = jwt.sign({
        id : this._id,
        email : this.email,
        name : this.name,
        role: this.role
    },process.env.JWT_SECRET_KEY,{expiresIn:"7d"});

    return token;
};

const validateUser = user =>{
    const schema = joi.object({
        name : joi.string().min(4).max(255).required(),
        email : joi.string().min(8).max(255).required(),
        password : joi.string().min(6).max(255).required()
    })

    return schema.validate(user);
};

module.exports.User = model('User',userSchema);
module.exports.validateUser  = validateUser;