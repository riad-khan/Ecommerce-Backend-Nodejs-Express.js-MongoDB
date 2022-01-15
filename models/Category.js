const { Schema, model } = require('mongoose');
const joi = require('joi');

const CategorySchema = Schema({
    name: {
        type: String,
        unique: true,
    }
})
const validateCategory = category => {
    const schema = joi.object({
        name: joi.string().min(3).max(200)
    })
    return schema.validate(category);
}
module.exports.Category = model("Category", CategorySchema);
module.exports.validateCategory = validateCategory;