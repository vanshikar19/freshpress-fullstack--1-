const Order = require('../models/Order');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/orders
exports.getOrders = asyncHandler(async (req, res) => {
  const {
    status, name, phone, garment, estimatedDelivery,
    page = 1, limit = 100, sort = '-createdAt',
  } = req.query;

  const filter = {};
  if (status)            filter.status = status.toUpperCase();
  if (phone)             filter.phone = { $regex: phone, $options: 'i' };
  if (name)              filter.customerName = { $regex: name, $options: 'i' };
  if (garment)           filter['garments.item'] = { $regex: garment, $options: 'i' };
  if (estimatedDelivery) filter.estimatedDelivery = estimatedDelivery;

  const skip = (Number(page) - 1) * Number(limit);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('createdBy', 'name username'),
    Order.countDocuments(filter),
  ]);

  // Also return count per status for kanban headers
  const statusCounts = await Order.aggregate([
    { $match: Object.keys(filter).length ? filter : {} },
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);
  const perStatus = { RECEIVED: 0, PROCESSING: 0, READY: 0, DELIVERED: 0 };
  statusCounts.forEach(s => { perStatus[s._id] = s.count; });

  res.json({ total, page: Number(page), pages: Math.ceil(total / Number(limit)), orders, perStatus });
});

// GET /api/orders/dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const [totalOrders, statusBreakdown, revenueAgg, topGarments, recentOrders] =
    await Promise.all([
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([
        { $unwind: '$garments' },
        { $group: { _id: '$garments.item', totalQty: { $sum: '$garments.quantity' } } },
        { $sort: { totalQty: -1 } },
        { $limit: 5 },
      ]),
      Order.find().sort('-createdAt').limit(5)
        .select('orderId customerName phone total status createdAt estimatedDelivery'),
    ]);

  const perStatus = { RECEIVED: 0, PROCESSING: 0, READY: 0, DELIVERED: 0 };
  statusBreakdown.forEach(s => { perStatus[s._id] = s.count; });

  const revenue = revenueAgg[0]?.total || 0;
  const delivered = perStatus.DELIVERED;

  res.json({
    totalOrders,
    totalRevenue: revenue,
    delivered,
    avgOrderValue: totalOrders ? Math.round(revenue / totalOrders) : 0,
    completionRate: totalOrders ? Math.round((delivered / totalOrders) * 100) : 0,
    ordersPerStatus: perStatus,
    topGarments,
    recentOrders,
  });
});

// GET /api/orders/:id
exports.getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.id })
    .populate('createdBy', 'name username');
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

// POST /api/orders
exports.createOrder = asyncHandler(async (req, res) => {
  const { customerName, phone, garments, estimatedDelivery, notes } = req.body;
  const order = await Order.create({
    customerName, phone, garments,
    estimatedDelivery: estimatedDelivery || null,
    notes: notes || '',
    createdBy: req.user._id,
  });
  res.status(201).json({ message: 'Order created', order });
});

// PATCH /api/orders/:id/status  — saves to MongoDB
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const valid = ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'];

  if (!valid.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${valid.join(', ')}` });
  }

  const order = await Order.findOneAndUpdate(
    { orderId: req.params.id },
    { $set: { status } },           // explicit $set ensures updatedAt is touched
    { new: true, runValidators: true }
  );

  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ message: 'Status updated', order });
});

// PUT /api/orders/:id  (admin only)
exports.updateOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { orderId: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ message: 'Order updated', order });
});

// DELETE /api/orders/:id  (admin only)
exports.deleteOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOneAndDelete({ orderId: req.params.id });
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ message: 'Order deleted' });
});
