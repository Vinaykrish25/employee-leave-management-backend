const db = require('../db');

exports.getAllLeaveTypes = (req, res) => {
  db.query('SELECT * FROM leave_types ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.createLeaveType = (req, res) => {
  const { type, description } = req.body;

  if (!type || typeof type !== 'string' || type.length < 3 || type.length > 100) {
    return res.status(400).json({ message: 'Leave type must be 3–100 characters' });
  }
  if (description && description.length > 255) {
    return res.status(400).json({ message: 'Description must be less than 255 characters' });
  }

  db.query(
    'INSERT INTO leave_types (type, description) VALUES (?, ?)',
    [type, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: result.insertId });
    }
  );
};

exports.updateLeaveType = (req, res) => {
  const { id } = req.params;
  const { type, description } = req.body;

  if (!type || typeof type !== 'string' || type.length < 3 || type.length > 100) {
    return res.status(400).json({ message: 'Leave type must be 3–100 characters' });
  }
  if (description && description.length > 255) {
    return res.status(400).json({ message: 'Description must be less than 255 characters' });
  }

  db.query(
    'UPDATE leave_types SET type = ?, description = ? WHERE id = ?',
    [type, description, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'Leave type updated successfully' });
    }
  );
};

exports.deleteLeaveType = (req, res) => {
  const id = req.params.id;
  db.query("SELECT COUNT(*) as count FROM leaves WHERE leave_type_id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result[0].count > 0) {
      return res.status(400).json({ message: "Cannot delete leave type. It is used in one or more leave records." });
    }

    db.query("DELETE FROM leave_types WHERE id = ?", [id], (err2) => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "Leave type deleted successfully" });
    });
  });
};
