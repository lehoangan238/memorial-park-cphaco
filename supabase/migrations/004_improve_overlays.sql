-- Migration: Improve overlays table
-- Add useful metadata columns and constraints

-- Add new columns
ALTER TABLE public.overlays
ADD COLUMN IF NOT EXISTS z_index integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS opacity integer DEFAULT 85,
ADD COLUMN IF NOT EXISTS is_visible boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS type text DEFAULT 'zone_map',
ADD COLUMN IF NOT EXISTS description text,
ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Add NOT NULL constraints (only if data exists and is valid)
-- First update any NULL values
UPDATE public.overlays SET url = '' WHERE url IS NULL;
UPDATE public.overlays SET nw_lat = 0 WHERE nw_lat IS NULL;
UPDATE public.overlays SET nw_lng = 0 WHERE nw_lng IS NULL;
UPDATE public.overlays SET se_lat = 0 WHERE se_lat IS NULL;
UPDATE public.overlays SET se_lng = 0 WHERE se_lng IS NULL;

-- Add constraints
ALTER TABLE public.overlays
ALTER COLUMN url SET NOT NULL,
ALTER COLUMN nw_lat SET NOT NULL,
ALTER COLUMN nw_lng SET NOT NULL,
ALTER COLUMN se_lat SET NOT NULL,
ALTER COLUMN se_lng SET NOT NULL;

-- Add check constraint for opacity (0-100)
ALTER TABLE public.overlays
ADD CONSTRAINT overlays_opacity_check CHECK (opacity >= 0 AND opacity <= 100);

-- Add check constraint for valid overlay types
ALTER TABLE public.overlays
ADD CONSTRAINT overlays_type_check CHECK (type IN ('zone_map', 'satellite', 'blueprint', 'decoration', 'other'));

-- Create index for faster queries by visibility and z_index
CREATE INDEX IF NOT EXISTS idx_overlays_visible ON public.overlays (is_visible, z_index);

-- Create function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_overlays_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS overlays_updated_at ON public.overlays;
CREATE TRIGGER overlays_updated_at
  BEFORE UPDATE ON public.overlays
  FOR EACH ROW
  EXECUTE FUNCTION update_overlays_updated_at();

-- Add comments for documentation
COMMENT ON COLUMN public.overlays.z_index IS 'Display order - higher values appear on top';
COMMENT ON COLUMN public.overlays.opacity IS 'Transparency level 0-100 (100 = fully opaque)';
COMMENT ON COLUMN public.overlays.is_visible IS 'Toggle visibility without deleting';
COMMENT ON COLUMN public.overlays.type IS 'Category: zone_map, satellite, blueprint, decoration, other';
COMMENT ON COLUMN public.overlays.description IS 'Optional description or notes';
