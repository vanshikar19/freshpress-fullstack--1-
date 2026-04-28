const mongoose = require('mongoose');

const garmentSchema = new mongoose.Schema(
  {
    item:     { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price:    { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^\d{10}$/, 'Phone must be 10 digits'],
    },
    garments: {
      type: [garmentSchema],
      validate: {
        validator: v => v.length > 0,
        message: 'At least one garment is required',
      },
    },
    total: { type: Number, default: 0 },
    status: {
      type: String,
      enum: {
        values: ['RECEIVED', 'PROCESSING', 'READY', 'DELIVERED'],
        message: 'Status must be RECEIVED, PROCESSING, READY, or DELIVERED',
      },
      default: 'RECEIVED',
    },
    estimatedDelivery: { type: String, default: null },
    notes:             { type: String, default: '' },
    createdBy:         { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true, // adds createdAt + updatedAt automatically
  }
);

// Auto-generate orderId and recalculate total before save
orderSchema.pre('save', async function (next) {
  if (this.isNew) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderId = `ORD-${String(count + 1001).padStart(4, '0')}`;
  }
  // Recalculate total whenever garments change
  if (this.isModified('garments') || this.isNew) {
    this.total = this.garments.reduce((s, g) => s + g.quantity * g.price, 0);
  }
  next();
});

// Indexes for search performance
orderSchema.index({ customerName: 'text', phone: 'text' });
orderSchema.index({ status: 1 });
orderSchema.index({ estimatedDelivery: 1 });
orderSchema.index({ 'garments.item': 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
