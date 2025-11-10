# Project Structure

```
kisaanmittr/
├── frontend/                    # Next.js 14 Application
│   ├── app/                    # Next.js App Router
│   │   ├── content-creation/   # Content creation workflow page
│   │   ├── select-items/       # Report items selection page
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page (redirects)
│   ├── components/             # Reusable React components
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── ProgressTracker.tsx # Progress indicator
│   │   ├── ContentEditor.tsx   # Rich text editor (Quill)
│   │   └── FileUpload.tsx      # File upload component
│   ├── lib/                    # Utilities and services
│   │   ├── api.ts              # API client functions
│   │   └── supabase.ts         # Supabase client
│   ├── store/                  # Zustand state management
│   │   └── reportStore.ts      # Main application store
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts            # Shared types
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── next.config.js
│
├── backend/                    # Express.js Server
│   ├── routes/                 # API route handlers
│   │   ├── generate.js         # AI content generation
│   │   ├── upload.js           # File upload & parsing
│   │   ├── draft.js            # Draft save/load
│   │   └── compile.js           # PDF compilation
│   ├── database/               # Database schema
│   │   └── schema.sql          # Supabase table definitions
│   ├── uploads/                # Temporary file storage
│   ├── server.js               # Express server entry point
│   └── package.json
│
├── .env.example                # Environment variables template
├── .gitignore
├── package.json                 # Root package.json (runs both servers)
├── README.md                    # Project overview
├── SETUP.md                     # Detailed setup instructions
└── PROJECT_STRUCTURE.md         # This file
```

## Key Features by File

### Frontend

**Pages:**
- `app/select-items/page.tsx` - Report items selection with template management
- `app/content-creation/page.tsx` - Main content creation workflow with AI/File/Manual modes

**Components:**
- `Navbar.tsx` - Top navigation bar
- `ProgressTracker.tsx` - Visual progress indicator
- `ContentEditor.tsx` - Rich text editor using React Quill
- `FileUpload.tsx` - Drag-and-drop file upload with validation

**State Management:**
- `store/reportStore.ts` - Zustand store with persistence for:
  - Report items selection
  - Saved templates
  - Content sections
  - Current section index

**API Client:**
- `lib/api.ts` - Functions for:
  - AI content generation
  - File upload
  - Draft saving
  - PDF compilation

### Backend

**Routes:**
- `routes/generate.js` - OpenAI API integration for content generation
- `routes/upload.js` - File parsing (PDF, DOCX, XLSX) using pdf-parse, mammoth, xlsx
- `routes/draft.js` - Save/load drafts from Supabase
- `routes/compile.js` - PDF generation using pdf-lib

**Database:**
- `database/schema.sql` - Three tables:
  - `report_templates` - Saved report templates
  - `report_drafts` - Section drafts
  - `final_reports` - Generated reports metadata

## Data Flow

1. **Selection Phase:**
   - User selects report items → Stored in Zustand → Can save as template

2. **Content Creation Phase:**
   - For each section:
     - User chooses input mode (AI/File/Manual)
     - Content is generated/uploaded/typed
     - Auto-saved to Zustand and Supabase
     - Marked as complete

3. **PDF Compilation:**
   - All completed sections sent to backend
   - Backend generates PDF with pdf-lib
   - Returns base64 PDF → Frontend downloads

## Technology Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **State:** Zustand with persistence
- **Backend:** Node.js, Express.js
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o-mini
- **PDF:** pdf-lib
- **File Parsing:** pdf-parse, mammoth, xlsx
- **Rich Text:** React Quill

