const Course = require('../models/Course');
const Tag = require('../models/tags');
const User = require('../models/User');
const {uploadImageToCloudinary} = require('../utils/imageUploader');
require('dotenv').config();

// createCourse handler function
exports.createCourse = async(req, res) => {
    try {
        //fetch data & get thumbnail
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;
        const thumbnail = req.files.thumbnailImage;

        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag){
            return res.status(400).json({
                success:false,
                message: "All fileds are required"
            });
        }

        // Db call for find  instructor id
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        //TODO: Verify that userId and instructorDetails._id are same or different ?  
        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message: "Instructor Details not found"
            });
        }

        // check given tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails){
            return res.status(400).json({
                success:false,
                message: "Tag Details not found"
            });
        }

        //Upload Image to cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create an entry for new Course
        const newCourse = await Course.create({
            courseName, 
            courseDescription, 
            instructor: instructorDetails._id,
            whatYouWillLearn, 
            price, 
            tag: tagDetails_id,
            thumbnail:thumbnailImage.secure_url,
        });

        //add the new course to the user schema of instructor
        await User.findByIdAndUpdate(
            {_id: instructorDetails._id},
            {
                $push: {
                    courses: newCourse._id
                }
            },
            {new:true}

        );

        // update tag schema
        await Tag.findByIdAndUpdate({_id: tagDetails._id}, {name: tagDetails.name, description:tagDetails.description, course:newCourse._id})


        // return response
        return res.status(200).json({
            success:true,
            message: "Course Created Successsfully",
            data: newCourse
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Failed to create course",
            error: error.message
        });
    }

};

//getAllCourses handler function
exports.showAllCourses = async(req, res) => {
    try {
        // TODO: change the below statement 
        const allCourses = await Course.find({})


        return res.status(200).json({
            success:true,
            message: "Data for all courses fetch successfully",
           data: allCourses
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message: "Can not Fetch all course data",
            error: error.message
        });
    }
}
