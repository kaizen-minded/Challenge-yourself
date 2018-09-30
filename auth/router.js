'use strict';
const express = require('express');
const passport = require('passport');
// const bodyParser = require('body-parser');
// const jwt = require('jsonwebtoken');

// const config = require('../config');
const router = express.Router();

// const createAuthToken = function(user) {
//     return jwt.sign({user}, config.JWT_SECRET,{
//         subject: user.username,
//         expiresIn: config.JWT_EXPIRY,
//         algorithm: 'HS256'
//     });
// };

const localAuth = passport.authenticate('local', {session: true});
// router.use(bodyParser.json());
// The user provides a username and password to login

router.post('/login',localAuth, (req, res) => {
  // console.log(req.user);
  // const authToken = createAuthToken(req.user.serialize());
  // res.json({authToken, id: req.user._id, username: req.user.username});
  console.log("WE have reached the login ENDPOINT");
  console.log(req.user._id);
  res.send({success: true, id: req.user._id});
  // res.redirect('/')
});

// const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
// router.post('/refresh', jwtAuth, (req, res) => {
//   const authToken = createAuthToken(req.user);
//   res.json({authToken});
// });

module.exports = router;
