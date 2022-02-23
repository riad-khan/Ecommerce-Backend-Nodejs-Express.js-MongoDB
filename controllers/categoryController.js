const _ = require('lodash');
const { Category, validateCategory } = require('../models/Category')

module.exports.createCategory = async (req, res) => {
    const { error } = validateCategory(_.pick(req.body, ['name']));
    if (error) return res.status(400).send(error.details[0].message);
    let category = {};
    category = await Category.findOne({ name: req.body.name })
    if (category) res.status(401).send('Category Already Exists')
    category = new Category(_.pick(req.body, ['name']));
    await category.save();
    res.send({
        message: "Category Created Successfully"
    })
}

module.exports.getCategory = async (req, res) => {
    const category = await Category.find()
        .sort({ name: 1 });
    res.send(category)
}