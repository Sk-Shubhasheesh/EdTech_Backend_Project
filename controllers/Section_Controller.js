const Section = require("../models/Section");
const Course = require("../models/Course");

//createSection handler
exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    // data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }
    // createSection
    const newSection = await Section.create({ sectionName });
    //update course with section ObjectId
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    })
    .exec();   //  this code is telling Mongoose to retrieve documents from the "courseContent" collection and, for each document, populate the "subSection" field with the corresponding documents from the "subSection" collection. 
    
    // return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourseDetails
    });
  } catch (error) {
    return res.status(500).json({
        success: false,
        message: "Unable to create Section, plese try again",
        error: error.message
      });
  }
};

//UpdateSection handler function
exports.updateSection = async(req, res) => {
    try {
        // data input
        const {sectionName, sectionId} = req.body;
        //data validation
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: 'Missing Properties',
            });
        }
        //update data
        const section = await Section.findByIdAndUpdate(sectionId, {sectionName}, {new:true})
        //return response
        return res.status(200).json({
            success: true,
            message: "Section Updated Successfully",
            section
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to Update Section, plese try again",
            error: error.message
        });
    }
};

// deleteSection handler function
exports.deleteSection = async(req, res) => {
    try {
        // get id
        const {sectionId} = req.params;
        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId);
        //return response
        return res.status(200).json({
            success: true,
            message: "Section Deleted Successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to Delete Section, plese try again",
            error: error.message
        });
    }
};
