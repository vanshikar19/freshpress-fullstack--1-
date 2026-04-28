const express = require('express');
const router  = express.Router();
const { body } = require('express-validator');

const {
  getOrders, getOrder, createOrder,
  updateStatus, updateOrder, deleteOrder, getDashboard,
} = require('../controllers/ordersController');

const { protect, requireRole } = require('../middleware/auth');
const { validate } = require('../middleware/errorHandler');

// All routes require login
router.use(protect);

// Dashboard (before /:id so it doesn't get captured)
router.get('/dashboard', getDashboard);

// List & create
router.get('/', getOrders);

router.post(
  '/',
  [
    body('customerName').trim().notEmpty().withMessage('Customer name is required'),
    body('phone').matches(/^\d{10}$/).withMessage('Phone must be 10 digits'),
    body('garments').isArray({ min: 1 }).withMessage('At least one garment required'),
    body('garments.*.item').notEmpty().withMessage('Garment item name required'),
    body('garments.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be ≥ 1'),
    body('garments.*.price').isFloat({ min: 0 }).withMessage('Price must be ≥ 0'),
  ],
  validate,
  createOrder
);

// Single order
router.get('/:id', getOrder);

// Status update (staff + admin)
router.patch(
  '/:id/status',
  [body('status').notEmpty().withMessage('Status is required')],
  validate,
  updateStatus
);

// Full update — admin only
router.put('/:id', requireRole('admin'), updateOrder);

// Delete — admin only
router.delete('/:id', requireRole('admin'), deleteOrder);

module.exports = router;
