const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

router.get("/", (req, res, next) => {
    // find() WITH NO ARGUMENTS WILL RETURN ALL ITEMS IN THE DB
    Product.find()
        // exec() is a promise
        .exec()
        .then(docs => {
            console.log(docs);
            //   if (docs.length >= 0) {
            res.status(200).json(docs);
            //   } else {
            //       res.status(404).json({
            //           message: 'No entries found'
            //       });
            //   }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/", (req, res, next) => {
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product
        .save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "Handling POST requests to /products",
                createdProduct: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
            console.log("From database", doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res
                    .status(404)
                    .json({
                        message: "No valid entry found for provided ID"
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

// PATCH CAN ONLY CHANGE PROPERTIES THAT ARE ALREADY AVAILABLE
router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    // for of will create an array with all the props of the req.body
    for (const ops of req.body) {
        // tHIS WILL ADJUST THE PROPS THAT ARE ALREADY AVAILABLE the ops.propName property and setting it
        updateOps[ops.propName] = ops.value;
    }
    // update() is a built in method
    Product.update({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.remove({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;