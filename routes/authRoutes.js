
const { Router } = require('express');
const authController = require('../controllers/authController')
const validDate = require("../middleware/middleware")

const router = Router();

router.post("/api/users/:_id/exercises", validDate, authController.exercise_POST)
router.post("/api/users", authController.createNewUser)
router.get("/api/users", authController.getAllUsers)
router.get("/api/users/:_id/logs", authController.exercises_GET)


module.exports = router