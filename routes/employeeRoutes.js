const express = require('express');
const router = express.Router();
const controller = require('../controllers/employeeController');

router.get('/', controller.getAllEmployees);
router.post('/', controller.createEmployee);
router.put('/:id', controller.editEmployee);
router.patch('/status/:id', controller.updateEmployeeStatus);

module.exports = router;