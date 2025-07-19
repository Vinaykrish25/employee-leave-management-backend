// employeeLeaveController.js
const db = require('../db');

exports.applyLeave = async (req, res) => {
  const { leave_type_id, from_date, to_date, description } = req.body;
  const employee_id = req.user.userId;

  const overlapQuery = `
    SELECT * FROM leaves 
    WHERE employee_id = ?
      AND status IN ('Pending', 'Approved')
      AND (
        (from_date <= ? AND to_date >= ?) OR
        (from_date <= ? AND to_date >= ?) OR
        (? <= from_date AND ? >= to_date)
      )
  `;

  try {
    const [overlapResults] = await db.query(overlapQuery, [
      employee_id, from_date, from_date,
      to_date, to_date,
      from_date, to_date,
    ]);

    if (overlapResults.length > 0) {
      return res.status(400).json({ message: 'Leave already exists in the selected date range' });
    }

    const insertQuery = `
      INSERT INTO leaves (employee_id, leave_type_id, from_date, to_date, description, status, posting_date)
      VALUES (?, ?, ?, ?, ?, 'Pending', NOW())
    `;

    const [result] = await db.query(insertQuery, [
      employee_id,
      leave_type_id,
      from_date,
      to_date,
      description,
    ]);

    res.status(201).json({ message: 'Leave application submitted', leaveId: result.insertId });

  } catch (err) {
    console.error('Apply leave error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.leaveHistory = async (req, res) => {
  const employee_id = req.user.userId;

  const historyQuery = `
    SELECT 
      l.*, 
      lt.type AS leave_type,
      d.name AS department
    FROM leaves l
    JOIN leave_types lt ON l.leave_type_id = lt.id
    JOIN employees e ON l.employee_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE l.employee_id = ?
    ORDER BY l.posting_date DESC
  `;

  try {
    const [results] = await db.query(historyQuery, [employee_id]);
    res.json(results);
  } catch (err) {
    console.error('Leave history error:', err);
    res.status(500).json({ error: err.message });
  }
};
