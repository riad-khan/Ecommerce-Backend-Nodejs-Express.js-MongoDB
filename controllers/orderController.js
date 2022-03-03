const {Order} = require('../models/Order');

module.exports.orders = async(req, res) =>{
   console.log(req.user.id);
}