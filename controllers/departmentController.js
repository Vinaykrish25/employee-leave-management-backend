const db = require('../db');

exports.getAllDepartments = (req, res) => {
  db.query('SELECT * FROM departments ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.createDepartment = (req, res) => {
  const { department_code, name, short_name } = req.body;

  if (!department_code || department_code.length > 10) {
    return res.status(400).json({ message: 'Department code must be ≤ 10 characters' });
  }
  if (!name || name.length > 100) {
    return res.status(400).json({ message: 'Department name must be ≤ 100 characters' });
  }
  if (!short_name || short_name.length > 50) {
    return res.status(400).json({ message: 'Short name must be ≤ 50 characters' });
  }

  db.query(
    'INSERT INTO departments (department_code, name, short_name) VALUES (?, ?, ?)',
    [department_code, name, short_name],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Department added successfully', id: result.insertId });
    }
  );
};

exports.updateDepartment = (req, res) => {
  const { id } = req.params;
  const { department_code, name, short_name } = req.body;

  if (!department_code || department_code.length > 10) {
    return res.status(400).json({ message: 'Department code must be ≤ 10 characters' });
  }
  if (!name || name.length > 100) {
    return res.status(400).json({ message: 'Department name must be ≤ 100 characters' });
  }
  if (!short_name || short_name.length > 50) {
    return res.status(400).json({ message: 'Short name must be ≤ 50 characters' });
  }

  db.query(
    'UPDATE departments SET department_code = ?, name = ?, short_name = ? WHERE id = ?',
    [department_code, name, short_name, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Department updated successfully' });
    }
  );
};

exports.deleteDepartment = (req, res) => {
  const id = req.params.id;
  db.query("SELECT COUNT(*) as count FROM employees WHERE department_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result[0].count > 0) {
      return res.status(400).json({ message: "Cannot delete department. It is assigned to one or more employees." });
    }

    db.query("DELETE FROM departments WHERE id = ?", [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Department deleted successfully" });
    });
  });
};
