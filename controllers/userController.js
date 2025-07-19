const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { blacklistedTokens } = require("../middlewares/verifyToken");

// Login
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [results] = await db.query("SELECT * FROM users WHERE username = ?", [username]);

    if (results.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      process.env.JSON_TOKEN,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      role: user.role,
      username: user.username,
      profile_image: user.profile_image || null,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout
exports.logout = (req, res) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(400).json({ message: "No token provided" });

  blacklistedTokens.add(token);
  res.json({ message: "Logout successful" });
};

// Change Password
exports.changePassword = async (req, res) => {
  const { userId } = req.user;
  const { oldPassword, newPassword } = req.body;

  try {
    const [results] = await db.query("SELECT password FROM users WHERE id = ?", [userId]);
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, results[0].password);
    if (!isMatch) return res.status(400).json({ message: "Old password incorrect" });

    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, userId]);

    res.json({ message: "Password changed successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin Dashboard
exports.adminDashboard = async (req, res) => {
  if (req.user.role !== "Admin")
    return res.status(403).json({ message: "Access denied" });

  try {
    const [statsResult] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM employees) AS total_employees,
        (SELECT COUNT(*) FROM departments) AS total_departments,
        (SELECT COUNT(*) FROM leave_types) AS total_leave_types,
        (SELECT COUNT(*) FROM leaves) AS total_leave_applications
    `);

    const [latestLeaves] = await db.query(`
      SELECT l.id, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, lt.type AS leave_type,
             l.posting_date, l.status
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      JOIN leave_types lt ON l.leave_type_id = lt.id
      ORDER BY l.posting_date DESC
      LIMIT 5
    `);

    res.json({
      stats: statsResult[0],
      latestLeaves,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Admin Stats Only
exports.getAdminStats = async (req, res) => {
  try {
    const [result] = await db.query(`
      SELECT
        (SELECT COUNT(*) FROM departments) AS total_departments,
        (SELECT COUNT(*) FROM employees) AS total_employees,
        (SELECT COUNT(*) FROM leaves) AS total_leave_applications,
        (SELECT COUNT(*) FROM leave_types) AS total_leave_types
    `);

    res.json(result[0]);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
