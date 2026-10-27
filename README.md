# 📚 FSD Assignments — Full Stack Development

> **Student:** Prathapa Giri Sai Sathwik  
> **Course:** Full Stack Development  
> **GitHub:** [@sai130275](https://github.com/sai130275)

---

## 📂 Repository Structure

```
FSD-Assignments/
├── FSD-assignment-1/          # Node.js & MongoDB Fundamentals
│   ├── Question-1/            # Express Student Form (no DB)
│   ├── Question-2/            # Student CRUD with MongoDB + File Upload
│   └── Question-3/            # MongoDB Shell Methods (Reference Doc)
│
└── FSD-assignment-2/          # Full-Stack Restaurant Application
    ├── backend/               # Node.js + Express REST API
    ├── frontend/              # Angular 17 SPA
    ├── startup.sh             # One-command startup script
    └── README.md
```

---

## 📖 Assignments

### [Assignment 1](./FSD-assignment-1) — Node.js & MongoDB Fundamentals

Exploring core Node.js server concepts, Express routing, MongoDB integration, and file uploads.

| Question | Description | Stack |
|----------|-------------|-------|
| [Q1](./FSD-assignment-1/Question-1) | Student Details Form — GET/POST with Express | Node.js, Express |
| [Q2](./FSD-assignment-1/Question-2) | Student CRUD — Create, Read, Update, Delete with photo upload | Node.js, Express, MongoDB, Multer |
| [Q3](./FSD-assignment-1/Question-3) | MongoDB Shell — All CRUD methods reference document | MongoDB Shell |

#### Quick Start — Assignment 1

```bash
# Question 1 (Simple Express Form)
cd FSD-assignment-1/Question-1
npm install
node server.js
# → http://localhost:3000

# Question 2 (Full CRUD + MongoDB)
cd FSD-assignment-1/Question-2
npm install
# Make sure MongoDB is running first!
node server.js
# → http://localhost:3000
```

---

### [Assignment 2](./FSD-assignment-2) — Restaurant Ordering & Table Booking System

A complete full-stack web application with a REST API backend and Angular 17 frontend.

**Features:** Menu Management · Order Placement · Table Booking · Ratings & Feedback · Input Validation · CORS

| Layer | Tech |
|-------|------|
| Frontend | Angular 17, TypeScript, RxJS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Tooling | nodemon, Angular CLI, dotenv |

#### Quick Start — Assignment 2

```bash
cd FSD-assignment-2

# One-command startup (recommended)
chmod +x startup.sh
./startup.sh

# Manual startup
# Terminal 1 — Backend
cd backend && npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm start
```

> 🌐 **Frontend:** http://localhost:4200  
> 🔌 **API:** http://localhost:3000  
> ❤️ **Health:** http://localhost:3000/api/health

---

## 🛠️ Prerequisites

```bash
# Required for all assignments
node -v   # >= 18.x
npm -v    # >= 9.x
mongod    # MongoDB running locally

# Required for Assignment 2 frontend
npm install -g @angular/cli@17
```

---

## 📜 License

Academic assignment — not for redistribution.
