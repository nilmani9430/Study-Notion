const express = require("express")
const router = express.Router()

// Import the controllers

// courses controller import
const {
    createCourse,
    showAllCourses,
    getCourseDetails,
} = require("../controllers/Course")


// categories controller import
const {
    showAllCategories,
    createCategory,
    categoryPageDetails
} = require("../controllers/Category")

// section controller import
const {
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section")

// sub section controller import 
const {
    createSubSection,
    // updateSubSection,
    // deleteSubSection,
} = require("../controllers/Subsection")

// rating controller import
const {
    createRating,
    getAverageRating,
    getAllRating
} = require("../controllers/RatingAndReview")

// importing middleware
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")





// course can only be created by the instructor
router.post("/createCourse", auth, isInstructor, createCourse)
// add a section to a course
router.post("/addSection", auth, isInstructor, createSection)
// update a section
router.post("/updateSection", auth, isInstructor, updateSection)
// delete a section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// edit sub section
// router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// delete a sub section
// router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// add a sub section to a section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// get all registered course
router.get("/getAllCourses", showAllCourses)
// get details for a specific courses
router.post("/getCourseDetails", getCourseDetails)



// category can only be created by Admin
// TODO: Put idAdmin Middleware here









router.post("/createRating", auth, isStudent, createRating)
router.get("getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

module.exports = router