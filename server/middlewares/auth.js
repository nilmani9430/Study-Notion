const jwt = require("jsonwebtoken")
require("dotenv").config()
const User = require("../models/User")

//auth
exports.auth = async (req,res,next) => {
    try{
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer ","")
        if(token) console.log("token found doing further processing ");
        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token is missing"
            })
        } 

        //Verify the token
        try{
            console.log("token found verifying it");
            const decode = jwt.verify(token,process.env.JWT_SECRET)
            console.log(decode);
            req.user = decode
        }
        catch(error){
            console.log(error);

        return res.status(401).json({
            success:false,
            message:"Token is invalid"
        })
        }
        next();
    }
    catch(error){
        console.log(error);
        return res.status(401).json({
            success:false,
            message:"Something went wrong while validating the token"
        })
    }
}

// isStudent 
exports.isStudent = async (req,res,next) => {
    try {
        if(req.user.accountType != "Student"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for student only"
            });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User role cannot be verfied please try again "
        })
        
    }
     
}

// isInstructor
exports.isInstructor = async (req,res,next) => {
    try {
        if(req.user.accountType != "Instructor"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Instructor only"
            });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User role cannot be verfied please try again "
        })
        
    }  
}

//isAdmin
exports.isAdmin = async (req,res,next) => {
    try {
        if(req.user.accountType != "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is protected route for Admin only"
            });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User role cannot be verfied please try again "
        })
        
    }
     
}