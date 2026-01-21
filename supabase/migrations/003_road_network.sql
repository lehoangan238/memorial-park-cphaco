-- =============================================
-- ROAD NETWORK TABLES FOR INTERNAL ROUTING
-- =============================================

-- Road Nodes: Các điểm nút trên đường (ngã rẽ, giao lộ)
CREATE TABLE IF NOT EXISTS road_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  node_type TEXT NOT NULL DEFAULT 'intersection' CHECK (node_type IN ('gate', 'intersection', 'landmark', 'endpoint')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Road Edges: Các đoạn đường nối giữa 2 điểm nút
CREATE TABLE IF NOT EXISTS road_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_node_id UUID NOT NULL REFERENCES road_nodes(id) ON DELETE CASCADE,
  to_node_id UUID NOT NULL REFERENCES road_nodes(id) ON DELETE CASCADE,
  distance DOUBLE PRECISION, -- meters, can be auto-calculated
  bidirectional BOOLEAN DEFAULT TRUE,
  road_type TEXT DEFAULT 'main' CHECK (road_type IN ('main', 'secondary', 'path')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Prevent duplicate edges
  UNIQUE(from_node_id, to_node_id)
);

-- Enable RLS
ALTER TABLE road_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE road_edges ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read road_nodes" ON road_nodes FOR SELECT USING (true);
CREATE POLICY "Public read road_edges" ON road_edges FOR SELECT USING (true);

-- Admin write access (adjust based on your auth setup)
CREATE POLICY "Admin insert road_nodes" ON road_nodes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update road_nodes" ON road_nodes FOR UPDATE USING (true);
CREATE POLICY "Admin delete road_nodes" ON road_nodes FOR DELETE USING (true);

CREATE POLICY "Admin insert road_edges" ON road_edges FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin update road_edges" ON road_edges FOR UPDATE USING (true);
CREATE POLICY "Admin delete road_edges" ON road_edges FOR DELETE USING (true);

-- Index for faster queries
CREATE INDEX idx_road_edges_from ON road_edges(from_node_id);
CREATE INDEX idx_road_edges_to ON road_edges(to_node_id);

-- Function to calculate distance between two points (Haversine)
CREATE OR REPLACE FUNCTION calculate_distance(lat1 DOUBLE PRECISION, lng1 DOUBLE PRECISION, lat2 DOUBLE PRECISION, lng2 DOUBLE PRECISION)
RETURNS DOUBLE PRECISION AS $$
DECLARE
  R DOUBLE PRECISION := 6371000; -- Earth radius in meters
  dlat DOUBLE PRECISION;
  dlng DOUBLE PRECISION;
  a DOUBLE PRECISION;
  c DOUBLE PRECISION;
BEGIN
  dlat := RADIANS(lat2 - lat1);
  dlng := RADIANS(lng2 - lng1);
  a := SIN(dlat/2) * SIN(dlat/2) + COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * SIN(dlng/2) * SIN(dlng/2);
  c := 2 * ATAN2(SQRT(a), SQRT(1-a));
  RETURN R * c;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Trigger to auto-calculate distance when edge is inserted/updated
CREATE OR REPLACE FUNCTION auto_calculate_edge_distance()
RETURNS TRIGGER AS $$
DECLARE
  from_node road_nodes%ROWTYPE;
  to_node road_nodes%ROWTYPE;
BEGIN
  -- Only calculate if distance is not provided
  IF NEW.distance IS NULL THEN
    SELECT * INTO from_node FROM road_nodes WHERE id = NEW.from_node_id;
    SELECT * INTO to_node FROM road_nodes WHERE id = NEW.to_node_id;
    
    IF from_node.id IS NOT NULL AND to_node.id IS NOT NULL THEN
      NEW.distance := calculate_distance(from_node.lat, from_node.lng, to_node.lat, to_node.lng);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_distance
  BEFORE INSERT OR UPDATE ON road_edges
  FOR EACH ROW
  EXECUTE FUNCTION auto_calculate_edge_distance();

-- =============================================
-- SAMPLE DATA: Main roads in cemetery
-- Bạn cần thay đổi tọa độ cho phù hợp với nghĩa trang thực tế
-- =============================================

-- Insert main gate node
INSERT INTO road_nodes (id, name, lat, lng, node_type) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Cổng chính', 11.1712, 106.6514, 'gate');

-- Bạn sẽ thêm các node khác qua Admin UI
