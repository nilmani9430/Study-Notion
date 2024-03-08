const Profile = require("../models/Profile")
const User =  require("../models/User")

exports.updateProfile = async (req,res) =>{
    try {
        console.log("Profile update started");
        // get Data
        const {dataOfBirth="",about="",contactNumber,gender} = req.body;

        // get UserId
        const id = req.user.id
        // validation
        if(!contactNumber || !gender || !id){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }

        //  find Profile
        const userDetails = await User.findById(id);
        const ProfileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(ProfileId)

        // update Profile
        profileDetails.dateOfBirth=dataOfBirth;
        profileDetails.about=about;
        profileDetails.gender=gender;
        profileDetails.contactNumber=contactNumber;
        await profileDetails.save();

        // return response
        return res.status(200).json({
            success:true,
            message:"profile updated successfully",
            profileDetails,
        })
    } catch (error) {
        console.log(error);   
        return res.status(500).json({
            success:false,
            error:error.message
        })     
    }
}

// deleteAccount Function
exports.deleteAccount = async (req,res) => {
    try{
        // get id
        const id = req.user.id;

        // validation
        const userDetails = await User.findById(id);
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User Not found",
            })
        }

        // delete Profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        // TODO : unenroll user from all enrolled courses

        // delete user
        await User.findByIdAndDelete({_id:id});

        // return response
        return res.status(200).json({
            success:true,
            message:"User Deleted successfully"
        })

        // TODO:  How can we make sure that some particular function is executed at any specified point of time (cron job)
    }
    catch(error){
        // console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be deleted successfully "
        })  
        
    }
}

exports.getAllUserDetails = async (req,res) => {
    try{
        // get Id
        const id = req.user.id;

        // validation get User Details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // return response
        return res.status(200).json({
            success:true,
            message:"User Data Fetched successfully ",
            userDetails,
        })

    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}