const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const { courseEnrollmentEmail } = require("../mail/templates/courseEnrollmentEmail")
const { default: mongoose } = require("mongoose")

// caputure the payment and initiate the order
exports.capturePayment = async (req, res) => {
    // get courseId and UserId
    const { course_id } = req.body;
    const userId = req.user.id;

    // validation
    // valid course id
    if (!course_id) {
        return res.json({
            success: false,
            message: "Please provide valid course ID",
        })
    };

    // valid course details
    let course
    try {
        course = await Course.findById(course_id);
        if (!course) {
            return res.json({
                success: false,
                message: "could not find the course",
            })
        }
        // user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
            return res.status(200).json({
                success: false,
                message: "Student is already enrolled",
            })
        }

    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            success: false,
            message: err.message,
        })
    }
    // order create
    const amount = course.price;
    const currency = "INR";

    const options = {
        amount: amount * 100,
        currency,
        reciept: Math.random(Date.now()).toString(),
        notes: {
            courseId: course_id,
            userId,
        }
    }

    try {
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);

        // return response
        return res.status(200).json({
            success: true,
            courseName: course.courseName,
            courseDescription: course.courseDescription,
            thumbnail: course.thumbnail,
            currency: paymentResponse.currency,
            amount: paymentResponse.amount,
        })
    }
    catch (err) {
        console.log(err);
        res.json({
            success: false,
            message: "Could not initiate payment",
        })
    }
}

// verify signature of Razorpay and server
exports.verify = async (req, res) => {
    const webHookSecret = "12345678";

    const signature = req.header["x-razorpay-signature"];

    const shasum = crypto.createHmac("sha256", webHookSecret);
    shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest("hex")

    if(signature == digest){
        console.log("Payment is authorised");

        const {courseId,userId} = req.body.payload.payment.entity.notes;

        try {
            // filfill the action

            // find the course enroll the student in it
            const enrolledCourses = await Course.findOneAndUpdate({_id:courseId},{$push:{studentsEnrolled:userId}},{new:true})
            if(!enrolledCourses){
                return res.status(500).json({
                    success:false,
                    message:"Course not found",
                })
            }
            console.log(enrolledCourses);

            // find the student and add the courses to their list of enrolled courses
            const enrolledStudent = await User.findOneAndUpdate({_id:userId},{$push:{
                courses:courseId
            }},{new:true});

            console.log(enrolledStudent);

            // mail send crow confirmation wala
            const emailResponse = await mailSender(enrolledStudent.email,"Congratulation: From codeHelp","Congatulation you are onboraded intp new CodeHelp course");
            
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:"Signature Verified and Course added "
            })

        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
            })
            
        }
    }

    else{
        return res.status(400).json({
            success:false,
            message:"Invalid Request "
        })
    }

}



