const Tag = require('../models/tags');

// createTag handler function
exports.createTag = async(req, res) => {
    try {
        // fetch data from request body
        const {name, description} = req.body
        // validation
        if(!name || !description){
            return res.status(400).json({
                success:false,
                message: 'All fields are required'
            });
        }
        // create entry in db
        const tagDetails = await Tag.create({
            name: name,
            description: description
        })
        // return response
        return res.status(200).json({
            success:true,
            message:'Tag Created Successfully'
        });  
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

//getAllTags handler
exports.showAlltags = async(req, res) => {
    try {
        const allTags = await Tag.find({}, {name:true, description:true});
        return res.status(200).json({
            success: true,
            message: " All tag returned Successfully",
            allTags
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message
        }) 
    }
}