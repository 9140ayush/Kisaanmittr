# Kisaanmittr AI Product - Phase 1 (MVP)

A web application that allows users to generate structured reports by combining AI-generated, manual, or file-uploaded content into a final compiled PDF report.

## Tech Stack

- **Frontend:** Next.js 14 + TypeScript + Tailwind CSS
- **State Management:** Zustand
- **Backend:** Node.js + Express
- **Database & Auth:** Supabase
- **AI Integration:** OpenAI API (GPT-4)
- **PDF Generation:** pdf-lib
- **File Parsing:** pdf-parse, mammoth, xlsx

## Setup Instructions

### 1. Install Dependencies

```bash
npm run install:all
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for backend)
- `OPENAI_API_KEY` - Your OpenAI API key
- `BACKEND_URL` - Backend server URL (default: http://localhost:3001)
- `NEXT_PUBLIC_BACKEND_URL` - Backend URL for frontend (default: http://localhost:3001)

### 3. Database Setup

Run the SQL scripts in `backend/database/schema.sql` in your Supabase SQL editor to create the required tables.

### 4. Run Development Servers

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001

## Project Structure

```
kisaanmittr/
├── frontend/           # Next.js application
│   ├── app/           # Next.js app router
│   ├── components/    # React components
│   ├── lib/           # Utilities and services
│   ├── store/         # Zustand stores
│   └── types/         # TypeScript types
├── backend/           # Express server
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── middleware/    # Express middleware
│   └── database/      # Database schema
└── README.md
```

## Features

1. **Report Items Selection** - Select, add, and save report templates
2. **Content Creation** - Three input modes: AI generation, file upload, manual entry
3. **Real-Time PDF Compilation** - Live preview with dynamic PDF generation
4. **Auto-save** - Draft content is automatically saved

## Development Timeline

- Report Items Selection: 3 days
- Content Creation Workflow: 7 days
- Real-time PDF Compilation: 5 days
- UI/UX & Infra Setup: 4 days

Total: ~20 working days

