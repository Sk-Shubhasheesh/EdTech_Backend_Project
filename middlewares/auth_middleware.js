const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require('../models/User');

//auth
exports.auth = async(req, re, next) => {
    try {
      // extract token
      const token = req.cookies.token || req.body || req.header("Authorisation").replace("Bearer ", ""); 
      // if token missing, then return responce
      if(!token){
        return res.status(401).json({
            success: false,
            message: 'Token is missing'
        });
      }

      //verify the token using secret key
      try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
      } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'token is invalid'
        });
      }
      next();

    } catch (error) {
       return res.status(401).json({
        success: false,
        message: 'Something went wrong while validating the token'
    });
    }
}


