const db = require('../db');

exports.getAllLeaveDetails = async (req, res) => {
  const query = `
    SELECT 
      e.first_name, 
      e.last_name,
      e.employee_code,
      e.email,
      e.mobile_number,
      e.gender,
      d.name AS department,           
      lt.type AS leave_type,
      l.from_date,
      l.to_date,
      l.posting_date,
      l.description AS leave_description,
      l.status,
      IFNULL(l.admin_remark, 'NA') AS admin_remark,
      IFNULL(l.action_taken_date, 'NA') AS action_taken_date
    FROM leaves l
    JOIN employees e ON l.employee_id = e.id
    LEFT JOIN departments d ON e.department_id = d.id
    JOIN leave_types lt ON l.leave_type_id = lt.id
    ORDER BY l.posting_date DESC
  `;

  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error('❌ Error fetching leave details:', err.message);
    res.status(500).json({ error: err.message });
  }
};
