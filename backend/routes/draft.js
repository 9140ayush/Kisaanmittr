import express from 'express';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { userId, itemName, content, method } = req.body;
    const supabase = req.app.locals.supabase;

    if (!userId || !itemName || !method) {
      return res.status(400).json({
        error: 'userId, itemName, and method are required',
      });
    }

    // Check if draft exists
    const { data: existingDraft } = await supabase
      .from('report_drafts')
      .select('id')
      .eq('user_id', userId)
      .eq('item_name', itemName)
      .single();

    if (existingDraft) {
      // Update existing draft
      const { data, error } = await supabase
        .from('report_drafts')
        .update({
          content: content || '',
          method,
          last_updated: new Date().toISOString(),
        })
        .eq('id', existingDraft.id)
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        draft: data,
        message: 'Draft updated successfully',
      });
    } else {
      // Create new draft
      const { data, error } = await supabase
        .from('report_drafts')
        .insert({
          user_id: userId,
          item_name: itemName,
          content: content || '',
          method,
        })
        .select()
        .single();

      if (error) throw error;

      res.json({
        success: true,
        draft: data,
        message: 'Draft saved successfully',
      });
    }
  } catch (error) {
    console.error('Save draft error:', error);
    res.status(500).json({
      error: 'Failed to save draft',
      details: error.message,
    });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const supabase = req.app.locals.supabase;

    const { data, error } = await supabase
      .from('report_drafts')
      .select('*')
      .eq('user_id', userId)
      .order('last_updated', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      drafts: data || [],
    });
  } catch (error) {
    console.error('Get drafts error:', error);
    res.status(500).json({
      error: 'Failed to fetch drafts',
      details: error.message,
    });
  }
});

export default router;

