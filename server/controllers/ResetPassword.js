
const User = require("../models/User");
const mailSender = require("../utils/mailSender")
const bcrypt = require("bcrypt")
const crypto = require("crypto")

//resetPasword token
exports.resetPasswordToken = async (req, res) => {
    try {
        //get email from request
        const email = req.body.email;

        // check user for this email , email validation
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.json({
                success: false,
                message: "Your Email is not registered with us",
            })
        }

        // generate Token
        const token = crypto.randomUUID();
        const tenMinutesInMilliseconds = 10 * 60 * 1000; 
        // update user by adding token and expirarion time
        const updatedDetails =await User.findOneAndUpdate({ email: email }, {
            token: token,
            resetPasswordExpires: Date.now() + tenMinutesInMilliseconds,
        }, { new: true })
        console.log(updatedDetails);
        // create URL
        const url = `http://localhost:3000/update-password/${token}`;

        // send mail containing url 
        await mailSender(email, "Password reset Link", `Password reset link : ${url}`);

        // send response
        return res.json({
            success: true,
            message: "E Mail sent successfully please check mail and change password ",
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting password "
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        console.log("reseting password started");
        // Data fetch
        const { password, confirmPassword, token } = req.body;

        // validation
        if (password != confirmPassword) {
            return res.json({
                success: false,
                message: "Password not matching",
            })
        }

        // get user details from DB using token
        const userDetails = await User.findOne({ token: token });

        // if no entry -  invalid token
        if (!userDetails) {
            res.json({
                success: false,
                message: "Token is invalid"
            })
        }

        // token time check
        if (userDetails.resetPasswordExpires <= Date.now()) {
            return res.json({
                success: false,
                message: "Token is expired, please regenerate your token ",
            })
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10)

        // update the password
        await User.findOneAndUpdate(
            { token: token },
            { password: hashedPassword },
            { new: true }
        )

        // return response
        return res.status(200).json({
            success: true,
            message: "Password reset successful"
        })

    } catch (error) {
        console.log(error);
    }

}


//reset password