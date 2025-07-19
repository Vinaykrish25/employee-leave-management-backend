const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
dotenv.config();

const app = express();
app.use(cors({
  origin: 'https://employee-leave-management-frontend.vercel.app',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // optional but safe

app.use('/uploads', express.static('uploads')); // serve images

const departmentRoutes = require('./routes/departmentRoutes');
const leaveDetailsRoutes = require('./routes/leaveDetailsRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const leaveTypeRoutes = require('./routes/leaveTypeRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const userRoutes = require('./routes/userRoutes');

const employeeLeaveRoutes = require('./routes/employeeLeaveRoutes');
const employeeDashboardRoutes = require('./routes/employeeDashboardRoutes');
const employeeProfileRoutes = require('./routes/employeeProfileRoutes');

app.use('/departments', departmentRoutes);
app.use('/leave-details', leaveDetailsRoutes);
app.use('/leaves', leaveRoutes);
app.use('/leave-types', leaveTypeRoutes);
app.use('/employees', employeeRoutes);
app.use('/users', userRoutes);

app.use('/employee-leave', employeeLeaveRoutes);
app.use('/employee-dashboard', employeeDashboardRoutes);
app.use('/employee-profile', employeeProfileRoutes);

module.exports = app;