# 🚀 How to Start the Application

**FSD Assignment 2 — Restaurant Ordering & Table Booking System**

---

## ✅ Before You Start (One-time Setup)

Make sure these are installed on your machine:

| Tool | Check Command | Download |
|------|--------------|---------|
| Node.js (v18+) | `node -v` | https://nodejs.org |
| MongoDB | `mongod --version` | https://www.mongodb.com/try/download/community |
| Angular CLI | `ng version` | `npm install -g @angular/cli@17` |

---

## ▶️ Starting the App

### Step 1 — Open Terminal and navigate to the project

```bash
cd FSD-assignment-2
```

### Step 2 — Start MongoDB (run in background, keep it running)

```bash
mkdir -p /tmp/mongodb-data
nohup mongod --dbpath /tmp/mongodb-data --logpath /tmp/mongod.log &
```

> ⏳ Wait 3–4 seconds for MongoDB to start.

### Step 3 — Seed the menu data (first time only)

```bash
cd backend
npm install
npm run seed
cd ..
```

> ✅ This adds 21 menu items (Starters, Mains, Desserts, Beverages, etc.) to the database.  
> You only need to do this **once**. If you run it again, it skips items already added.

### Step 4 — Start the Backend API

Open a **new terminal window** and run:

```bash
cd FSD-assignment-2/backend
npm run dev
```

> ✅ Backend is ready when you see:  
> `🍽️  Restaurant API running on http://localhost:3000`

### Step 5 — Start the Frontend

Open **another new terminal window** and run:

```bash
cd FSD-assignment-2/frontend
npm install
npm start
```

> ✅ Frontend is ready when you see:  
> `✔ Compiled successfully`  
> Then open **http://localhost:4200** in your browser.

---

## 🌐 App URLs

| What | URL |
|------|-----|
| 🌐 Website (Frontend) | http://localhost:4200 |
| 🔌 API (Backend) | http://localhost:3000 |
| ❤️ API Health Check | http://localhost:3000/api/health |

---

## 🛑 Stopping the App

Run this in any terminal:

```bash
lsof -ti:3000 | xargs kill -9    # stop backend
lsof -ti:4200 | xargs kill -9    # stop frontend
pkill mongod                      # stop MongoDB
```

---

## ⚡ Quick Start (Alternative — One Command)

Instead of Steps 2–5 above, you can use the startup script:

```bash
cd FSD-assignment-2
chmod +x startup.sh
./startup.sh
```

> ⚠️ **Note:** The startup script does NOT seed the menu.  
> Run `npm run seed` inside the `backend/` folder separately (Step 3 above) the first time.

---

## 🐞 Common Problems & Fixes

**Problem: "MongoDB connection refused"**
```bash
# MongoDB is not running. Start it:
nohup mongod --dbpath /tmp/mongodb-data --logpath /tmp/mongod.log &
```

**Problem: "Port 3000 already in use"**
```bash
lsof -ti:3000 | xargs kill -9
```

**Problem: "Port 4200 already in use"**
```bash
lsof -ti:4200 | xargs kill -9
```

**Problem: "ng: command not found"**
```bash
npm install -g @angular/cli@17
```

**Problem: Menu is empty in the app**
```bash
cd backend
npm run seed
```

---

## 📋 Summary Checklist

- [ ] MongoDB is running (`nohup mongod ...`)
- [ ] Backend is running (`npm run dev` in `backend/`)
- [ ] Menu is seeded (`npm run seed` in `backend/` — first time only)
- [ ] Frontend is running (`npm start` in `frontend/`)
- [ ] Open http://localhost:4200 in your browser
