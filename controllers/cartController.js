const { Cart } = require('../models/Cart');
const _ = require('lodash');

module.exports.addToCart = async (req, res) => {
    let { price, product } = _.pick(req.body, ['price', 'product']);

    const CartItem = await Cart.findOne({ user: req.user.id, product: product });

    if (CartItem !== null) return res.status(400).send("product Already in Cart");
    let newItem = new Cart({
        price: price,
        product: product,
        user: req.body.user
    })

    const result = await newItem.save();
    res.status(201).send({
        message: "Added To Cart Successfully",
        data: result
    });

}

module.exports.getCartProducts = async (req, res) => {
    const id = req.user.id;
    const item = await Cart.find({ user: id })
        .populate('product', 'name')
        .populate('user', 'name');

    res.status(200).send(item);
}

module.exports.updateCart = async (req, res) => {
    let { _id, count } = _.pick(req.body, ['_id', 'count']);
    const cartUpdate = await Cart.updateMany({ _id: _id, user: req.user.id }, { count: count });
    res.status(201).send("cart updated successfully");
}
module.exports.DeleteCart = async (req, res) => {
    const id = req.params.id;
    const userId = req.body.user;
    const deleteCart = await Cart.deleteOne({ _id: id, user: userId })
    res.status(201).send("cart deleted successfully");
}