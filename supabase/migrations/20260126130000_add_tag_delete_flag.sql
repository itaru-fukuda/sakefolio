-- Add delete_flag to sakenowa_flavor_tags
-- 0: Active, 1: Deleted
ALTER TABLE public.sakenowa_flavor_tags ADD COLUMN IF NOT EXISTS delete_flag smallint DEFAULT 0 NOT NULL;

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_sakenowa_flavor_tags_delete_flag ON public.sakenowa_flavor_tags(delete_flag);
