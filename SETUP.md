# Kisaanmittr Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier works)
- OpenAI API key

## Step-by-Step Setup

### 1. Install Dependencies

```bash
npm run install:all
```

This will install dependencies for:
- Root project (concurrently for running both servers)
- Frontend (Next.js app)
- Backend (Express server)

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Once your project is ready, go to **SQL Editor**
3. Copy and paste the contents of `backend/database/schema.sql` and run it
4. Go to **Settings** → **API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 3. Get OpenAI API Key

1. Go to [platform.openai.com](https://platform.openai.com)
2. Navigate to **API Keys**
3. Create a new secret key
4. Copy it → `OPENAI_API_KEY`

### 4. Configure Environment Variables

**Create two `.env` files:**

#### Root `.env` file (for frontend):
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend Server URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

#### Backend `.env` file (for backend server):
**Important:** Create this file in the `backend/` directory (not root)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
# OR use SUPABASE_URL (both work)
SUPABASE_URL=your_supabase_project_url

# Supabase Service Role Key (required for backend)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Server Port
PORT=3001
```

**Key Points:**
- Backend uses `SUPABASE_SERVICE_ROLE_KEY` (not anon key) for database operations
- Backend reads from `backend/.env` file specifically
- Frontend uses `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side operations

### 5. Create Uploads Directory

The backend needs an uploads directory for temporary file processing:

```bash
mkdir backend/uploads
```

### 6. Run the Application

Start both frontend and backend servers:

```bash
npm run dev
```

This will start:
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001

### 7. Test the Application

1. Open http://localhost:3000 in your browser
2. You should be redirected to the Report Items Selection page
3. Select some items and click "Continue"
4. Try creating content using AI, file upload, or manual entry
5. Complete sections and download the final PDF

## Troubleshooting

### Backend won't start

- Check that port 3001 is not in use
- Verify `.env` file exists in `backend/` directory
- Check that all dependencies are installed: `cd backend && npm install`

### Frontend won't start

- Check that port 3000 is not in use
- Verify `.env` file exists in root directory
- Check that all dependencies are installed: `cd frontend && npm install`

### OpenAI API errors

- Verify your API key is correct
- Check your OpenAI account has credits
- Ensure you're using a valid model (gpt-4o-mini is used by default)

### Supabase connection errors

- Verify your Supabase URL and keys are correct
- Check that the database schema was created successfully
- Ensure your Supabase project is active

### File upload errors

- Check that `backend/uploads` directory exists
- Verify file size is under 10MB
- Ensure file type is supported (PDF, DOCX, XLSX)

## Development Notes

- The app uses localStorage for state persistence (via Zustand)
- User authentication is not implemented in Phase 1 (uses placeholder 'current-user')
- File uploads are temporarily stored and deleted after processing
- PDF compilation happens on-demand when user clicks download

## Next Steps (Future Phases)

- Add user authentication with Supabase Auth
- Implement real-time collaboration
- Add report sharing features
- Enhance PDF templates and styling
- Add more file format support
- Implement report versioning

