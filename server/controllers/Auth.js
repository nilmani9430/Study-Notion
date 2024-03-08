const User = require("../models/User")
const OTP = require("../models/OTP")
const otpGenerator = require("otp-generator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const Profile = require("../models/Profile");

require("dotenv").config()

// send OTP
exports.sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        //check if user already exist
        const checkUserPresent = await User.findOne({ email });
        console.log(checkUserPresent)
        //if user already exist     
        if (checkUserPresent) {
            return res.status(401).json({
                success: false,
                message: "User already registered"
            })
        }

        //generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        console.log("OTP Generated successfully ", otp);

        //check unique otp or not
        let result = await OTP.findOne({ otp: otp });
        console.log(result)
        while (result) {
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets: false,
                lowerCaseAlphabets: false,
                specialChars: false,
            });

            result = await OTP.findOne({ otp: otp });
        }

        const otpPayload = { email, otp };

        //create an entry in db

        const otpBody = await OTP.create(otpPayload);
        console.log("OTP BODY", otpBody);
        //send mail with the generated OTP

        res.status(200).json({
            success: true,
            message: "OTP sent successfully",
            otp:otp,
        })

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.signUp = async (req, res) => {
    try {
        //data fetch from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;
        //validate karlo
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(403).json({
                success: false,
                message: "All fields required",
            })
        }

        //2 password match karlo
        if (password != confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password value does not Match"
            })
        }

        //check user already exist or not
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered",
            })
        }

        //find most recent OTP for the user

        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(recentOtp);

        //validate OTP
        if (recentOtp.length == 0) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            })
        }
        else if (otp != recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            })
        }

        console.log("OTP matched hashing started");

        //Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
        })


        // Create entry in DB
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

        })

        return res.status(200).json({
            success: true,
            user,
            message: "User is registered successfully",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again",
        })
    }
}

exports.login = async (req, res) => {
    try {
        // Get data from request ki body
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(403).json({
                success: false,
                message: "All fields are required please try again"
            })
        }

        // user check exist or not
        const user = await User.findOne({ email }).populate("additionalDetails")
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered, please sign Up"
            })
        }
        // generate jwt ,  after password matching
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: "2h"
            })
            user.token = token; // to object
            user.password = undefined;

            // create cookie and send response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            }
            res.cookie("token", token, options).status(200).status(200).json({
                success: true,
                token,
                user,
                message: "Logged in successfully "
            })
        }
        else {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            })
        }

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure, Please try again"
        })
    }
}

// change password
exports.changePassword = async (req, res) => {
    //get data from body
    //get old password , new password, confirm new password
    //validation

    //update password in db
    // send mail - password update
    // return respone
}