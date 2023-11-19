const Profile = require("../models/Profile");
const User = require("../models/User");

exports.updateProfile = async(req, res) => {
    try {
        // get data
        const{dateOfBirth="", about="", contactNumber, gender} = req.body;
        //get userId
        const id = req.user.id;
        //validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:'All fileds are required'
            });
        }
        //find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);
        //update profile - here object is already created so we update it only
        profileDetails.dataOfBirth = dateOfBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;
        await profileDetails.save();
        // response
        return res.status(200).json({
            success:true,
            message:'Profile Update Successfully',
            profileDetails: profileDetails
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Internal Server Error',
            error:error.message
        });
    }
}

//deleteAccount handler funtion
exports.deleteAccount = async(req, res) => {
    try {
        // fetch data
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User not found'
            });
        }
        // detele profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // delete User
        await User.findByIdAndDelete({_id:id});
        // return response
        return res.status(200).json({
            success:true,
            message:'User Deleted Successfully'
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User cannot be deleted Successfully'
        });
    }
}

// get all details of user
exports.getAllUserDetails = async(req, res) => {
    try {
         const id = req.user.id;
         // validation
         const userDetails = await User.findById({id}).populate("additionalDetails").exec();
         if(!userDetails){
            return res.status(404).json({
                success:false,
                message:'User Deatils not found'
            });
         }
         return res.status(200).json({
            success:true,
            message:'User Data fetched successfully',
            userDetails
        });  
        
    } catch (error) {
        return res.status(505).json({
            success:false,
            message:'Internal Server Error',
            message: error.message
        });
    }
}