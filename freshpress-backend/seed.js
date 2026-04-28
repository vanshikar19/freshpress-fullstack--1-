require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");
const Order = require("./src/models/Order");

const GARMENT_PRICES = {
  Shirt: 80,
  Pants: 100,
  Saree: 200,
  "Suit (2pc)": 350,
  Jacket: 250,
  Kurta: 120,
  "Bed Sheet": 150,
  Towel: 60,
  Blanket: 300,
  Dress: 180,
};

const sampleGarments = (items) =>
  items.map(([item, qty]) => ({
    item,
    quantity: qty,
    price: GARMENT_PRICES[item] || 100,
  }));

async function seed() {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/freshpress",
  );
  console.log("✅ Connected to MongoDB");

  // Clear existing
  await Promise.all([User.deleteMany(), Order.deleteMany()]);
  console.log("🗑️  Cleared existing data");

  // Create users ONE BY ONE so the pre-save (bcrypt) hook fires for each
  const admin = await User.create({
    name: "Admin",
    username: "admin",
    password: "admin123",
    role: "admin",
  });
  const staff = await User.create({
    name: "Staff",
    username: "staff",
    password: "staff123",
    role: "staff",
  });
  console.log("👤 Created users: admin, staff");

  // Sample orders
  const statuses = ["RECEIVED", "PROCESSING", "READY", "DELIVERED"];
  const customers = [
    [
      "Rahul Sharma",
      "9876543210",
      [
        ["Shirt", 3],
        ["Pants", 2],
      ],
    ],
    [
      "Priya Mehta",
      "9123456780",
      [
        ["Saree", 2],
        ["Dress", 1],
      ],
    ],
    [
      "Amit Kumar",
      "9988776655",
      [
        ["Suit (2pc)", 1],
        ["Shirt", 5],
      ],
    ],
    [
      "Sunita Devi",
      "9871234560",
      [
        ["Kurta", 4],
        ["Bed Sheet", 2],
      ],
    ],
    [
      "Rajan Gupta",
      "9765432180",
      [
        ["Jacket", 1],
        ["Blanket", 1],
      ],
    ],
    ["Meena Agarwal", "9654321870", [["Saree", 3]]],
    [
      "Vijay Singh",
      "9543218760",
      [
        ["Pants", 3],
        ["Shirt", 2],
        ["Towel", 4],
      ],
    ],
    [
      "Kavita Joshi",
      "9432187650",
      [
        ["Dress", 2],
        ["Kurta", 2],
      ],
    ],
  ];

  const deliveries = [
    "2025-05-01",
    "2025-05-03",
    "2025-05-05",
    "2025-05-07",
    "2025-05-10",
  ];

  // Create orders ONE BY ONE so pre-save orderId counter is accurate
  for (let i = 0; i < customers.length; i++) {
    const [name, phone, items] = customers[i];
    const order = await Order.create({
      customerName: name,
      phone,
      garments: sampleGarments(items),
      status: statuses[i % statuses.length],
      estimatedDelivery: deliveries[i % deliveries.length],
      notes: i % 3 === 0 ? "Handle with care" : "",
      createdBy: i % 2 === 0 ? admin._id : staff._id,
    });
    console.log(
      `📦 ${order.orderId} — ${name} [${order.status}] ₹${order.total}`,
    );
  }

  console.log("\n✅ Seed complete!");
  console.log("   admin / admin123  (role: admin)");
  console.log("   staff / staff123  (role: staff)");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed error:", err);
  process.exit(1);
});
