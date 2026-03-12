-- Tách thông tin người mất và người đứng hợp đồng ra bảng riêng
-- Giúp quản lý dữ liệu tốt hơn và dễ mở rộng

-- =====================================================
-- BẢNG NGƯỜI MẤT (DECEASED)
-- Một plot có thể có nhiều người mất (mộ đôi, mộ gia đình)
-- =====================================================
CREATE TABLE IF NOT EXISTS deceased (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_id VARCHAR(50) NOT NULL, -- Khớp với kiểu id của bảng plots
  
  -- Thông tin cơ bản
  full_name VARCHAR(200) NOT NULL,
  gender VARCHAR(10), -- Nam, Nữ, Khác
  
  -- Ngày tháng
  birth_date DATE,
  death_date DATE,
  burial_date DATE, -- Ngày an táng
  
  -- Thông tin bổ sung
  birth_place VARCHAR(200), -- Quê quán
  death_place VARCHAR(200), -- Nơi mất
  religion VARCHAR(50), -- Tôn giáo
  
  -- Ảnh và ghi chú
  photo_url TEXT,
  epitaph TEXT, -- Câu đề từ trên bia
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- BẢNG NGƯỜI ĐỨNG HỢP ĐỒNG (CUSTOMERS/CONTRACTS)
-- Thông tin người mua, người liên hệ
-- =====================================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plot_id VARCHAR(50) NOT NULL, -- Khớp với kiểu id của bảng plots
  
  -- Thông tin cá nhân
  full_name VARCHAR(200) NOT NULL,
  phone VARCHAR(20),
  phone_2 VARCHAR(20), -- Số điện thoại phụ
  email VARCHAR(100),
  
  -- Địa chỉ
  address TEXT,
  city VARCHAR(100),
  
  -- CMND/CCCD
  id_number VARCHAR(20), -- Số CMND/CCCD
  id_issued_date DATE,
  id_issued_place VARCHAR(100),
  
  -- Quan hệ với người mất
  relationship VARCHAR(50), -- Con, Cháu, Vợ/Chồng, Khác
  
  -- Hợp đồng
  contract_number VARCHAR(50),
  contract_date DATE,
  contract_type VARCHAR(50), -- Mua đứt, Thuê, Khác
  
  -- Thanh toán
  total_amount DECIMAL(15,0),
  paid_amount DECIMAL(15,0),
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, partial, paid
  
  -- Ghi chú
  notes TEXT,
  
  -- Metadata
  is_primary BOOLEAN DEFAULT true, -- Người liên hệ chính
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_deceased_plot_id ON deceased(plot_id);
CREATE INDEX IF NOT EXISTS idx_deceased_full_name ON deceased(full_name);
CREATE INDEX IF NOT EXISTS idx_deceased_death_date ON deceased(death_date);
CREATE INDEX IF NOT EXISTS idx_deceased_birth_date ON deceased(birth_date);

CREATE INDEX IF NOT EXISTS idx_customers_plot_id ON customers(plot_id);
CREATE INDEX IF NOT EXISTS idx_customers_full_name ON customers(full_name);
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_contract_number ON customers(contract_number);

-- =====================================================
-- RLS POLICIES
-- =====================================================
ALTER TABLE deceased ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Deceased: Ai cũng xem được, chỉ authenticated mới sửa
CREATE POLICY "Anyone can view deceased" ON deceased FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage deceased" ON deceased FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Customers: Chỉ authenticated mới xem và sửa (thông tin nhạy cảm)
CREATE POLICY "Authenticated can view customers" ON customers FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can manage customers" ON customers FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- =====================================================
-- TRIGGERS
-- =====================================================
CREATE TRIGGER update_deceased_updated_at
  BEFORE UPDATE ON deceased
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE deceased IS 'Thông tin người mất - liên kết với plots';
COMMENT ON TABLE customers IS 'Thông tin người đứng hợp đồng/người mua';
COMMENT ON COLUMN customers.is_primary IS 'Đánh dấu người liên hệ chính khi có nhiều người';
