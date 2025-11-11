import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Cached OpenAI client instance
let openaiClient = null;
let clientInitialized = false;

// Lazy initialization function for OpenAI client (cached after first initialization)
function getOpenAIClient() {
  // Return cached client if already initialized
  if (clientInitialized) {
    return openaiClient;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY is not set in environment variables');
    clientInitialized = true; // Mark as initialized to prevent repeated logs
    return null;
  }

  // Validate API key format (should start with 'sk-')
  if (!apiKey.startsWith('sk-')) {
    console.warn('⚠️  OPENAI_API_KEY format may be incorrect (should start with "sk-")');
  }

  try {
    openaiClient = new OpenAI({
      apiKey: apiKey,
    });
    console.log('✅ OpenAI client initialized successfully');
    clientInitialized = true;
    return openaiClient;
  } catch (error) {
    console.error('❌ Failed to initialize OpenAI client:', error.message);
    clientInitialized = true; // Mark as initialized to prevent repeated logs
    return null;
  }
}

router.post('/', async (req, res) => {
  try {
    const { prompt, itemName } = req.body;

    // Initialize OpenAI client lazily (ensures env vars are loaded)
    const openai = getOpenAIClient();

    if (!openai) {
      console.error('OpenAI API key is not configured');
      return res.status(500).json({
        success: false,
        error: 'OpenAI API key is not configured',
        details: 'Please set OPENAI_API_KEY in backend/.env file',
      });
    }

    if (!prompt) {
      console.warn('Request missing prompt parameter');
      return res.status(400).json({ 
        success: false,
        error: 'Prompt is required' 
      });
    }

    console.log(`📝 Generating content for prompt: ${prompt.substring(0, 50)}...`);

    const systemPrompt = `You are an agricultural expert assistant. Generate comprehensive, well-structured content for agricultural reports. 
    The content should be professional, informative, and suitable for inclusion in a formal report document.`;

    console.log('🔄 Calling OpenAI API...');
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedText = completion.choices[0]?.message?.content || '';

    if (!generatedText) {
      console.warn('⚠️  OpenAI returned empty response');
      return res.status(500).json({
        success: false,
        error: 'Received empty response from OpenAI',
        details: 'The API call succeeded but no content was generated',
      });
    }

    console.log(`✅ Generated ${generatedText.length} characters of content`);

    return res.json({
      success: true,
      content: generatedText,
      itemName: itemName || 'Generated Content',
    });
  } catch (error) {
    // Enhanced error logging - OpenAI SDK errors have specific structure
    const errorStatus = error.status || error.statusCode || error.response?.status;
    const errorMessage = error.message || 'Unknown error';
    const errorType = error.type || error.constructor.name;
    const errorCode = error.code;
    
    console.error('❌ OpenAI API Error:', {
      message: errorMessage,
      type: errorType,
      status: errorStatus,
      code: errorCode,
      error: error.error || 'No error details',
    });

    // Handle specific OpenAI API errors
    if (errorStatus === 401) {
      return res.status(401).json({
        success: false,
        error: 'OpenAI API authentication failed',
        details: 'Invalid API key. Please check your OPENAI_API_KEY in backend/.env',
      });
    }

    if (errorStatus === 429) {
      return res.status(429).json({
        success: false,
        error: 'OpenAI API rate limit exceeded',
        details: 'Please try again later',
      });
    }

    if (errorStatus === 500 || errorStatus === 503) {
      return res.status(503).json({
        success: false,
        error: 'OpenAI API service unavailable',
        details: 'The OpenAI service is temporarily unavailable. Please try again later.',
      });
    }

    // Handle network/connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({
        success: false,
        error: 'Cannot connect to OpenAI API',
        details: 'Network error. Please check your internet connection.',
      });
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      error: 'Failed to generate content',
      details: errorMessage || 'An unexpected error occurred',
    });
  }
});

export default router;

