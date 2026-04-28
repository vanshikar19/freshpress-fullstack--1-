const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, username, password, role } = req.body;

  const existing = await User.findOne({ username });
  if (existing) {
    return res.status(400).json({ error: 'Username already taken' });
  }

  const user = await User.create({ name, username, password, role });
  const token = signToken(user._id);

  res.status(201).json({ token, user });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  const user = await User.findOne({ username }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

  const token = signToken(user._id);
  res.json({ token, user: user.toJSON() });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/logout  (client just drops the token — server can blacklist if needed)
exports.logout = asyncHandler(async (req, res) => {
  res.json({ message: 'Logged out successfully' });
});
