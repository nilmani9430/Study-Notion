const express = require("express")
const router = express.Router();

const {
    capturePayment,
    verify
} = require("../controllers/Payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifySignature", verify)

module.exports = router