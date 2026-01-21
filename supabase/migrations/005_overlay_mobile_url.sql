-- Add mobile URL column for responsive overlay images
ALTER TABLE public.overlays 
ADD COLUMN IF NOT EXISTS url_mobile text;

-- Comment
COMMENT ON COLUMN public.overlays.url_mobile IS 'Resized image URL for mobile devices (max 2048px)';
