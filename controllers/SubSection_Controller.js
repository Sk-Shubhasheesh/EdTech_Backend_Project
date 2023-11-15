const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

//create SubSection
exports.createSubSection = async(req, res) => {
    try {
        // fetch data
        const {sectionId, title, timeDuration, description} = req.body;
        // fetch video file
        const video = req.files.videoFile;
        // validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success: false,
                message: "All Fields are required"
            });
        }
        // upload video file into cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
        // create a subsection
        const subSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        });
        //update section with this sub section ObjectId
        const updateSection = await Section.findByIdAndUpdate({_id:sectionId},{$push:{subSection: subSectionDetails._id}}, {new:true}).populate('subSection');
        // return
        return res.status(200).json({
            success:true,
            message:'SubSection Created Successfully',
            updateSection
        });
    } catch (error) { 
        return res.status(500).json({
            success:false,
            message:'Internal Server Error',
            error: error.message
            
        });
    }
}
