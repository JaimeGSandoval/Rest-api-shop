// 1. MAKE VARIABLES
// 2. MAKE STORAGE FOR FILES UPLOADED
// 3. SET UP CRITERIA FOR STORAGE
// 4. SET UP ROUTES FOR GET, POST, PATCH AND DELETE
// 5. EXPORT ROUTER 


// 1. MAKE VARIABLES
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require('multer');
const Product = require("../models/product");


// 2. MAKE A MULTER-DISK-STORAGE FOR FILES UPLOADED
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


// 3. SET UP CRITERIA FOR STORAGE
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});



// 4. SET UP ROUTES FOR GET, POST, PATCH AND DELETE

// GET ROUTE TO RETRIEVE ALL PRODUCTS 
router.get("/", (req, res, next) => {
  // USE FIND() TO BRING ALL PRODUCTS BACK
  Product.find()
    // USE SELECT() TO FILTER WHAT FIELDS YOU WANT
    .select("name price _id productImage")
    // USE EXEC() TO MAKE IT A PROMISE
    .exec()
    // WORK ON THE DATA YOU GET BACK FROM THE EXEC PROMISE
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id
            }
          };
        })
      };
      //   if (docs.length >= 0) {
      res.status(200).json(response);
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


// POST ROUTE TO POST TO THE DB
router.post("/", upload.single('productImage'), (req, res, next) => {
  console.log(req.file)

  // CREATE A NEW PRODUCT WITH THE DATA FROM THE FIELDS SENT SENT IN THE REQUEST
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });

  // SAVE THE NEWLY CREATED PRODUCT
  product.save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'GET',
            url: "http://localhost:3000/products/" + result._id
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});


// GET ROUTE FOR A SPECIFIC PRODUCT
router.get("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products'
          }
        });
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


// PATCH ROUTE FOR A SPECIFIC PRODUCT
router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({
      _id: id
    }, {
      $set: updateOps
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// DELETE ROUTE FOR A SPECIFIC PRODUCT
router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.remove({
      _id: id
    })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: {
            name: 'String',
            price: 'Number'
          }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// 5. EXPORT ROUTER
module.exports = router;