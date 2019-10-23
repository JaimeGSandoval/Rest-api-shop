const mongoose = require('mongoose');


const productSchema = mongoose.Schema({
    // ObjectId is a special serial number that's a long string that's a specific format that mongoose uses internally 
    _id: mongoose.Schema.Types.ObjectId,
    // SETTING THE DATA TYPE FOR EACH FIELD
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});

// the model is a wrapper/container for the schema. The schema is the structure/layout for the model. 'Product' is the name of the model. 'productSchema' is the name of the schema we are using. 
module.exports = mongoose.model('Product', productSchema);