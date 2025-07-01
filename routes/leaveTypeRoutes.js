const express = require('express');
const router = express.Router();
const controller = require('../controllers/leaveTypeController');

router.get('/', controller.getAllLeaveTypes);
router.post('/', controller.createLeaveType);
router.put('/:id', controller.updateLeaveType);
router.delete('/:id', controller.deleteLeaveType);

module.exports = router;