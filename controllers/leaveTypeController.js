const db = require('../db');

// ✅ Get all leave types
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

// ✅ Create a new leave type
exports.createLeaveType = async (req, res) => {
  const { type, description } = req.body;

  if (!type || typeof type !== 'string' || type.length < 3 || type.length > 100) {
    return res.status(400).json({ message: 'Leave type must be 3–100 characters' });
  }

  if (description && description.length > 255) {
    return res.status(400).json({ message: 'Description must be under 255 characters' });
  }

  try {
    const sql = 'INSERT INTO leave_types (type, description) VALUES (?, ?)';
    const [result] = await db.query(sql, [type.trim(), description || null]);
    res.status(201).json({ message: 'Leave type created successfully', id: result.insertId });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Leave type already exists' });
    }
    console.error('Create leave type error:', err.message);
    res.status(500).json({ error: 'Failed to create leave type' });
  }
};

// ✅ Update an existing leave type
exports.updateLeaveType = async (req, res) => {
  const { id } = req.params;
  const { type, description } = req.body;

  if (!type || typeof type !== 'string' || type.length < 3 || type.length > 100) {
    return res.status(400).json({ message: 'Leave type must be 3–100 characters' });
  }

  if (description && description.length > 255) {
    return res.status(400).json({ message: 'Description must be under 255 characters' });
  }

  try {
    const sql = 'UPDATE leave_types SET type = ?, description = ? WHERE id = ?';
    await db.query(sql, [type.trim(), description || null, id]);
    res.json({ message: 'Leave type updated successfully' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Leave type already exists' });
    }
    console.error('Update leave type error:', err.message);
    res.status(500).json({ error: 'Failed to update leave type' });
  }
};

// ✅ Delete a leave type
exports.deleteLeaveType = async (req, res) => {
  const id = req.params.id;

  try {
    // Check if any leaves are using this type
    const [result] = await db.query(
      'SELECT COUNT(*) AS count FROM leaves WHERE leave_type_id = ?',
      [id]
    );

    if (result[0].count > 0) {
      return res.status(400).json({
        message: 'Cannot delete this leave type because it is in use in leave applications.',
      });
    }

    // Proceed to delete
    await db.query('DELETE FROM leave_types WHERE id = ?', [id]);
    res.json({ message: 'Leave type deleted successfully' });
  } catch (err) {
    console.error('Delete leave type error:', err.message);
    res.status(500).json({ error: 'Failed to delete leave type' });
  }
};
