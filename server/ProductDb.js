const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    index: {type: Number}, //total collection in db + 1
    img: {type: String},
    productName: {type: String},
    likes: {type: Number},
    flavour: {type: String},
    category: {type: String},
    description: {type: String},
    price: {type: Number},
    inStock: {type: Number},
    offPercent: {type: Number},
    addedOn: {type: Date}
})

module.exports = new mongoose.model('products',productSchema)
