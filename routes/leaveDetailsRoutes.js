const express = require('express');
const router = express.Router();
const controller = require('../controllers/leaveDetailsController');

router.get('/', controller.getAllLeaveDetails);

module.exports = router;
