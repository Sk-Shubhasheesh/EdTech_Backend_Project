const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firtsName: {
     type: String,
     required: true,
     trim: true, // removes whitespace from the beginning and end of a string
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum:["Admin", "Student", "Instructor"],
    required: true
  },
  additionalDetails: {
    type:mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Profile", 
  },
  courses:[
    { 
      type:mongoose.Schema.Types.ObjectId,
      ref: "Course", 
    },
  ],
  image:{
    type:String,
    required:true
  },
  token: {
    type:String
  },
  resetPasswordExpires:{
    type:Date,
  },
  courseProgress: [
    {
      type:mongoose.Schema.Types.ObjectId,
      ref: "CourseProgress",
    }
  ],

});

module.exports = mongoose.model("User", userSchema);
