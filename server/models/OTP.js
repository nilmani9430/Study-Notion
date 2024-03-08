const mongoose = require("mongoose")
const mailSender = require("../utils/mailSender")
const emailVerificationTemplate = require("../mail/templates/emailVerificationTemplate")

const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expiresAfterSeconds:300,
    }
    
})

async function sendVerifcationEmail (email,otp) {
    //send verification mail to user with the generated OTP
    try{
        const mailResponse = await mailSender(email,"Verification e-mail from Study Notion",emailVerificationTemplate.otpTemplate(otp))
        console.log("Email sent successfully ",mailResponse);
    }
    catch(error){
        console.log("Error occured while sending email",error);
        throw error;
    }
}

OTPSchema.pre("save",async function(next){
    await sendVerifcationEmail(this.email,this.otp);
    next();
})

module.exports = mongoose.model("OTP",OTPSchema);