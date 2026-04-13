#!/bin/bash

echo "========================================"
echo "  MedGenius AI - Development Startup"
echo "========================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "[INFO] Node.js version:"
node --version
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed!"
    exit 1
fi

echo "[INFO] npm version:"
npm --version
echo ""

echo "========================================"
echo "  Step 1: Installing Dependencies"
echo "========================================"
echo ""

# Install backend dependencies
echo "[1/2] Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend packages..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Backend dependency installation failed!"
        cd ..
        exit 1
    fi
else
    echo "Backend dependencies already installed."
fi
cd ..

# Install frontend dependencies
echo "[2/2] Installing frontend dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing frontend packages..."
    npm install
    if [ $? -ne 0 ]; then
        echo "[ERROR] Frontend dependency installation failed!"
        exit 1
    fi
else
    echo "Frontend dependencies already installed."
fi

echo ""
echo "========================================"
echo "  Step 2: Starting Services"
echo "========================================"
echo ""

echo "[INFO] Starting Backend Server (Port 5000)..."
echo "[INFO] Starting Frontend Dev Server (Port 5173)..."
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping all services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start backend
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Start frontend
npm run dev &
FRONTEND_PID=$!

echo ""
echo "========================================"
echo "  Services Started Successfully!"
echo "========================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait
