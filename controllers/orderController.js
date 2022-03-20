const { Order } = require('../models/Order');


module.exports.orders = async (req, res) => {
    const cartItems = await Order.find({ user: req.user.id })
    return res.status(201).send(cartItems)
}