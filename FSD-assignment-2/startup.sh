#!/usr/bin/env bash
# =============================================================
#  startup.sh — Restaurant App (FSD Assignment 2)
#  Starts MongoDB, the Express backend, and the Angular frontend
#  Usage: chmod +x startup.sh && ./startup.sh
# =============================================================

set -e

# ─── Colour helpers ───────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
RESET='\033[0m'

info()    { echo -e "${CYAN}[INFO]${RESET}  $*"; }
success() { echo -e "${GREEN}[OK]${RESET}    $*"; }
warn()    { echo -e "${YELLOW}[WARN]${RESET}  $*"; }
error()   { echo -e "${RED}[ERROR]${RESET} $*"; exit 1; }

# ─── Banner ───────────────────────────────────────────────────
echo ""
echo -e "${BOLD}${CYAN}"
echo "  ██████╗ ███████╗███████╗████████╗ █████╗ ██╗   ██╗██████╗  █████╗ ███╗   ██╗████████╗"
echo "  ██╔══██╗██╔════╝██╔════╝╚══██╔══╝██╔══██╗██║   ██║██╔══██╗██╔══██╗████╗  ██║╚══██╔══╝"
echo "  ██████╔╝█████╗  ███████╗   ██║   ███████║██║   ██║██████╔╝███████║██╔██╗ ██║   ██║   "
echo "  ██╔══██╗██╔══╝  ╚════██║   ██║   ██╔══██║██║   ██║██╔══██╗██╔══██║██║╚██╗██║   ██║   "
echo "  ██║  ██║███████╗███████║   ██║   ██║  ██║╚██████╔╝██║  ██║██║  ██║██║ ╚████║   ██║   "
echo "  ╚═╝  ╚═╝╚══════╝╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   "
echo -e "${RESET}"
echo -e "  ${BOLD}🍽️  FSD Assignment 2 — Restaurant Ordering & Booking System${RESET}"
echo -e "  ${YELLOW}─────────────────────────────────────────────────────────────${RESET}"
echo ""

# ─── Resolve script directory ─────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

# ─── Step 1: Check prerequisites ──────────────────────────────
info "Checking prerequisites..."

command -v node >/dev/null 2>&1  || error "Node.js not found. Install from https://nodejs.org"
command -v npm  >/dev/null 2>&1  || error "npm not found. Install Node.js from https://nodejs.org"

NODE_VER=$(node -v | sed 's/v//')
NPM_VER=$(npm -v)
success "Node.js v${NODE_VER}  |  npm v${NPM_VER}"

# Check Angular CLI
if ! command -v ng >/dev/null 2>&1; then
    warn "Angular CLI not found globally. Installing..."
    npm install -g @angular/cli@17
fi
NG_VER=$(ng version 2>/dev/null | grep "Angular CLI" | awk '{print $NF}')
success "Angular CLI ${NG_VER}"

# ─── Step 2: Start MongoDB ─────────────────────────────────────
info "Checking MongoDB..."

if command -v brew >/dev/null 2>&1 && brew services list 2>/dev/null | grep -q "mongodb-community"; then
    if brew services list | grep "mongodb-community" | grep -q "started"; then
        success "MongoDB is already running (brew service)"
    else
        info "Starting MongoDB via Homebrew..."
        brew services start mongodb-community
        sleep 2
        success "MongoDB started"
    fi
elif command -v systemctl >/dev/null 2>&1; then
    if systemctl is-active --quiet mongod 2>/dev/null; then
        success "MongoDB is already running (systemd)"
    else
        info "Starting MongoDB via systemctl..."
        sudo systemctl start mongod
        sleep 2
        success "MongoDB started"
    fi
elif command -v mongod >/dev/null 2>&1; then
    if mongosh --eval "db.adminCommand({ ping: 1 })" --quiet >/dev/null 2>&1; then
        success "MongoDB is already running"
    else
        warn "Attempting to start mongod in background..."
        mkdir -p /tmp/mongodb-data
        mongod --dbpath /tmp/mongodb-data --fork --logpath /tmp/mongod.log
        sleep 2
        success "MongoDB started (data: /tmp/mongodb-data)"
    fi
else
    warn "mongod not found. Make sure MongoDB is running manually on port 27017."
fi

# ─── Step 3: Backend setup ────────────────────────────────────
echo ""
echo -e "${BOLD}  ⚙️  Setting up Backend${RESET}"
echo -e "  ${YELLOW}────────────────────────────────${RESET}"

if [ ! -d "$BACKEND_DIR/node_modules" ]; then
    info "Installing backend dependencies..."
    (cd "$BACKEND_DIR" && npm install)
    success "Backend dependencies installed"
else
    success "Backend node_modules already present"
fi

# Copy .env if it doesn't exist
if [ ! -f "$BACKEND_DIR/.env" ]; then
    info "Creating .env from .env.example..."
    cp "$BACKEND_DIR/.env.example" "$BACKEND_DIR/.env"
    success ".env created  →  edit $BACKEND_DIR/.env if needed"
else
    success ".env already exists"
fi

# ─── Step 4: Frontend setup ───────────────────────────────────
echo ""
echo -e "${BOLD}  🎨 Setting up Frontend${RESET}"
echo -e "  ${YELLOW}────────────────────────────────${RESET}"

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    info "Installing frontend dependencies..."
    (cd "$FRONTEND_DIR" && npm install)
    success "Frontend dependencies installed"
else
    success "Frontend node_modules already present"
fi

# ─── Step 5: Launch services ──────────────────────────────────
echo ""
echo -e "${BOLD}  🚀 Launching Services${RESET}"
echo -e "  ${YELLOW}────────────────────────────────${RESET}"

# Start backend in background
info "Starting Express backend on port 3000..."
(cd "$BACKEND_DIR" && npm run dev > /tmp/restaurant-backend.log 2>&1) &
BACKEND_PID=$!
sleep 3

if kill -0 "$BACKEND_PID" 2>/dev/null; then
    success "Backend running  →  http://localhost:3000  (PID: $BACKEND_PID)"
    success "Health check     →  http://localhost:3000/api/health"
else
    error "Backend failed to start. Check /tmp/restaurant-backend.log"
fi

# Start frontend in background
info "Starting Angular frontend on port 4200..."
(cd "$FRONTEND_DIR" && npm start > /tmp/restaurant-frontend.log 2>&1) &
FRONTEND_PID=$!
sleep 5

if kill -0 "$FRONTEND_PID" 2>/dev/null; then
    success "Frontend running  →  http://localhost:4200  (PID: $FRONTEND_PID)"
else
    error "Frontend failed to start. Check /tmp/restaurant-frontend.log"
fi

# ─── Step 6: Summary ──────────────────────────────────────────
echo ""
echo -e "  ${YELLOW}═══════════════════════════════════════════════════════════${RESET}"
echo -e "  ${BOLD}${GREEN}  ✅  All services are running!${RESET}"
echo -e "  ${YELLOW}═══════════════════════════════════════════════════════════${RESET}"
echo ""
echo -e "   ${BOLD}🌐 App:${RESET}       http://localhost:4200"
echo -e "   ${BOLD}🔌 API:${RESET}       http://localhost:3000"
echo -e "   ${BOLD}❤️  Health:${RESET}   http://localhost:3000/api/health"
echo ""
echo -e "   ${BOLD}📄 Logs:${RESET}"
echo -e "       Backend  →  /tmp/restaurant-backend.log"
echo -e "       Frontend →  /tmp/restaurant-frontend.log"
echo ""
echo -e "   ${BOLD}🛑 To stop all services:${RESET}"
echo -e "       kill $BACKEND_PID $FRONTEND_PID"
echo ""
echo -e "  ${YELLOW}═══════════════════════════════════════════════════════════${RESET}"
echo ""

# ─── Wait (keep script alive so Ctrl+C stops everything) ──────
wait
