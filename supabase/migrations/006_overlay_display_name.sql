-- Add display_name column for grouping overlay labels
ALTER TABLE public.overlays 
ADD COLUMN IF NOT EXISTS display_name text;

-- Comment
COMMENT ON COLUMN public.overlays.display_name IS 'Display name for label grouping (e.g., B342 for B342-A and B342-B)';
