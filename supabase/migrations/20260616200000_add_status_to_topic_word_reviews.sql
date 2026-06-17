-- Add a `status` column to topic_word_reviews so the flashcard lists
-- (Đã nhớ / Chưa nhớ) can be distinguished and ordered on reload.
-- Guarded so it is safe regardless of migration ordering: it only runs
-- if the base table already exists, and the column add is idempotent.
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'topic_word_reviews') THEN
    ALTER TABLE topic_word_reviews
      ADD COLUMN IF NOT EXISTS status text CHECK (status IN ('known', 'unknown'));
  END IF;
END $$;
