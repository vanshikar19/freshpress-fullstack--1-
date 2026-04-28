# 🧺 FreshPress — Laundry Order Management System

A full-stack laundry order management system built with **React + Node.js + MongoDB Atlas**, designed for dry cleaning stores to manage daily orders, track statuses, and view business insights.

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js ≥ 18
- MongoDB Atlas account (free tier works)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/freshpress.git
cd freshpress
```

---

### 2. Backend Setup

```bash
cd freshpress-backend
npm install
```

Create a `.env` file in `freshpress-backend/`:

```env
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/freshpress
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_URL=http://localhost:5173
```

Seed the database with users + sample orders:

```bash
node seed.js
```

Start the server:

```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```

API runs at: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

---

### 3. Frontend Setup

```bash
cd freshpress-frontend
npm install
```

Create a `.env` file in `freshpress-frontend/`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

App runs at: `http://localhost:5173`

---

### 4. Login Credentials

| Role  | Username | Password  |
|-------|----------|-----------|
| Admin | `admin`  | `admin123` |
| Staff | `staff`  | `staff123` |

---

## ✅ Features Implemented

### Core Features
- **Create Orders** — Customer name, phone, garments (item + quantity + price), auto-calculated total, unique Order ID (e.g. `ORD-1001`)
- **Order Status Management** — Four stages: `RECEIVED → PROCESSING → READY → DELIVERED`; update via Kanban board or list view
- **View & Filter Orders** — Filter by status, customer name, phone, garment type, estimated delivery date
- **Basic Dashboard** — Total orders, total revenue, avg order value, completion rate, orders per status, top garments chart, recent orders

### Bonus Features (All Implemented)
- **Authentication** — JWT-based login, role-based access (`admin` / `staff`)
- **MongoDB Atlas** — Persistent cloud storage with indexed queries
- **Search** — Filter by garment type (e.g. search "Saree" shows all orders with sarees)
- **Estimated Delivery Date** — Set and display per order
- **React Frontend** — Kanban board, dashboard with charts, order creation form
- **Deployment** — Backend on Render, Frontend on Vercel

---

## 🤖 AI Usage Report

### Tools Used
- **Claude (Anthropic)** — Primary tool for scaffolding, debugging, and iteration

---

### Sample Prompts Used

**1. Initial scaffold**
> "Build a Node.js + Express REST API for a laundry order management system. Models: User (name, username, password, role: admin/staff) and Order (orderId, customerName, phone, garments array with item/quantity/price, total, status enum, estimatedDelivery, notes, createdBy). Include JWT auth middleware, async error handling, and mongoose pre-save hooks for orderId generation and total calculation."

**2. Seed script**
> "Write a seed.js for this project that creates admin (admin123) and staff (staff123) users plus 8 sample orders spread across all four statuses. Use realistic Indian customer names."

**3. Bug fix — seed not creating orders**
> "My seed script uses User.create([...]) with an array but passwords aren't being hashed. Sample orders aren't showing up either. Here's my code: [pasted code]"

**4. Frontend Kanban**
> "Build a React Kanban board component that fetches orders from GET /api/orders and allows drag-and-drop status updates via PATCH /api/orders/:id/status. Use Tailwind CSS."

**5. Dashboard charts**
> "Add a recharts BarChart to the dashboard showing orders per status and a PieChart for top 5 garment types by quantity."

---

### What AI Got Right
- Boilerplate setup (Express server, mongoose models, JWT middleware) was near-perfect on first try
- Error handling middleware pattern (`asyncHandler` wrapper) was clean and reusable
- Mongoose schema with pre-save hooks for `orderId` and auto-calculated `total`
- React component structure and API service layer

### What AI Got Wrong / What I Fixed

| Issue | AI Output | Fix Applied |
|-------|-----------|-------------|
| `User.create([...])` bypasses pre-save hooks | Used array form which skips bcrypt hashing | Changed to individual `await User.create({})` calls per user |
| `orderId` race condition | Parallel inserts caused duplicate `ORD-1001` | Sequential `await` in `for` loop instead of `Promise.all` |
| CORS config | Hardcoded `localhost` origin | Made it read from `process.env.CLIENT_URL` |
| Order filter aggregation | `$match` filter not applied to `statusCounts` aggregation | Added same filter object to the aggregate pipeline |
| JWT expiry not configurable | Hardcoded `'7d'` | Read from `process.env.JWT_EXPIRES_IN` with fallback |

---

## ⚖️ Tradeoffs & Decisions

### What I Skipped
- **Email/SMS notifications** — Out of scope, would need a third-party service
- **Pagination UI** — API supports it (`?page=1&limit=20`) but the frontend loads all orders (fine for a small store)
- **Password reset flow** — Not in requirements; admin can re-seed or update directly
- **Unit tests** — Given 72-hour limit, manual testing + Postman collection was prioritised

### What I'd Improve With More Time
- Add WebSockets for real-time status updates across multiple staff devices
- Receipt/invoice PDF generation per order
- WhatsApp notification when order is READY (Twilio / Meta API)
- Analytics: revenue by week/month with trend lines
- Barcode/QR scan for quick order lookup at counter
- Role-based UI (staff can't see revenue figures)

---

## 📁 Project Structure

```
freshpress/
├── freshpress-backend/
│   ├── src/
│   │   ├── config/db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── ordersController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Order.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── orders.js
│   │   └── server.js
│   ├── seed.js
│   ├── .env.example
│   └── package.json
└── freshpress-frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── App.jsx
    └── package.json
```

---

## 📮 API Reference

Base URL: `http://localhost:5000/api`

All `/orders` routes require `Authorization: Bearer <token>` header.

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login, returns JWT |
| GET | `/auth/me` | Get current user |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/orders` | All | List orders (filterable) |
| POST | `/orders` | All | Create order |
| GET | `/orders/dashboard` | All | Dashboard stats |
| GET | `/orders/:id` | All | Get single order |
| PATCH | `/orders/:id/status` | All | Update status |
| PUT | `/orders/:id` | Admin | Full order update |
| DELETE | `/orders/:id` | Admin | Delete order |

### Query Filters for GET `/orders`
```
?status=RECEIVED
?name=Rahul
?phone=9876543210
?garment=Saree
?estimatedDelivery=2025-05-01
?page=1&limit=20&sort=-createdAt
```
