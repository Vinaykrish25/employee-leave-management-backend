const express = require('express');
const router = express.Router();
const controller = require('../controllers/leaveController');

// 👇 Specific routes first
router.get('/details/:id', controller.getLeaveDetails);
router.put('/action/:id', controller.takeActionOnLeave);
router.get('/:status', controller.getLeavesByStatus);  // 👈 Must come after the specific ones
router.post('/', controller.applyLeave);

module.exports = router;
