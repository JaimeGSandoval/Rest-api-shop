// MAKE YOUR VARIABLES
const express = require('express');
const app = express();
// morgan is a package that logs request info (type of req, status, ms, etc) to the terminal console with each req
const morgan = require('morgan');
// Body parser does not parse files. Only url encoded data and json
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');


// CONNECT TO MONGODB WITH MONGOOSE 
mongoose.connect('mongodb+srv://node-shop:' + process.env.MONGO_ATLAS_PW + '@rest-node-shop-bwh0z.mongodb.net/test?retryWrites=true&w=majority', {
    // useMongoClient: true
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.Promise = global.Promise;


// SET UP THE MIDDLEWARE FOR REQ OBJECT WITH THE use()
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    // setting extended to false wil allow the parsing of only simple data, not rich data, whatever that means.
    extended: false
}));

// extracts json data to make it readable
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization');

    // the 'options' method is sent by the clients browser to see if access is allowed
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, PATCH, DELETE, GET, POST');
        return res.status(200).json({});
    }
    next();
});



// use() will set up middleware
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// if the code makes it to here, that means that the route was not found and a 404 error will be thrown
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// this will handle any errors besides 404 not found 
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }

    })
});

module.exports = app;