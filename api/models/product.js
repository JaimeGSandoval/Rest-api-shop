const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    // ObjectId is a special serial number that's a long string that's a specific format that mongoose uses internally 
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number
});

module.export = mongoose.model('Product', productSchema);