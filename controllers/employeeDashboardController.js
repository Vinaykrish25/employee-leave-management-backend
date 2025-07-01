const db = require('../db');

exports.getDashboardSummary = (req, res) => {
  const { employeeId } = req.params;

  if (req.user.userId != employeeId) return res.status(403).json({ message: 'Unauthorized' });

  const query = `
    SELECT 
      COUNT(*) AS total,
      SUM(status = 'Approved') AS approved,
      SUM(status = 'Pending') AS pending,
      SUM(status = 'Not Approved') AS notApproved
    FROM leaves
    WHERE employee_id = ?
  `;

  db.query(query, [employeeId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
};
