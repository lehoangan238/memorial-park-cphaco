-- Add deceased information columns to plots table
-- For searching by birth/death dates

ALTER TABLE plots 
ADD COLUMN IF NOT EXISTS birth_date DATE,
ADD COLUMN IF NOT EXISTS death_date DATE,
ADD COLUMN IF NOT EXISTS deceased_name VARCHAR(200);

-- Index for date searches
CREATE INDEX IF NOT EXISTS idx_plots_birth_date ON plots(birth_date);
CREATE INDEX IF NOT EXISTS idx_plots_death_date ON plots(death_date);
CREATE INDEX IF NOT EXISTS idx_plots_deceased_name ON plots(deceased_name);

-- Comments
COMMENT ON COLUMN plots.birth_date IS 'Ngày sinh của người mất';
COMMENT ON COLUMN plots.death_date IS 'Ngày mất';
COMMENT ON COLUMN plots.deceased_name IS 'Tên người mất (có thể khác tên khách hàng)';
