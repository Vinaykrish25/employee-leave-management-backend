// correct export
const jwt = require('jsonwebtoken');
const blacklistedTokens = new Set();

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'Token required' });

  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: 'Token has been logged out. Please login again.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JSON_TOKEN);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = verifyToken; // ✅ just the function
module.exports.blacklistedTokens = blacklistedTokens; // ✅ additional export for reference
