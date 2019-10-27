// ORDER MODEL

const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({
    // ObjectId is a special serial number that's a long string that's a specific format that mongoose uses internally 
    _id: mongoose.Schema.Types.ObjectId,
    product: {
        type: mongoose.Schema.Types.ObjectId,
        // ref is the name of the model you want to connect this model to. You want to connect this orderSchema with Product model
        ref: 'Product',
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    }

});

// the model is a wrapper/container for the schema. The schema is the structure/layout for the model. 'Order' is the name of the model. 'orderSchema' is the name of the schema we are using. 
module.exports = mongoose.model('Order', orderSchema);