const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyToken');

router.post('/login', controller.login);
router.post('/logout', verifyToken, controller.logout);
router.put('/change-password', verifyToken, controller.changePassword);
router.get('/admin-dashboard', verifyToken, controller.adminDashboard);
router.get('/admin-stats', verifyToken, controller.getAdminStats);

module.exports = router;
