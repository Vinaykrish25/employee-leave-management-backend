// routes/employeeProfileRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeeProfileController');
const verifyToken = require('../middlewares/verifyToken');
const upload = require('../middlewares/upload');

router.get('/profile', verifyToken, controller.getEmployeeProfile);
router.put('/profile', verifyToken, upload.single('profile_image'), controller.updateEmployeeProfile);

module.exports = router;
