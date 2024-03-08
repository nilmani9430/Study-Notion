const Category = require("../models/Category")

// first two function in this page is to be updated by replacing tags with category :)

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const CategoryDetails = await Tag.create({
            name: name,
            description: description,
        })

        console.log(tagDetails);

        return res.status(200).json({
            success: true,
            message: "Category created successfully"
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// get all tags
exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({}, { name: true, description: true });
        res.status.json({
            success: true,
            data: allCategories,
            message: "All Categories returned successfully"
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message
        })

    }
}

// category page details // new 
exports.categoryPageDetails = async (req, res) => {
    try {
        // get category id
    const { categoryId } = req.body;

    // get courses for specified category
    const selectedCategory = await categoryId.findById(categoryId).populate("courses").exec();

    // validation
    if (!selectedCategory) {
        return res.status(404).json({
            success: false,
            message: "Category not found",
        })
    }

    if(selectedCategory.courses.length == 0){
        console.log("No courses found for the selected category");

        return res.status(404).json({
            success:false,
            message:"Category not found"
        })
    }

    const selectedCourses = selectedCategory.courses;

    // get courses for different categories
    const differentCategories = await Category.find({
        _id: { $ne: categoryId },
    }).populate("courses").exec();

    let differentCourses = [];
    for(const category of differentCategories){
        differentCourses.push(...category.courses)
    }

    //TODO: get top selling courses 
    const allCategories = await Category.find().populate("courses");
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses.sort((a,b) => b.sold - a.sold).slice(0,10)
   

    // return response
    return res.status(200).json({
        success:true,
        data:{
            selectedCategory,
            differentCategories,
        },
    })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}
