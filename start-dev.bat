@echo off
echo ========================================
echo   MedGenius AI - Development Startup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js version:
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

echo [INFO] npm version:
npm --version
echo.

echo ========================================
echo   Step 1: Installing Dependencies
echo ========================================
echo.

REM Install backend dependencies
echo [1/2] Installing backend dependencies...
cd backend
if not exist "node_modules" (
    echo Installing backend packages...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Backend dependency installation failed!
        cd ..
        pause
        exit /b 1
    )
) else (
    echo Backend dependencies already installed.
)
cd ..

REM Install frontend dependencies
echo [2/2] Installing frontend dependencies...
if not exist "node_modules" (
    echo Installing frontend packages...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Frontend dependency installation failed!
        pause
        exit /b 1
    )
) else (
    echo Frontend dependencies already installed.
)

echo.
echo ========================================
echo   Step 2: Starting Services
echo ========================================
echo.

echo [INFO] Starting Backend Server (Port 5000)...
echo [INFO] Starting Frontend Dev Server (Port 5173)...
echo.
echo Press Ctrl+C to stop all services
echo.

REM Start both services in new windows
start "MedGenius Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul
start "MedGenius Frontend" cmd /k "npm run dev"

echo.
echo ========================================
echo   Services Started Successfully!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Check the new terminal windows for logs.
echo Close this window or press any key to exit.
echo.
pause
