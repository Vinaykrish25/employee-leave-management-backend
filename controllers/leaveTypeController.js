const db = require('../db');

// Get all leave types
exports.getAllLeaveTypes = async (req, res) => {
  try {
    const [results] = await db.query(
      'SELECT id, type, description, created_at FROM leave_types ORDER BY created_at DESC'
    );
    res.json(results);
  } catch (err) {
    console.error('Error fetching leave types:', err.message);
    res.status(500).json({ error: err.message });
  }
};

// Create a new leave type
exports.createLeaveType = (req, res) => {
  const { type, description } = req.body;

  if (!type || typeof type !== 'string' || type.length < 3 || type.length > 100) {
    return res.status(400).json({ message: 'Leave type must be 3–100 characters' });
  }

  if (description && description.length > 255) {
    return res.status(400).json({ message: 'Description must be under 255 characters' });
  }

  const sql = 'INSERT INTO leave_types (type, description) VALUES (?, ?)';
  db.query(sql, [type.trim(), description || null], (err, result) => {
    if (err) return res.status(500).json({ error: 'Failed to create leave type' });
    res.status(201).json({ message: 'Leave type created successfully', id: result.insertId });
  });
};

// Update an existing leave type
exports.updateLeaveType = (req, res) => {
  const { id } = req.params;
  const { type, description } = req.body;

  if (!type || typeof type !== 'string' || type.length < 3 || type.length > 100) {
    return res.status(400).json({ message: 'Leave type must be 3–100 characters' });
  }

  if (description && description.length > 255) {
    return res.status(400).json({ message: 'Description must be under 255 characters' });
  }

  const sql = 'UPDATE leave_types SET type = ?, description = ? WHERE id = ?';
  db.query(sql, [type.trim(), description || null, id], (err) => {
    if (err) return res.status(500).json({ error: 'Failed to update leave type' });
    res.json({ message: 'Leave type updated successfully' });
  });
};

// Delete a leave type
exports.deleteLeaveType = (req, res) => {
  const id = req.params.id;

  // Check if any leaves are using this type
  db.query(
    'SELECT COUNT(*) AS count FROM leaves WHERE leave_type_id = ?',
    [id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to check leave references' });

      if (result[0].count > 0) {
        return res.status(400).json({
          message: 'Cannot delete this leave type because it is in use in leave applications.',
        });
      }

      // Proceed to delete
      db.query('DELETE FROM leave_types WHERE id = ?', [id], (err2) => {
        if (err2) return res.status(500).json({ error: 'Failed to delete leave type' });
        res.json({ message: 'Leave type deleted successfully' });
      });
    }
  );
};
