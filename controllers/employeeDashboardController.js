// employeeDashboardController.js
const db = require('../db');

exports.getDashboardSummary = async (req, res) => {
  const { employeeId } = req.params;

  if (req.user.userId != employeeId) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const query = `
    SELECT 
      COUNT(*) AS total,
      SUM(status = 'Approved') AS approved,
      SUM(status = 'Pending') AS pending,
      SUM(status = 'Not Approved') AS notApproved
    FROM leaves
    WHERE employee_id = ?
  `;

  try {
    const [results] = await db.query(query, [employeeId]);
    res.json(results[0]);
  } catch (err) {
    console.error('Dashboard summary error:', err);
    res.status(500).json({ error: err.message });
  }
};
