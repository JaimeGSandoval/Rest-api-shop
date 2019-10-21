const express = require('express');
const app = express();
// morgan is a package that logs request info (type of req, status, ms, etc) to the terminal console with each req
const morgan = require('morgan');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

app.use(morgan('dev'));

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