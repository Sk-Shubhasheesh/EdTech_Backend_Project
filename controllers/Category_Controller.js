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
        });
        console.log(categoryDetails);
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
exports.showAllCategories = async(req, res) => {
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

exports.categoryPageDetails = async (req, res) => {
	try {
		const { categoryId } = req.body;

		// Get courses for the specified category
		const selectedCategory = await Category.findById(categoryId)
			.populate("courses")
			.exec();
		console.log(selectedCategory);
		// Handle the case when the category is not found
		if (!selectedCategory) {
			console.log("Category not found.");
			return res
				.status(404)
				.json({ success: false, message: "Category not found" });
		}
		// Handle the case when there are no courses
		if (selectedCategory.courses.length === 0) {
			console.log("No courses found for the selected category.");
			return res.status(404).json({
				success: false,
				message: "No courses found for the selected category.",
			});
		}
        //If courses are found for the selected category, it extracts them for later use 
		const selectedCourses = selectedCategory.courses;

		// Get courses for other categories
		const categoriesExceptSelected = await Category.find({
			_id: { $ne: categoryId },
		}).populate("courses");
		//Initializes an array to store courses from categories other than the selected one
		let differentCourses = [];
		//Loops through the categories (excluding the selected one) and adds their courses to the differentCourses array.
		for (const category of categoriesExceptSelected) {
			differentCourses.push(...category.courses);
		}

		// Get top-selling courses across all categories
		const allCategories = await Category.find().populate("courses");
		const allCourses = allCategories.flatMap((category) => category.courses);
		const mostSellingCourses = allCourses
			.sort((a, b) => b.sold - a.sold)
			.slice(0, 10);

		res.status(200).json({
			selectedCourses: selectedCourses,
			differentCourses: differentCourses,
			mostSellingCourses: mostSellingCourses,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Internal server error",
			error: error.message,
		});
	}
};

//categoryPageDetails 

exports.categoryPageDetails = async (req, res) => {
    try {
            //get categoryId
            const {categoryId} = req.body;
            //get courses for specified categoryId
            const selectedCategory = await Category.findById(categoryId)
                                            .populate("courses")
                                            .exec();
            //validation
            if(!selectedCategory) {
                return res.status(404).json({
                    success:false,
                    message:'Data Not Found',
                });
            }
            //get coursesfor different categories
            const differentCategories = await Category.find({
                                         _id: {$ne: categoryId},
                                         })
                                         .populate("courses")
                                         .exec();

            //get top 10 selling courses
            //HW - write it on your own

            //return response
            return res.status(200).json({
                success:true,
                data: {
                    selectedCategory,
                    differentCategories,
                },
            });

    }
    catch(error ) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}