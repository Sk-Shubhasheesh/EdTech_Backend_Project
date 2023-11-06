// Import
const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");

// sendOTP
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
    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false
    });

    // check otp is unique or not
    let result = await OTP.findOne({otp:otp});
    // bad logic
    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        result = await OTP.findOne({otp:otp});
    }
    //create entry to db for OTP
    const otpPayload = {email, otp};
    const otpBody = await OTP.create(otpPayload);
    // sending response
    return res.status(200).json({
        success: true,
        message: "OTP Send Successfully",
        otp
      });




  } catch (error) {
    console.log(error);
    return res.status(500).json({
        success: false,
        message: error.message,
      });
    

  }
};
