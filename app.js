const express = require('express');
const app = express();
const router = express.Router();

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/orders');

// use() will set up middleware
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);


module.exports = app;