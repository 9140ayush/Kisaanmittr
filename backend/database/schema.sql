-- Report Templates Table
CREATE TABLE IF NOT EXISTS report_templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  template_name VARCHAR(255) NOT NULL,
  items_list JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Report Drafts Table
CREATE TABLE IF NOT EXISTS report_drafts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  item_name VARCHAR(255) NOT NULL,
  content TEXT,
  method VARCHAR(50) NOT NULL, -- 'ai', 'file', 'manual'
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Final Reports Table
CREATE TABLE IF NOT EXISTS final_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_report_templates_user_id ON report_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_report_drafts_user_id ON report_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_final_reports_user_id ON final_reports(user_id);

