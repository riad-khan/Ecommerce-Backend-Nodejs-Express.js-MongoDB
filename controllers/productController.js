
const _ = require('lodash');
const { Product, validateProduct } = require('../models/Products');
const formidable = require('formidable');
const fs = require('fs');

module.exports.createProduct = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send('something Wrong');
        const { error } = validateProduct(_.pick(fields, ['name', 'description', 'price', 'category', 'quantity',]));
        if (error) return res.status(400).send(error.details[0].message);
        const product = new Product(fields);

        if (files.photo) {
            fs.readFile(files.photo.path, (err, data) => {
                if (err) return res.status(400).send("problem with image upload")
                product.photo.data = data,
                    product.photo.contentType = files.photo.type
                product.save((err, result) => {
                    if (err) return res.status(500).send('internal server error')
                    else return res.status(201).send({
                        message: "Product created Successfully",
                        data: _.pick(result, ['name', 'description', 'price', 'category', 'quantity',])
                    })
                })
            })
        }
    })

}
module.exports.getProducts = async (req, res) => {

    const products = await Product.find().select({ photo: 0 }).sort().populate('category name');
    return res.status(200).send(products)
}



module.exports.getProductById = async (req, res) => {
    const product_id = req.params.id;
    const product = await Product.findById(product_id).select({ photo: 0 }).populate('category name');
    if (!product) res.status(404).send("Not found");
    return res.status(200).send( product)
}

module.exports.getPhoto = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id).select({ photo: 1, _id: 0 });
    res.set('content-type', product.photo.contentType);

    return res.status(200).send(product.photo.data)
}

module.exports.updateProductById = async (req, res) => {
    const product_id = req.params.id;
    const product = await Product.findById(product_id).select({ photo: 0 }).populate('category name');

    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) return res.status(400).send('something Wrong');
        const updatedData = _.pick(fields, ['name', 'description', 'price', 'category', 'quantity',])
        _.assignIn(product, updatedData);
        if (files.photo) {
            fs.readFile(files.photo.path, (err, data) => {
                if (err) return res.status(400).send("problem with image upload")
                product.photo.data = data,
                    product.photo.contentType = files.photo.type
                product.save((err, result) => {
                    if (err) return res.status(500).send('internal server error')
                    else return res.status(201).send({
                        message: "Product Updated Successfull",
                        data: _.pick(result, ['name', 'description', 'price', 'category', 'quantity',])
                    })
                })
            })
        } else {
            product.save((err, result) => {
                if (err) return res.status(500).send('internal server error')
                else return res.status(201).send({
                    message: "Product Updated Successfull",
                    data: _.pick(result, ['name', 'description', 'price', 'category', 'quantity',])
                })
            })
        }
    })
}

module.exports.filterProducts = async (req, res) => {
    let order = req.body.order === 'desc' ? -1 : 1;
    let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
    let limit = req.body.limit ? parseInt(req.body.limit) : 10;
    let skip = parseInt(req.body.skip);
    let filters = req.body.filters;
    let args = {}

    for (let key in filters) {
        if (filters[key].length > 0) {
            if (key === 'price') {
                // { price: {$gte: 0, $lte: 1000 }}
                args['price'] = {
                    $gte: filters['price'][0],
                    $lte: filters['price'][1]
                }
                console.log("args:", args);
            }
            if (key === 'category') {
                // category: { $in: [''] }
                args['category'] = {
                    $in: filters['category']
                }
                console.log("args:", args);
            }
        }
    }


    const products = await Product.find(args)
        .select({ photo: 0 })
        .populate('category','name')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit)
    return res.status(200).send(products);
}
