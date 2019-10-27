// ORDER MODEL

const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    // ObjectId is a special serial number that's a long string that's a specific format that mongoose uses internally 
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    }


});

// the model is a wrapper/container for the schema. The schema is the structure/layout for the model. 'User' is the name of the model. 'userSchema' is the name of the schema we are using. 
module.exports = mongoose.model('User', userSchema);