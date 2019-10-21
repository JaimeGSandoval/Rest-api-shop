const express = require('express');
const app = express();

// use() will set up middleware
app.use((req, res, next) => {
    res.status(200).json({
        message: 'Works like a charm'
    });
    res.end(console.log('We good'));


});

module.exports = app;