const db = require('../db');
const bcrypt = require('bcrypt');

// GET Employee Profile
exports.getEmployeeProfile = (req, res) => {
  const { userId, role } = req.user;

  if (role !== 'Employee') {
    return res.status(403).json({ message: 'Access denied' });
  }

  const query = `
    SELECT 
      e.id,
      e.first_name,
      e.last_name,
      e.email,
      e.mobile_number,
      e.city,
      e.country,
      e.birth_date,
      e.address,
      d.name AS department,
      u.username,
      u.profile_image
    FROM employees e
    JOIN users u ON e.id = u.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE e.id = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Profile not found' });

    res.json(results[0]);
  });
};

exports.updateEmployeeProfile = async (req, res) => {
  const { userId, role } = req.user;
  if (role !== 'Employee') return res.status(403).json({ message: 'Access denied' });

  const { username, first_name, last_name, email, mobile_number } = req.body;
  const profile_image = req.file ? `/uploads/profile_images/${req.file.filename}` : null;

  const updateUserSql = `UPDATE users SET username = ?, profile_image = ? WHERE id = ?`;
  const updateEmpSql = `UPDATE employees SET first_name = ?, last_name = ?, email = ?, mobile_number = ?, profile_image = ? WHERE id = ?`;

  db.query(updateUserSql, [username, profile_image, userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(updateEmpSql, [first_name, last_name, email, mobile_number, profile_image, userId], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: 'Profile updated successfully', profile_image });
    });
  });
};

