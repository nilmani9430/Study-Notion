const Course = require("../models/Course")
const Category = require("../models/Category")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")

// create course handler function
exports.createCourse = async (req, res) => {
    try {
        console.log("Course creation started");
        // fetch all data
        const { courseName, courseDescription, whatYouWillLearn, price, category, tag } = req.body;

        // get thumbnail = req.files.thumbnailImage;
        const thumbnail = req.files.thumbnailImage;

        // validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !category || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            })
        }

        // check for instructor
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details: ", instructorDetails);
        // TODO: verify that userId and instructorDetails._id are same or different

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor Details not found",
            })
        }

        // check given tag is valid or not

        const categoryDetails = await Category.findById(category); //here tag is ID
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "category details not found"
            });
        }

        // upload Image to cloudinary
        console.log("image uploading to cloudinary started ");
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
        console.log("image uploaded to cloudinary ");

        // create an entry for new course

        console.log("creating new course");
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag,
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
        })

        console.log("Course successfully created");
        // add the new course to the user schema of Instructor
        await User.findByIdAndUpdate(
            { _id: instructorDetails._id },
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            { new: true },
        );
        console.log("course added to instructor profiel");

        return res.status(200).json({
            success: true,
            message: "Course Created Successfully",
            data: newCourse,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Failed to create course ",
            error: error.message
        })
    }
}

// get all courses handler function
exports.showAllCourses = async (req, res) => {
    try {
        // TODO : change the below statement incrementally

        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true
        }).populate("instructor")
            .exec();

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully",
            data: allCourses,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Cannot Fetch course data",
            error: error.message
        })

    }
}

// get course details
exports.getCourseDetails = async (req, res) => {
    try {
        // getId
        const { courseId } = req.body;

        // find course details
        const courseDetails = await Course.find({ _id: courseId })
            .populate(
                {
                    path: "instructor",
                    populate: {
                        path: "additionalDetails",
                    }
                }
            )
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec()

        if (!courseDetails) {
            return res.status(400).json({
                success: false,
                message: `Could not find the course with ${courseId}`
            })
        }

        return res.status(200).json({
            success: true,
            message: "Course Details Fetched Successfully ",
            data: courseDetails,
        })

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}





