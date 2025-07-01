const db = require("../db");
const bcrypt = require("bcrypt");

exports.getAllEmployees = (req, res) => {
  db.query(
    `SELECT e.*, d.name AS department 
    FROM employees e
    LEFT JOIN departments d ON e.department_id = d.id
    ORDER BY e.registered_date DESC`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

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

  if (
    !employee_code ||
    !first_name ||
    !email ||
    !password ||
    !gender ||
    !department_id ||
    !mobile_number
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled" });
  }

  if (!nameRegex.test(first_name)) {
    return res
      .status(400)
      .json({ message: "First name must be 2–30 alphabetic characters" });
  }

  if (last_name && !nameRegex.test(last_name)) {
    return res
      .status(400)
      .json({ message: "Last name must be alphabetic (if provided)" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  if (!["Male", "Female", "Other"].includes(gender)) {
    return res
      .status(400)
      .json({ message: "Gender must be Male, Female or Other" });
  }

  if (!phoneRegex.test(mobile_number)) {
    return res
      .status(400)
      .json({ message: "Invalid mobile number. Must be 10 digits" });
  }

  try {
    // First insert into employees table
    const empSql = `
      INSERT INTO employees
      (employee_code, first_name, last_name, email, password, gender, department_id, city, mobile_number, birth_date, country, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const empValues = [
      employee_code,
      first_name,
      last_name,
      email,
      password, // plaintext in employees
      gender,
      department_id,
      city,
      mobile_number,
      birth_date,
      country,
      address,
    ];

    db.query(empSql, empValues, async (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      const employeeId = result.insertId;
      const username = `${first_name} ${last_name || ""}`;
      const hashedPassword = await bcrypt.hash(password, 10);

      const userSql = `
        INSERT INTO users (id, username, password, role, created_at, profile_image)
        VALUES (?, ?, ?, ?, NOW(), ?)`;

      db.query(
        userSql,
        [
          employeeId,
          username,
          hashedPassword,
          "Employee",
          profile_image || null,
        ],
        (userErr) => {
          if (userErr) return res.status(500).json({ error: userErr.message });
          res
            .status(201)
            .json({
              message: "Employee and user created successfully",
              employeeId,
            });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateEmployeeStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  db.query(
    "UPDATE employees SET status = ? WHERE id = ?",
    [status, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // Optionally reflect status in users table if needed (not mandatory here)
      res.json({ message: "Employee status updated" });
    }
  );
};

exports.editEmployee = (req, res) => {
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

  if (
    !employee_code ||
    !first_name ||
    !email ||
    !gender ||
    !department_id ||
    !mobile_number
  ) {
    return res
      .status(400)
      .json({ message: "All required fields must be filled" });
  }

  if (!nameRegex.test(first_name)) {
    return res
      .status(400)
      .json({ message: "First name must be 2–30 alphabetic characters" });
  }

  if (last_name && !nameRegex.test(last_name)) {
    return res
      .status(400)
      .json({ message: "Last name must be alphabetic (if provided)" });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  if (!["Male", "Female", "Other"].includes(gender)) {
    return res
      .status(400)
      .json({ message: "Gender must be Male, Female or Other" });
  }

  if (!phoneRegex.test(mobile_number)) {
    return res
      .status(400)
      .json({ message: "Invalid mobile number. Must be 10 digits" });
  }

  const updateEmpQuery = `
    UPDATE employees SET
      employee_code = ?, first_name = ?, last_name = ?, email = ?,
      gender = ?, department_id = ?, city = ?, mobile_number = ?,
      birth_date = ?, country = ?, address = ?, profile_image = ?
    WHERE id = ?`;

  const username = `${first_name} ${last_name || ""}`;
  const formattedBirthDate = birth_date
    ? new Date(birth_date).toISOString().split("T")[0]
    : null;

  db.query(
    updateEmpQuery,
    [
      employee_code,
      first_name,
      last_name,
      email,
      gender,
      department_id,
      city,
      mobile_number,
      formattedBirthDate, // 👈 updated here
      country,
      address,
      profileImg,
      id,
    ],
    (err) => {
      if (err) {
        console.error("Employee update error:", err);
        return res.status(500).json({ error: err.message });
      }

      db.query(
        `UPDATE users SET username = ?, profile_image = ? WHERE id = ?`,
        [username, profileImg, id],
        (userErr) => {
          if (userErr) {
            console.error("User update error:", userErr);
            return res.status(500).json({ error: userErr.message });
          }
          res.json({ message: "Employee and user info updated successfully" });
        }
      );
    }
  );
};
