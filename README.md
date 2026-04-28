# FreshPress — Laundry Order Management System

Full-stack laundry management: React (Vite) + Express + MongoDB + JWT auth.

## Project Structure

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

## Quick Start

### Frontend (demo mode — no backend needed)
```bash
cd freshpress && npm install && npm run dev
# http://localhost:5173
# admin / admin123   or   staff / staff123
```

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

#freshpress/.env available seperately on google drive-copy and paste!
```


## Features

| Feature | Detail |
|---------|--------|
| Auth | JWT login, bcrypt passwords, admin/staff roles |
| Create Order | Name, phone, garments, delivery date, notes, live bill preview |
| Search | By name / phone / order ID |
| Filter by garment | Dropdown — Shirt, Saree, Kurta… |
| Filter by delivery date | Date picker |
| Filter by status | Pill buttons |
| Status tracking | RECEIVED → PROCESSING → READY → DELIVERED |
| Dashboard | Revenue, counts, status bars, top garment, recent orders |

## API

```
POST   /api/auth/login
GET    /api/auth/me
GET    /api/orders?garment=Saree&estimatedDelivery=2025-05-03&status=READY
POST   /api/orders
PATCH  /api/orders/:id/status
PUT    /api/orders/:id          (admin)
DELETE /api/orders/:id          (admin)
GET    /api/orders/dashboard
```

## Tech Stack
React 18 · Vite · React Router v6 · CSS Modules · Context API
Node.js · Express · MongoDB · Mongoose · JWT · bcryptjs · express-validator
