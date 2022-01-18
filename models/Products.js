const { Schema, model } = require('mongoose');
const joi = require('joi');

const ProductSchema = Schema({
   name : String,
   description : String,
   price : Number,
   category :{
       type: Schema.Types.ObjectId,
       ref: "Category",
       required : true,
   },
   quantity : Number,
   photo :{
       data: Buffer,
       contentType : String

   }
},{timestamps : true})
const validateProduct = product => {
    const schema = joi.object({
        name: joi.string().min(3).max(200).required(),
        description:joi.string().min(3).max(5000).required(),
        price : joi.number().required(),
        quantity: joi.string().required(),
        category : joi.string().min(3).max(200).required(),

    })
    return schema.validate(product);
}
module.exports.Product = model("Product", ProductSchema);
module.exports.validateProduct = validateProduct;