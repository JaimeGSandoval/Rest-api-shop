const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');


// SIGN UP ROUTE
router.post('/signup', (req, res) => {

   User.find({
         email: req.body.email
      }).exec()
      .then(user => {
         if (user.length >= 1) {
            return res.status(409).json({
               message: 'Mail exists'
            })
         } else {

            bcrypt.hash(req.body.password, 10, (err, hash) => {

               if (err) {
                  return res.status(500).json({
                     error: err
                  });
               } else {
                  const user = new User({
                     _id: new mongoose.Types.ObjectId(),
                     email: req.body.email,
                     password: hash
                  });

                  user.save()
                     .then(result => {
                        console.log(result)
                        res.status(201).json({
                           message: 'User created'
                        });
                     })
                     .catch(err => {
                        console.log(err);
                        return res.status(500).json({
                           error: err
                        });
                     });
               }
            });
         }
      });
});


// LOG IN AUTHORIZATION ROUTE
router.post('/login', (req, res, next) => {
   User.find({
         email: req.body.email
      }).exec()
      .then(user => {
         if (user.length < 1) {
            return res.status(401).json({
               message: 'Auth failed'
            });
         }
         // USE THE COMPARE() METHOD FROM BCRYPT TO COMPARE TH PASSWORD BEING SENT FROM THE CLIENT TO THE SERVER VIA REQ.BODY.PASSWORD. IT'LL COMPARE IT TO THE PASSWORD STORED IN THE DB
         bcrypt.compare(req.body.password, user[0].password, (err, result) => {

            // THIS IS NOT AN ERROR IF THEY PASSWORDS DON'T MATCH. ITS JUST A GENERAL ERROR FOR IF SOMETHING GOES WRONG
            if (err) {
               return res.status(401).json({
                  message: 'Auth failed'
               });
            };

            // IF THE PASSWORDS DO MATCH, THEN A JWT OS CREATED FOR THEM THAT'LL LAST FOR ONE HOUR
            if (result) {
               const token = jwt.sign({
                  email: user[0].email,
                  userId: user[0].userId
               }, process.env.JWT_KEY, {
                  expiresIn: "1h"
               });

               return res.status(200).json({
                  message: 'Auth successful',
                  token: token
               });
            };

            // THIS IS THE ERROR THAT'LL BE THROWN IF THE PASSWORDS DON'T MATCH
            res.status(401).json({
               message: 'Auth failed'
            });
         });
      })
      .catch(err => {
         console.log(err);
         return res.status(500).json({
            error: err
         });
      });
});


// DELETE USER BY ID ROUTE
router.delete('/:userId', (req, res, next) => {
   User.remove({
         _id: req.params.userId
      }).exec()
      .then(result => {
         res.status(200).json({
            message: 'User deleted'
         });
      })
      .catch(err => {
         console.log(err);
         res.status(500).json({
            error: err
         });
      });
});

module.exports = router;