const Category = require('../models/Category');

// createCategory handler function
exports.createCategory = async(req, res) => {
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
        const categoryDetails = await Category.create({
            name: name,
            description: description
        })
        // return response
        return res.status(200).json({
            success:true,
            message:'Category Created Successfully'
        });  
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}

//getAllCategory handler
exports.showAllcategory = async(req, res) => {
    try {
        const allCategory = await Category.find({}, {name:true, description:true});
        return res.status(200).json({
            success: true,
            message: " All Category returned Successfully",
            allCategory
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message: error.message
        }) 
    }
}