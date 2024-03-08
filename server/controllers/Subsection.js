const SubSection = require("../models/SubSection")
const Section = require("../models/Section")
const {uploadImageToCloudinary} = require("../utils/imageUploader")

exports.createSubSection = async (req,res) => {
    try {
        // fetch data from body
        const {sectionId,title,timeDuration,description} = req.body;

        // extract files
        const video = req.files.video

        // validation
        if(!sectionId || !title || !timeDuration || !description || !video){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            })
        }
        // upload video to cloudinary
        const uploadDetails =  await uploadImageToCloudinary(video,process.env.FOLDER_NAME);

        // create a sub-section
        const SubSectionDetails =  await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })

        // update section with this sub section ObjectId
        const updatedSection = await Section.findByIdAndUpdate({_id:sectionId},{
            $push:{
                SubSection:SubSection._id,
            },
        },{new:true})
        // TODO: Log updated section here , after adding populate query
        

        // return response
        return res.status(200).json({
            success:true,
            message:"Sub section created successfully ",
            SubSectionDetails,
            updatedSection,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message,
        })
        
    }
}

// TODO : updateSubsection

// TODO : Delete Sub section

