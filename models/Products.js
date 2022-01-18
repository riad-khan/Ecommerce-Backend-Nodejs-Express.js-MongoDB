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
   product_image :{
       data: Buffer,
       contentType : String

   }
},{timestamps : true})
const validateProduct = product => {
    const schema = joi.object({
        name: joi.string().min(3).max(200).required(),
        description:joi.string().min(3).max(5000).required(),
        price : joi.Number().min(3).max(100).required(),
        category : joi.string().min(3).max(200).required(),

    })
    return schema.validate(product);
}
module.exports.Product = model("Product", ProductSchema);
module.exports.validateProduct = validateProduct;