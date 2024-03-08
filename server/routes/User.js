const express = require("express")
const router = express.Router()


const {
    login,
    signUp,
    sendOTP,
    changePassword,
} = require("../controllers/Auth")
const {
    resetPasswordToken,
    resetPassword,
} = require("../controllers/ResetPassword")
const {auth} = require("../middlewares/auth")







// Routes for user login
router.post("/login",login)

// routes for user signUp
router.post('/signup', signUp);

// route for sending otp to the user mail
router.post('/sendotp',sendOTP)

// router for changing the password
router.post("/changepassword",auth,changePassword)





 
// route for generating a reset password token
router.post("/reset-password-token",resetPasswordToken)

// route for reseting user's password after verification
router.post("/reset-password",resetPassword)

module.exports = router