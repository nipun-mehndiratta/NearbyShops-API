const mongoose = require('mongoose');

const shopOwnerSchema = new mongoose.Schema({
    username: {type: String,required: true},
    password: {type: String,required: true},
    shop: {type:mongoose.Types.ObjectId,ref:'Shops'},
})

module.exports = mongoose.model('Owner',shopOwnerSchema);
