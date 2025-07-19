const db = require("../db");
const bcrypt = require("bcrypt");

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const [results] = await db.query(
      `SELECT e.*, d.name AS department 
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       ORDER BY e.registered_date DESC`
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create employee
exports.createEmployee = async (req, res) => {
  const {
    employee_code,
    first_name,
    last_name,
    email,
    password,
    gender,
    department_id,
    city,
    mobile_number,
    birth_date,
    country,
    address,
    profile_image,
  } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-Z]{2,30}$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!employee_code || !first_name || !email || !password || !gender || !department_id || !mobile_number) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  if (!nameRegex.test(first_name)) {
    return res.status(400).json({ message: "First name must be 2–30 alphabetic characters" });
  }

  if (last_name && !nameRegex.test(last_name)) {
    return res.status(400).json({ message: "Last name must be alphabetic (if provided)" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long" });
  }

  if (!["Male", "Female", "Other"].includes(gender)) {
    return res.status(400).json({ message: "Gender must be Male, Female or Other" });
  }

  if (!phoneRegex.test(mobile_number)) {
    return res.status(400).json({ message: "Invalid mobile number. Must be 10 digits" });
  }

  try {
    const empSql = `
      INSERT INTO employees
      (employee_code, first_name, last_name, email, password, gender, department_id, city, mobile_number, birth_date, country, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const empValues = [
      employee_code,
      first_name,
      last_name,
      email,
      password, // Store plaintext password in employees table
      gender,
      department_id,
      city,
      mobile_number,
      birth_date,
      country,
      address,
    ];

    const [empResult] = await db.query(empSql, empValues);
    const employeeId = empResult.insertId;

    const hashedPassword = await bcrypt.hash(password, 10);
    const username = `${first_name} ${last_name || ""}`.trim();

    const userSql = `
      INSERT INTO users (id, username, password, role, created_at, profile_image)
      VALUES (?, ?, ?, ?, NOW(), ?)
    `;
    await db.query(userSql, [employeeId, username, hashedPassword, "Employee", profile_image || null]);

    res.status(201).json({ message: "Employee and user created successfully", employeeId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update employee status
exports.updateEmployeeStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    await db.query("UPDATE employees SET status = ? WHERE id = ?", [status, id]);
    res.json({ message: "Employee status updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Edit employee
exports.editEmployee = async (req, res) => {
  const { id } = req.params;
  const {
    employee_code,
    first_name,
    last_name,
    email,
    gender,
    department_id,
    city,
    mobile_number,
    birth_date,
    country,
    address,
    profile_image,
  } = req.body;

  const profileImg = profile_image || null;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nameRegex = /^[a-zA-Z]{2,30}$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!employee_code || !first_name || !email || !gender || !department_id || !mobile_number) {
    return res.status(400).json({ message: "All required fields must be filled" });
  }

  if (!nameRegex.test(first_name)) {
    return res.status(400).json({ message: "First name must be 2–30 alphabetic characters" });
  }

  if (last_name && !nameRegex.test(last_name)) {
    return res.status(400).json({ message: "Last name must be alphabetic (if provided)" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!["Male", "Female", "Other"].includes(gender)) {
    return res.status(400).json({ message: "Gender must be Male, Female or Other" });
  }

  if (!phoneRegex.test(mobile_number)) {
    return res.status(400).json({ message: "Invalid mobile number. Must be 10 digits" });
  }

  const username = `${first_name} ${last_name || ""}`.trim();
  const formattedBirthDate = birth_date ? new Date(birth_date).toISOString().split("T")[0] : null;

  const updateEmpQuery = `
    UPDATE employees SET
      employee_code = ?, first_name = ?, last_name = ?, email = ?,
      gender = ?, department_id = ?, city = ?, mobile_number = ?,
      birth_date = ?, country = ?, address = ?, profile_image = ?
    WHERE id = ?
  `;

  try {
    await db.query(updateEmpQuery, [
      employee_code,
      first_name,
      last_name,
      email,
      gender,
      department_id,
      city,
      mobile_number,
      formattedBirthDate,
      country,
      address,
      profileImg,
      id,
    ]);

    await db.query(
      `UPDATE users SET username = ?, profile_image = ? WHERE id = ?`,
      [username, profileImg, id]
    );

    res.json({ message: "Employee and user info updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
