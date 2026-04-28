const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');

const { register, login, getMe, logout } = require('../controllers/authController');
const { protect }   = require('../middleware/auth');
const { validate }  = require('../middleware/errorHandler');

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be ≥ 3 chars'),
    body('password').isLength({ min: 6 }).withMessage('Password must be ≥ 6 chars'),
  ],
  validate,
  register
);

router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
