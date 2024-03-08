const Section = require("../models/Section")
const Course = require("../models/Course")

exports.createSection = async (req, res) => {
    try {
        // data fetch
        const { sectionName, courseId } = req.body;

        // data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        // create section
        const newSection = await Section.create({ sectionName });

        // update course with section object id
        const updatedCourseDetails = await Course.findByIdAndUpdate(courseId, {
            $push: {
                courseContent: newSection._id,
            }
        }, { new: true })
        // TODO: use populate to replace sections and subsections both in updatedCourseDetails

        // return response
        return res.status(200).json({
            success:true,
            message:"Section creatd successfully",
            updatedCourseDetails,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to create section please try again",
            error:error.message, 
        })
    }
}

exports.updateSection = async (req,res) => {
    try{
        // data input
        const {sectionName,sectionId} = req.body;

        // data validation
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            })
        }

        // update data
        const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

        // return res
        return res.status(200).json({
            success:true,
            message:"Section updated successfully,"
        })
        

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Unable to update section, please try again",
            error:error.message
        })
    }
}

exports.deleteSection = async (req,res) => {
    try {
        // get id -- assuming we are sending ID in params
        const {sectionId} = req.params;

        // use find by id and delete
        await Section.findByIdAndDelete(sectionId);
        //TODO: do we need to delete the entry from the course schema ?

        // return response
        return res.status(200).json({
            success:true,
            message:"Section deleted successfully ",
        })


    } catch (error) {
        console.log(error);
        
    }
}
