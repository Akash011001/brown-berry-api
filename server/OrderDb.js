const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
    products: [{productId: String, unit: Number}],
    userId: {type: String, required: true},
    placedAt: {type: Date, required: true},
    status: {type: String},
    isVerified: {type: Boolean},
    willReachedAt: {type: Date},
    isDelivered: {type: Boolean}
})

module.exports = new mongoose.model('orders', orderSchema)