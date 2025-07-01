const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeeDashboardController');
const verifyToken = require('../middlewares/verifyToken');

router.get('/dashboard-summary/:employeeId', verifyToken, controller.getDashboardSummary);

module.exports = router;