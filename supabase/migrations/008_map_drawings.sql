-- Map Drawings Table
-- Stores polygons, polylines, and markers drawn on the map

-- Create update_updated_at_column function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS map_drawings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  drawing_type VARCHAR(20) NOT NULL CHECK (drawing_type IN ('polygon', 'polyline', 'circle', 'rectangle')),
  coordinates JSONB NOT NULL, -- Array of [lng, lat] pairs
  properties JSONB DEFAULT '{}', -- Additional properties like radius for circles
  stroke_color VARCHAR(20) DEFAULT '#3B82F6',
  stroke_width INTEGER DEFAULT 2,
  fill_color VARCHAR(20) DEFAULT '#3B82F680',
  fill_opacity DECIMAL(3,2) DEFAULT 0.5,
  is_visible BOOLEAN DEFAULT true,
  z_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE map_drawings ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view visible drawings"
  ON map_drawings FOR SELECT
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage drawings"
  ON map_drawings FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_map_drawings_type ON map_drawings(drawing_type);
CREATE INDEX IF NOT EXISTS idx_map_drawings_visible ON map_drawings(is_visible);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_map_drawings_updated_at ON map_drawings;
CREATE TRIGGER update_map_drawings_updated_at
  BEFORE UPDATE ON map_drawings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE map_drawings IS 'Stores custom shapes drawn on the map';
COMMENT ON COLUMN map_drawings.coordinates IS 'GeoJSON-style coordinates array [[lng, lat], ...]';
COMMENT ON COLUMN map_drawings.properties IS 'Additional properties like radius for circles';
