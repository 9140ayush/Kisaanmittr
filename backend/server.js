import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';
import generateRoutes from './routes/generate.js';
import uploadRoutes from './routes/upload.js';
import draftRoutes from './routes/draft.js';
import compileRoutes from './routes/compile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Get Supabase URL - support both NEXT_PUBLIC_SUPABASE_URL and SUPABASE_URL
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validate environment variables
if (!supabaseUrl) {
  console.error('❌ Error: SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL is not set in .env file');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY is not set in .env file');
  process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CORS configuration - allow frontend domain
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Make supabase available to routes
app.locals.supabase = supabase;

// Test Supabase connection
async function testSupabaseConnection() {
  try {
    // Test connection by querying a table (this will fail gracefully if tables don't exist yet)
    const { error } = await supabase.from('report_drafts').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = table doesn't exist (expected on first run)
      console.warn('⚠️  Supabase connection warning:', error.message);
      console.log('   This is normal if database tables are not created yet.');
      console.log('   Run the SQL script in backend/database/schema.sql in Supabase SQL Editor.');
    } else {
      console.log('✅ Backend connected to Supabase successfully');
    }
  } catch (err) {
    console.warn('⚠️  Could not verify Supabase connection:', err.message);
    console.log('   Make sure your Supabase credentials are correct in backend/.env');
  }
}

// Routes
app.use('/api/generate', generateRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/saveDraft', draftRoutes);
app.use('/api/compile', compileRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Kisaanmittr API is running',
    supabase: supabaseUrl ? 'configured' : 'not configured',
  });
});

// API connectivity test endpoint
app.get('/api/test', async (req, res) => {
  try {
    const { error } = await supabase.from('report_drafts').select('id').limit(1);
    res.json({
      success: true,
      message: 'Backend API is working',
      supabase: error && error.code === 'PGRST116' 
        ? 'connected (tables may not exist yet)' 
        : 'connected',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Backend API error',
      error: err.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

app.listen(PORT, async () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 CORS enabled for: http://localhost:3000`);
  await testSupabaseConnection();
});

