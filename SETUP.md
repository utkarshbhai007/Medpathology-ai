# MedGenius AI - Setup Guide

## Quick Start

### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- npm (comes with Node.js)
- MongoDB Atlas account (already configured in `.env`)

### Option 1: Automated Setup (Recommended)

#### Windows
```bash
start-dev.bat
```

#### Linux/Mac
```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Manual Setup

#### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd ..
npm install
```

#### 2. Start Services

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Health Check:** http://localhost:5000/api/health

## Database Configuration

The project uses **MongoDB Atlas** (cloud database) - no local MongoDB installation needed!

Current configuration in `backend/.env`:
```

```

### Troubleshooting Database Connection

If you see MongoDB connection errors:

1. **Check MongoDB Atlas Cluster Status**
   - Login to [MongoDB Atlas](https://cloud.mongodb.com/)
   - Ensure cluster is not paused
   - Cluster should be in "Active" state

2. **Verify Network Access**
   - Go to Network Access in MongoDB Atlas
   - Ensure `0.0.0.0/0` is whitelisted (allows all IPs)
   - Or add your current IP address

3. **Verify Database User**
   - Go to Database Access in MongoDB Atlas
   - Username: Check your MongoDB Atlas dashboard
   - Password: Use your MongoDB Atlas password
   - Ensure user has read/write permissions

4. **Test Connection**
   ```bash
   cd backend
   node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => console.log('✅ Connected')).catch(err => console.error('❌ Error:', err.message));"
   ```

## Environment Variables

### Backend (.env in backend folder)
```env
MONGODB_URI=your_mongodb_connection_string_here
JWT_SECRET=your_secure_jwt_secret_here
PORT=5000
GROQ_API_KEY=your_groq_api_key_here
```

### Frontend (.env in root folder)
```env
VITE_GROQ_API_URL=https://api.groq.com/openai/v1/chat/completions
VITE_GROQ_API_KEY=your_groq_api_key_here
```

**Note**: Get your Groq API key from https://console.groq.com/keys
VITE_GROQ_API_KEY=

```

## Common Issues

### Port Already in Use

**Backend (Port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

**Frontend (Port 5173):**
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5173 | xargs kill -9
```

### Module Not Found Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# For backend
cd backend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
The backend is configured to allow:
- http://localhost:5173 (Vite default)
- http://localhost:3000 (React default)
- http://localhost:8080-8083

If using a different port, update `backend/src/index.js`:
```javascript
const allowedOrigins = [
  'http://localhost:YOUR_PORT',
  // ... other origins
];
```

## Development Workflow

1. **Start both servers** using the automated script
2. **Frontend** will auto-reload on file changes
3. **Backend** uses nodemon for auto-restart
4. **Check logs** in respective terminal windows

## API Testing

Test backend health:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Backend is running",
  "timestamp": "2026-04-13T..."
}
```

## Production Build

```bash
# Build frontend
npm run build

# Preview production build
npm run preview
```

## Need Help?

- Check terminal logs for detailed error messages
- Ensure all environment variables are set correctly
- Verify MongoDB Atlas cluster is active
- Check firewall/antivirus isn't blocking ports 5000 or 5173
