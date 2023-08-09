const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
    shopImage: String,
    shopName: String,
    shopDescritption: String,
    shopCategory: String,
    ownerName: String,
    contacts: String,
    address: { lat: Number,
    long: Number},
})

module.exports = mongoose.model('Shops',shopSchema);
