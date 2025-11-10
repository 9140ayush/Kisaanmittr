import express from 'express';
import OpenAI from 'openai';

const router = express.Router();

// Initialize OpenAI client only if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

router.post('/', async (req, res) => {
  try {
    const { prompt, itemName } = req.body;

    if (!openai) {
      return res.status(500).json({
        error: 'OpenAI API key is not configured',
        details: 'Please set OPENAI_API_KEY in backend/.env file',
      });
    }

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const systemPrompt = `You are an agricultural expert assistant. Generate comprehensive, well-structured content for agricultural reports. 
    The content should be professional, informative, and suitable for inclusion in a formal report document.`;

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

    res.json({
      success: true,
      content: generatedText,
      itemName: itemName || 'Generated Content',
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      error: 'Failed to generate content',
      details: error.message,
    });
  }
});

export default router;

