const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');
dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
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

app.use('/api/departments', departmentRoutes);
app.use('/api/leave-details', leaveDetailsRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/leave-types', leaveTypeRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/users', userRoutes);

app.use('/api/employee-leave', employeeLeaveRoutes);
app.use('/api/employee-dashboard', employeeDashboardRoutes);
app.use('/api/employee-profile', employeeProfileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));