-- Migration to add system vocabulary tables
CREATE TABLE IF NOT EXISTS system_vocab_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE system_vocab_sets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for system_vocab_sets" ON system_vocab_sets FOR SELECT USING (true);

CREATE TABLE IF NOT EXISTS system_vocab_words (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id UUID NOT NULL REFERENCES system_vocab_sets(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  ipa TEXT,
  pos TEXT,
  definition TEXT,
  example TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE system_vocab_words ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for system_vocab_words" ON system_vocab_words FOR SELECT USING (true);
