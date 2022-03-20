const { Schema, model } = require('mongoose');
const joi = require('joi');

const ProfileSchema = Schema({
    firstName : String,
    lastName : String,
    email : String,
    phone : String,
    country : String,
    address : String,
    city : String,
    postCode : Number,
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },
    photo :{
        data: Buffer,
        contentType : String
 
    },
    ProfileStatus: {
        type : String,
        enum : ["pending","complete"],
        default : "complete"
    },
    
})
const validateProfile = profile =>{
    const schema = joi.object({
        firstName : joi.string().min(4).max(10).required(),
        lastName : joi.string().min(4).max(10).required(),
        email : joi.string().min(8).required(),
        phone : joi.string().min(11).max(13).required(),
        country : joi.string().min(3).max(20).required(),
        address : joi.string().min(10).max(1000).required(),
        city : joi.string().min(4).max(20).required(),
        postCode : joi.string().min(4).max(10).required(),
    })
    return schema.validate(profile)
}

module.exports.Profile = model('Profile',ProfileSchema);
module.exports.validateProfile = validateProfile ;