-- ============================================================
-- SHiNi Supabase Setup SQL
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================
KoladeTomisin
-- 1. Create the products table
CREATE TABLE products (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  category    TEXT[] DEFAULT '{}',
  price       NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  description TEXT,
  sizes       TEXT[] DEFAULT '{}',
  colors      TEXT[] DEFAULT '{}',
  tags        TEXT[] DEFAULT '{}',
  in_stock    BOOLEAN DEFAULT true,
  is_new      BOOLEAN DEFAULT false,
  is_sale     BOOLEAN DEFAULT false,
  rating      NUMERIC(3, 1) DEFAULT 4.5,
  reviews     INTEGER DEFAULT 0,
  image       TEXT,
  images      TEXT[] DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Allow public read access (so your store can show products)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read products"
  ON products FOR SELECT
  USING (true);

-- 3. Allow all operations from the admin (using anon key)
--    Note: In production you'd use Supabase Auth, but for now
--    the password is handled in the Admin page itself.
CREATE POLICY "Admin can do everything"
  ON products FOR ALL
  USING (true)
  WITH CHECK (true);
