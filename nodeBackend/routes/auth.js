const express = require('express');
const { check, body } = require('express-validator'); // ✅ include body here
const router = express.Router();
const { register, login, adminLogin } = require('../controllers/authController');

router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6+ chars').isLength({ min: 6 }),
  ],
  register
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  login
);

// ✅ Admin login route
router.post(
  '/admin-login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password required'),
  ],
  adminLogin
);

module.exports = router;
