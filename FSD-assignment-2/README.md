# 🍽️ FSD Assignment 2 — Restaurant Ordering & Table Booking System

A full-stack web application for managing restaurant operations, built with **Angular 17** (frontend) and **Node.js + Express + MongoDB** (backend).

---

## 📁 Project Structure

```
FSD-assignment-2/
├── backend/                  # Node.js REST API
│   ├── src/
│   │   ├── config/           # Database configuration
│   │   ├── controllers/      # Route controllers
│   │   ├── middleware/       # Error handling middleware
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API route definitions
│   │   └── server.js         # Express app entry point
│   ├── scripts/
│   │   └── seed.js           # Database seeder
│   ├── .env.example          # Environment variables template
│   └── package.json
└── frontend/                 # Angular 17 SPA
    ├── src/
    │   ├── app/              # Components, services, modules
    │   └── environments/     # Environment configs
    ├── angular.json
    └── package.json
```

---

## ⚙️ Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Node.js | ≥ 18.x | [nodejs.org](https://nodejs.org) |
| npm | ≥ 9.x | Bundled with Node |
| MongoDB | ≥ 6.x | [mongodb.com](https://www.mongodb.com/try/download/community) |
| Angular CLI | 17.x | `npm install -g @angular/cli@17` |

---

## 🚀 Quick Start

### 1. Clone & Navigate

```bash
git clone https://github.com/sai130275/FSD-Assignments.git
cd FSD-Assignments/FSD-assignment-2
```

### 2. Start MongoDB

```bash
# macOS / Linux
mongod --dbpath /data/db

# Or if installed as a service
brew services start mongodb-community   # macOS
sudo systemctl start mongod             # Linux
```

### 3. Setup & Start Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env if needed (default: PORT=3000, MongoDB at localhost:27017)

# (Optional) Seed sample data
npm run seed

# Start development server
npm run dev
```

> Backend runs at **http://localhost:3000**

### 4. Setup & Start Frontend

Open a **new terminal** in `FSD-assignment-2/`:

```bash
cd frontend

# Install dependencies
npm install

# Start Angular dev server
npm start
```

> Frontend runs at **http://localhost:4200**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET/POST | `/api/menu` | Menu items |
| GET/POST | `/api/orders` | Orders |
| GET/POST/PATCH | `/api/bookings` | Table bookings |
| GET/POST | `/api/ratings` | Ratings |
| GET/POST | `/api/feedback` | Customer feedback |

---

## 🔧 Environment Variables (`.env`)

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/restaurant_db
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

---

## 🛠️ Tech Stack

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose ODM
- express-validator, cors, dotenv

**Frontend**
- Angular 17 (Standalone components)
- Angular Router, Reactive Forms
- RxJS, Angular SSR

---

## 📜 Available Scripts

### Backend (`/backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start with nodemon (auto-reload) |
| `npm start` | Start production server |
| `npm run seed` | Seed database with sample data |

### Frontend (`/frontend`)

| Command | Description |
|---------|-------------|
| `npm start` | Serve at localhost:4200 |
| `npm run build` | Build for production |
| `npm test` | Run unit tests |

---

## 🧩 Features

- 🍕 **Menu Management** — Browse and filter restaurant menu
- 📋 **Order Placement** — Create and track food orders
- 📅 **Table Booking** — Reserve tables with date/time selection
- ⭐ **Ratings & Feedback** — Submit and view customer ratings
- ✅ **Input Validation** — Server-side validation on all endpoints
- 🔒 **CORS Protected** — Configurable allowed origins

---

## 🐞 Troubleshooting

**MongoDB connection refused**
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand({ ping: 1 })"
# Start it if not running
brew services start mongodb-community  # macOS
```

**Angular CLI not found**
```bash
npm install -g @angular/cli@17
```

**Port already in use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
# Kill process on port 4200
lsof -ti:4200 | xargs kill -9
```

---

## 👤 Author

**Prathapa Giri Sai Sathwik**  
Full Stack Development — Assignment 2
