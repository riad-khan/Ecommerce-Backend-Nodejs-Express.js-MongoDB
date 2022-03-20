const { Schema, model } = require('mongoose');
const {CartSchema} = require('./Cart')

const OrderSchema = Schema({
    cartItems : [CartSchema],
    address : {
        phone : String,
        country : String,
        address : String,
        city : String,
        postCode : Number,
    },
    tran_id : {
        type : String,
        unique : true ,
    },
    paymentStatus: {
        type : String,
        enum : ["pending","complete"],
        default : "pending"
    },
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    sessionId : String,
})
module.exports.Order = model('Order',OrderSchema);