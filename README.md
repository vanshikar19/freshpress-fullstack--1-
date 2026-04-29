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
git clone https://github.com/vanshikar19/freshpress-fullstack--1-.git
```

---

### Frontend (demo mode — no backend needed)
```bash
cd freshpress && npm install && npm run dev
# http://localhost:5173
# admin / admin123   or   staff / staff123


### Backend
```bash
cd freshpress-backend
npm install
node seed.js                # seed demo data
npm run dev                 # http://localhost:5000
```


### Connect frontend to backend
```bash
# freshpress/.env
VITE_API_MODE=true
VITE_API_URL=http://localhost:5000/api
```

Start the server:

```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```

API runs at: `http://localhost:5000`
Health check: `http://localhost:5000/api/health`

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
- **Claude (Anthropic) & Co-pilot** — Primary tools for scaffolding, debugging, and iteration

---

### Sample Prompts Used

**Prompt 1 — Initial Scaffold**

>"Build a Node.js + Express REST API for a laundry order management system. Models: User (name, username, password, role: admin/staff) and Order (orderId, customerName, phone, garments array with item/quantity/price, total, status enum, estimatedDelivery, notes, createdBy). Include JWT auth middleware, async error handling, and mongoose pre-save hooks for orderId generation and total calculation."

>What AI did: Generated the complete backend — server.js, User.js, Order.js, authController.js, ordersController.js, all routes, auth.js middleware, and errorHandler.js in one shot. Structure was clean and production-ready.
>What I verified: Reviewed every file, confirmed logic was correct, no changes needed.

**Prompt 2 — Seed Script (First attempt)**

>"Write a seed.js that creates admin (admin123) and staff (staff123) users. Use MongoDB Atlas."

>What AI did: Generated a basic seed with just two users, no sample orders.
>What I did: Manually expanded it to add 8 sample orders with Indian customer names, garment arrays, statuses, and delivery dates — AI only gave me the skeleton.

**Prompt 3 — Bug Fix**

>"I ran seed.js but sample orders aren't showing in the app. Here's my seed: [pasted full code with User.create([...]) array]"

>What AI diagnosed: User.create([...]) with an array calls insertMany internally, which bypasses Mongoose pre-save hooks — so bcrypt never ran, passwords were stored as plain text, and login always failed. Orders were also being created with Promise.all causing countDocuments() to return the same value for all, leading to duplicate orderId conflicts.
>Fix applied: Changed to individual await User.create({}) calls per user. Changed order creation to sequential for loop with await so orderId counter increments correctly between inserts.

**Prompt 5 — Search/Filter Blank Page Bug**

>"When I type anything in the search filters, the entire page goes blank. Happens with all filters — name, phone, status, garment."

>What AI diagnosed: The filter inputs were triggering an API refetch, but the component was trying to call .map() on orders before the response arrived — or the response was undefined when filters returned no results. React crashed silently and rendered a blank page instead of an empty state.
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
freshpress/                   ← React Frontend
├── src/
│   ├── components/
│   │   ├── create/           GarmentRow, BillPreview
│   │   ├── dashboard/        StatCard
│   │   ├── layout/           Navbar, PageShell
│   │   ├── orders/           OrderCard, OrderFilters
│   │   └── ui/               Button, Card, StatusBadge, Toast
│   ├── context/              AuthContext, OrdersContext
│   ├── hooks/                useOrderFilter, useOrderForm
│   ├── pages/                Login, CreateOrder, Orders, Dashboard
│   ├── utils/                api.js, helpers
│   ├── constants/            garment prices, statuses
│   └── styles/               globals.css (design tokens)

freshpress-backend/           ← Express API
├── src/
│   ├── config/db.js          Mongoose connection
│   ├── controllers/          authController, ordersController
│   ├── middleware/           auth (JWT + roles), errorHandler
│   ├── models/               User (bcrypt), Order (indexed)
│   ├── routes/               /api/auth, /api/orders
│   └── server.js
└── seed.js                   Demo users + sample orders
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
