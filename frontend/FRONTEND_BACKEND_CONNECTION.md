# Frontend-Backend Connection Guide

## Overview

The frontend Next.js application is now connected to the backend Express server. All API routes in the frontend (`/app/api/*`) act as proxies to the backend server.

## Architecture

```
Frontend (Next.js)          Backend (Express)
┌─────────────────┐        ┌──────────────────┐
│  /api/generate  │ ────→  │  /api/generate   │
│  /api/extract   │ ────→  │  /api/upload     │
│  /api/compile   │ ────→  │  /api/compile    │
└─────────────────┘        └──────────────────┘
```

## Environment Configuration

### Frontend `.env` file

Create a `.env.local` file in the `frontend/` directory:

```env
# Backend Server URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Or set it in your environment variables.

## API Routes

### 1. `/api/generate` (AI Content Generation)

**Frontend Route:** `frontend/app/api/generate/route.ts`
**Backend Endpoint:** `http://localhost:3001/api/generate`

**Request:**
```json
{
  "prompt": "Generate soil health report"
}
```

**Response:**
```json
{
  "success": true,
  "content": "Generated content...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 2. `/api/extract` (File Upload & Extraction)

**Frontend Route:** `frontend/app/api/extract/route.ts`
**Backend Endpoint:** `http://localhost:3001/api/upload`

**Request:**
- FormData with `file` field

**Response:**
```json
{
  "success": true,
  "content": "Extracted text...",
  "fileName": "document.pdf",
  "fileSize": 12345,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 3. `/api/compile` (PDF Compilation)

**Frontend Route:** `frontend/app/api/compile/route.ts`
**Backend Endpoint:** `http://localhost:3001/api/compile`

**Request:**
```json
{
  "sections": [
    {
      "name": "Crop Overview",
      "content": "Section content...",
      "id": "crop-overview"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Report compiled successfully",
  "pdfBase64": "base64-encoded-pdf...",
  "downloadUrl": "data:application/pdf;base64,...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install --legacy-peer-deps
```

### 2. Configure Environment

Create `frontend/.env.local`:
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

### 3. Start Backend Server

```bash
cd backend
npm run dev
```

The backend should be running on `http://localhost:3001`

### 4. Start Frontend Server

```bash
cd frontend
npm run dev
```

The frontend should be running on `http://localhost:3000`

## Testing the Connection

### 1. Test Backend Health

```bash
curl http://localhost:3001/health
```

### 2. Test Frontend API Route

```bash
curl http://localhost:3000/api/generate -X POST -H "Content-Type: application/json" -d '{"prompt":"test"}'
```

### 3. Test from Frontend UI

1. Navigate to `http://localhost:3000`
2. Select report items
3. Try generating AI content
4. Try uploading a file
5. Try compiling a PDF

## Troubleshooting

### Backend Connection Errors

**Error:** `Failed to fetch` or `Backend request failed`

**Solutions:**
1. Ensure backend is running on port 3001
2. Check `NEXT_PUBLIC_BACKEND_URL` is set correctly
3. Verify CORS is enabled in backend (should be automatic)
4. Check backend logs for errors

### File Upload Issues

**Error:** `Failed to extract content from file`

**Solutions:**
1. Ensure `form-data` package is installed
2. Check file size (max 10MB)
3. Verify file type is supported (PDF, DOCX, XLSX)
4. Check backend uploads directory exists

### PDF Compilation Issues

**Error:** `Failed to compile report`

**Solutions:**
1. Ensure all sections have content
2. Check backend PDF generation is working
3. Verify Supabase connection (for draft saving)
4. Check backend logs for errors

## Dependencies

### Frontend Dependencies Added

- `form-data` - For file upload forwarding to backend

### Backend Dependencies (Already Installed)

- `express` - Web server
- `multer` - File upload handling
- `pdf-parse` - PDF text extraction
- `mammoth` - DOCX text extraction
- `xlsx` - Excel text extraction
- `pdf-lib` - PDF generation
- `openai` - AI content generation
- `@supabase/supabase-js` - Database

## Next Steps

1. ✅ Frontend API routes proxy to backend
2. ✅ File upload forwarding works
3. ✅ PDF compilation works
4. ✅ AI generation works
5. 🔄 Add authentication (future)
6. 🔄 Add error monitoring (future)
7. 🔄 Add rate limiting (future)

## Status

✅ **Frontend and Backend are connected and working!**

All API routes are properly proxying to the backend Express server. The application is ready for end-to-end testing.

