const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeeLeaveController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/apply', verifyToken, controller.applyLeave);
router.get('/history', verifyToken, controller.leaveHistory);

module.exports = router;