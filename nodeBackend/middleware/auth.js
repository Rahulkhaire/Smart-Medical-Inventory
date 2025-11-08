// middleware/auth.js
const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ msg: 'No token, authorization denied' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user; // { id, role }
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ msg: 'Auth required' });
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
  next();
};

module.exports = { auth, adminOnly };
