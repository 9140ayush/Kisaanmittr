# Backend Setup & Connection Verification

## ✅ Backend Configuration Checklist

### 1. Environment Variables

Ensure `backend/.env` file exists with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
# OR
SUPABASE_URL=https://your-project-id.supabase.co

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI Configuration (optional for AI features)
OPENAI_API_KEY=sk-your_openai_api_key_here

# Server Configuration
PORT=3001
```

**Important Notes:**
- The backend reads from `backend/.env` (not root `.env`)
- Use `SUPABASE_SERVICE_ROLE_KEY` (not the anon key) for backend operations
- The backend supports both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL` for flexibility

### 2. Verify Backend Server Starts

Run the backend server:

```bash
cd backend
npm run dev
```

**Expected Output:**
```
🚀 Backend server running on http://localhost:3001
📡 CORS enabled for: http://localhost:3000
✅ Backend connected to Supabase successfully
```

**If you see errors:**
- ❌ `SUPABASE_URL is not set` → Add Supabase URL to `backend/.env`
- ❌ `SUPABASE_SERVICE_ROLE_KEY is not set` → Add service role key to `backend/.env`
- ⚠️ `Supabase connection warning` → Normal if tables don't exist yet (run schema.sql)

### 3. Test Backend Endpoints

#### Health Check
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "Kisaanmittr API is running",
  "supabase": "configured"
}
```

#### API Test
```bash
curl http://localhost:3001/api/test
```

Expected response:
```json
{
  "success": true,
  "message": "Backend API is working",
  "supabase": "connected"
}
```

### 4. Verify Frontend Connection

The frontend automatically tests the connection. Look for the connection status indicator in the navbar:
- ✅ Green checkmark = Connected
- ❌ Red X = Disconnected
- 🔄 Spinner = Checking

### 5. Database Setup

If you see "tables may not exist yet" message:

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `backend/database/schema.sql`
4. Run the SQL script
5. Restart the backend server

### 6. CORS Configuration

The backend is configured to allow requests from:
- `http://localhost:3000`
- `http://127.0.0.1:3000`
- Any URL set in `FRONTEND_URL` environment variable

For production, update the CORS configuration in `backend/server.js`.

## Troubleshooting

### Backend won't start

**Check:**
1. `backend/.env` file exists
2. All required environment variables are set
3. Port 3001 is not in use
4. Node.js version is 18+

**Solution:**
```bash
# Check if port is in use
netstat -ano | findstr :3001  # Windows
lsof -i :3001                  # Mac/Linux

# Verify .env file
cat backend/.env               # Mac/Linux
type backend\.env              # Windows
```

### Supabase Connection Fails

**Check:**
1. Supabase URL is correct (no trailing slash)
2. Service role key is correct (not anon key)
3. Supabase project is active
4. Network/firewall allows connection

**Test manually:**
```bash
# Test Supabase connection
node -e "const { createClient } = require('@supabase/supabase-js'); const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY); supabase.from('report_drafts').select('id').limit(1).then(console.log).catch(console.error);"
```

### Frontend can't connect to backend

**Check:**
1. Backend is running on port 3001
2. `NEXT_PUBLIC_BACKEND_URL` is set in root `.env`
3. CORS is enabled (should be automatic)
4. No browser console errors

**Test:**
```bash
# From frontend directory
curl http://localhost:3001/health
```

### API Routes Return 404

**Check:**
1. Routes are registered in `backend/server.js`
2. Route paths match frontend API calls
3. Server is restarted after changes

**Verify routes:**
- `/api/generate` - AI content generation
- `/api/upload` - File upload
- `/api/saveDraft` - Save drafts
- `/api/compile` - PDF compilation

## Success Indicators

When everything is working correctly, you should see:

1. ✅ Backend server starts without errors
2. ✅ "Backend connected to Supabase successfully" message
3. ✅ Health check returns 200 OK
4. ✅ Frontend shows green connection status
5. ✅ API calls from frontend succeed

## Next Steps

Once the backend is connected:
1. Test AI generation feature
2. Test file upload feature
3. Test draft saving
4. Test PDF compilation

All features should work end-to-end!


