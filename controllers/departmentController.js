const db = require('../db');

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM departments ORDER BY created_at DESC');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new department
exports.createDepartment = async (req, res) => {
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

  try {
    const [result] = await db.query(
      'INSERT INTO departments (department_code, name, short_name) VALUES (?, ?, ?)',
      [department_code, name, short_name]
    );
    res.status(201).json({ message: 'Department added successfully', id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update existing department
exports.updateDepartment = async (req, res) => {
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

  try {
    await db.query(
      'UPDATE departments SET department_code = ?, name = ?, short_name = ? WHERE id = ?',
      [department_code, name, short_name, id]
    );
    res.json({ message: 'Department updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM employees WHERE department_id = ?',
      [id]
    );

    if (result[0].count > 0) {
      return res.status(400).json({
        message: 'Cannot delete department. It is assigned to one or more employees.',
      });
    }

    await db.query('DELETE FROM departments WHERE id = ?', [id]);
    res.json({ message: 'Department deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
