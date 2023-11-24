// Import
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require('dotenv').config();

// sendOTP For Email Verification
exports.sendOTP = async (req, res) => {
  try {
    // fetch email from request body
    const { email } = req.body;

    //check if user alredy exist
    const checkUserPresent = await User.findOne({ email });

    // if user alredy exist, then return a response
    if (checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: "User alredy registered",
      });
    }

    // generate OTP
    var otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // check otp is unique or not
    const result = await OTP.findOne({ otp: otp });
    console.log("Result is Generate OTP Func");
		console.log("OTP", otp);
		console.log("Result", result);
    // bad logic
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }
    //create entry to db for OTP
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("OTP Body", otpBody);
    // sending response
    return res.status(200).json({
      success: true,
      message: "OTP Send Successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//signUp Controller for Registering USers
exports.signUp = async (req, res) => {
  try {
    // fectch data from the request body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    // matching the password and confirmPassword
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirmPassword Value does not match, plese try again",
      });
    }

    // check user alredy exist or not
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User is Already registered",
      });
    }

    // find most recent OTP from the user
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log(recentOtp);
    // validate otp
    if (recentOtp.length == 0) {
      // otp not found
      return res.status(400).json({
        success: false,
        message: "OTP Not Found",
      });
    } else if (otp != recentOtp[0].otp) {
      //Invalid OTP
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);
    // Create the Additional Profile For User
    const profileDetails = await Profile.create({
      gender: null,
      dateofBirth: null,
      about: null,
      contactNumber: null,
    });
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });

    // return response
    return res.status(200).json({
        success:true,
        message: 'User is registered Successfully',
        user
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success:false,
        message: 'User cannot be registered. Plese try again',
        
    });

  } 
};


// Login controller for authenticating users
exports.login = async(req, res) => {
    try {
        // fetch data from request body
        const {email, password} = req.body;
        // validation data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:`Please Fill up All the Required Fields`

            });
        }
        // check user is exist or not
        const user = await User.findOne({email}).populate("additionalDetails");
        if(!user){
          // 401 Unauthorized status code
            return res.status(401).json({
                success:false,
                message:"User is not registred, plese signup first"

            });
        }

        // Generate JWT token and Compare Password
        if(bcrypt.compare(password, user.password)){
            // if password match -> generate token
            const payload = {
               email:user.email,
               id: user._id,
               role:user.role,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"24h"
            });
            user.token = token;
            user.password = undefined;

            // create cookies and send response
            const options = {
                expires:new Date(Date.now() + 3*24*60*60*1000),
                httpOnly:true
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message: "Looged in successfully"
            })
        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect"
            });
        }
        
 } catch (error) {
    return res.status(500).json({
        success:false,
        message:"Login Failure, plese try again"
    });    
    }
}

// Controller for Changing Password 
exports.changePassword = async (req, res) => {
	try {
		// Get user data from req.user
		const userDetails = await User.findById(req.user.id);

		// Get old password, new password, and confirm new password from req.body
		const { oldPassword, newPassword, confirmNewPassword } = req.body;

		// Validate old password
		const isPasswordMatch = await bcrypt.compare(
			oldPassword,
			userDetails.password
		);
		if (!isPasswordMatch) {
			// If old password does not match, return a 401 (Unauthorized) error
			return res
				.status(401)
				.json({ success: false, message: "The password is incorrect" });
		}

		// Match new password and confirm new password
		if (newPassword !== confirmNewPassword) {
			// If new password and confirm new password do not match, return a 400 (Bad Request) error
			return res.status(400).json({
				success: false,
				message: "The password and confirm password does not match",
			});
		}

		// Update password
		const encryptedPassword = await bcrypt.hash(newPassword, 10);
		const updatedUserDetails = await User.findByIdAndUpdate(
			req.user.id,
			{ password: encryptedPassword },
			{ new: true }
		);

		// Send notification email
		try {
			const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firtsName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
		} catch (error) {
			// If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
		}

		// Return success response
		return res
			.status(200)
			.json({ success: true, message: "Password updated successfully" });
	} catch (error) {
		// If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
		console.error("Error occurred while updating password:", error);
		return res.status(500).json({
			success: false,
			message: "Error occurred while updating password",
			error: error.message,
		});
	}
};