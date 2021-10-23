const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    adminName: {type: String},
    Password: {type: String},
    phone: {type: Number},
    email: {type: String}

})

module.exports = new mongoose.model('admin', adminSchema)