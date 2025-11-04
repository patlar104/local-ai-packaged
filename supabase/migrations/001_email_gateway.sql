CREATE TABLE email_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  imap_host TEXT,
  imap_port INTEGER DEFAULT 993,
  smtp_host TEXT,
  smtp_port INTEGER DEFAULT 587,
  credentials JSONB,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID REFERENCES email_accounts(id),
  direction TEXT CHECK (direction IN ('in', 'out')),
  subject TEXT,
  body TEXT,
  metadata JSONB,
  processed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workflow_state (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name TEXT,
  last_run TIMESTAMPTZ,
  status TEXT,
  checkpoint JSONB
);
