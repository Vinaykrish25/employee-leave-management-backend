const db = require('../db');

exports.applyLeave = (req, res) => {
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

  db.query(
    overlapQuery,
    [employee_id, from_date, from_date, to_date, to_date, from_date, to_date],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ message: 'Leave already exists in the selected date range' });
      }

      // No overlap → insert new leave
      db.query(
        `INSERT INTO leaves (employee_id, leave_type_id, from_date, to_date, description, status, posting_date)
         VALUES (?, ?, ?, ?, ?, 'Pending', NOW())`,
        [employee_id, leave_type_id, from_date, to_date, description],
        (err2, result) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.status(201).json({ message: 'Leave application submitted', leaveId: result.insertId });
        }
      );
    }
  );
};

exports.leaveHistory = (req, res) => {
  const employee_id = req.user.userId;
  db.query(
    `SELECT 
      l.*, 
      lt.type AS leave_type,
      d.name AS department
    FROM leaves l
    JOIN leave_types lt ON l.leave_type_id = lt.id
    JOIN employees e ON l.employee_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    WHERE l.employee_id = ?
    ORDER BY l.posting_date DESC`,
    [employee_id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};
