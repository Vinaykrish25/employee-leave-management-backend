const db = require('../db');

exports.applyLeave = (req, res) => {
  const { employee_id, leave_type_id, from_date, to_date, description } = req.body;

  if (!employee_id || !leave_type_id || !from_date || !to_date || !description) {
    return res.status(400).json({ message: 'All fields are required for leave application' });
  }

  db.query(
    "INSERT INTO leaves (employee_id, leave_type_id, from_date, to_date, description, status, posting_date) VALUES (?, ?, ?, ?, ?, ?, NOW())",
    [employee_id, leave_type_id, from_date, to_date, description, "Pending"],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: "Leave applied", id: result.insertId });
    }
  );
};

exports.getLeavesByStatus = (req, res) => {
  const status = req.params.status;
  db.query(
    `SELECT l.*, e.first_name, e.last_name, lt.type as leave_type FROM leaves l 
     JOIN employees e ON l.employee_id = e.id 
     JOIN leave_types lt ON l.leave_type_id = lt.id 
     WHERE l.status = ? ORDER BY l.posting_date DESC`,
    [status],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
};

exports.getLeaveDetails = (req, res) => {
  const id = req.params.id;

  db.query(
    `SELECT 
       l.*, 
       e.first_name, 
       e.last_name, 
       e.employee_code,
       e.email,
       e.mobile_number,
       e.gender,
       e.birth_date,
       e.profile_image, 
       d.name AS department,
       lt.type AS leave_type 
     FROM leaves l
     JOIN employees e ON l.employee_id = e.id
     LEFT JOIN departments d ON e.department_id = d.id
     JOIN leave_types lt ON l.leave_type_id = lt.id
     WHERE l.id = ?`,
    [id],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'Leave not found' });
      res.json(results[0]);
    }
  );
};


exports.takeActionOnLeave = (req, res) => {
  const { id } = req.params;
  const { status, admin_remark } = req.body;

  const allowedStatuses = ["Approved", "Not Approved"];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid leave status" });
  }

  if (!admin_remark || admin_remark.trim().length === 0) {
    return res.status(400).json({ message: "Admin remark is required" });
  }

  db.query(
    "UPDATE leaves SET status = ?, admin_remark = ?, action_taken_date = NOW() WHERE id = ?",
    [status, admin_remark, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Leave status updated" });
    }
  );
};