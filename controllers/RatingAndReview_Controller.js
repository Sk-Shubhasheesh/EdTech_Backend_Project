const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//createRating&Review HandlerFunction
exports.createRating = async(req, res) => {
    try {
        // get user id
        const userId = req.user.id;
        // fetch data from req body
        const {rating, review, courseId} = req.body;
        // check user is enrolled or not 
        const courseDetails = await Course.findOne({_id:courseId, studentsEnrolled: {$eleMatch: {$eq:userId}}});
        if(!courseDetails){
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course",
              });
        }
        // check if user is already review
        const alreadyReviewd = await RatingAndReview.findOne({
                                                user:userId,
                                                course: courseId
                                            });
        if(alreadyReviewd){
            return res.status(403).json({
                success: false,
                message: "Course is alredy reviewed by the user",
              });
        }
        // creat rating and review
        const ratingReview = await RatingAndReview.create({rating, review, course:courseId, user:userId});

        // update course with this rating and review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId}, {$push: {ratingAndReviews: ratingReview._id}}, {new:true});
        console.log(updatedCourseDetails);
        // return response
        return res.status(200).json({
            success: true,
            message: "Rating and Review created Successfully",
            ratingReview
          });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
    }
}


//getAverageRating&Reviews
exports.getAverageRating = async(req, res) => {
    try {
        // get courseID
        const courseId = req.body.courseId;
        // calculate average rating
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId), // we get course id in string form so we convert it into Object form
                },
            }, {
                $group:{
                   _id:null,
                   averageRating: { $avg: "$rating" }
                }
            }
        ])
        // return rating
        if(result.length>0){
            return res.status(200).json({
                success: true,
                averageRating:result[0].averageRating,
              });
        }
        //if no rating/Review exist
        return res.status(200).json({
            success:true,
            message: 'Average Rating is 0, no rating given till now',
            averageRating: 0
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
    }
}


//getAllRating&Reviews
exports.getAllRating = async(req, res)=>{
    try {
        const allReview = await RatingAndReview.find({}).sort({rating:"desc"}).populate({path:"user", select:"firstName lastName email image"}).populate({path:"course", select:"courseName"}).exec();
        return res.status(200).json({
            success:true,
            message: 'All reviews fetched Successfully',
            data: allReview
            
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
          });
    }
}