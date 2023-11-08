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

// isStudent middleware
exports.isStudent = async(req, res, next) => {
    try {
        if(req.user.accountType != "Student"){
            return res.status(400).json({
                success:false,
                message: 'This is a protected route for Student only',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'User role cannot be verified, plese try again'
        });
    }
}

// isInstructor middleware
exports.isInstructor = async(req, res, next) => {
    try {
        if(req.user.accountType != "Instructor"){
            return res.status(400).json({
                success:false,
                message: 'This is a protected route for Instructor only',
            });
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'User role cannot be verified, plese try again'
        });
    }
}




// isAdmin middleware
exports.isAdmin = async(req, res, next) => {
    try {
        if(req.user.accountType != "Admin"){
            return res.status(400).json({
                success:false,
                message: 'This is a protected route for Admin only',
            });
        }
        next()
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: 'User role cannot be verified, plese try again'
        });
    }
}

