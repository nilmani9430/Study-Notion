const express = require("express")
const router = express.Router()
const {auth} = require("../middlewares/auth")
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    // updateDisplayPicture, KJ
    // getEnrolledCourses, KJ
} = require("../controllers/Profile")
const { route } = require("./User")




// delete user account
router.delete("/deleteProfile",auth,deleteAccount)
router.put("/updateProfile",auth,updateProfile)
router.get("/getUserDetails",auth,getAllUserDetails)
// get enrolled courses
// router.get("/getEnrolledCourses",auth,getEnrolledCourses)
// router.put("/updateDisplayPicture",auth,updateDisplayPicture)

module.exports = router