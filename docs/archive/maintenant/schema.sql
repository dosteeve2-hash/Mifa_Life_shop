-- ============================================================
-- MIFA LIFE — SCHEMA COMPLET
-- Supabase > SQL Editor > Nouveau query > Exécuter
-- ============================================================

-- ── EXTENSION UUID ──────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- 1. PROFILES (liés à Supabase Auth)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  phone       TEXT,
  role        TEXT NOT NULL DEFAULT 'customer'
                CHECK (role IN ('admin', 'founder', 'customer')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-création du profil à chaque inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email,'@',1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================================
-- 2. PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.products (
  id            BIGSERIAL PRIMARY KEY,
  name          TEXT        NOT NULL,
  description   TEXT,
  price_cfa     INTEGER     NOT NULL CHECK (price_cfa >= 0),
  original_price_cfa INTEGER CHECK (original_price_cfa >= 0),
  stock         INTEGER     NOT NULL DEFAULT 0 CHECK (stock >= 0),
  category      TEXT,
  subcategory   TEXT,
  image_url     TEXT,
  images        TEXT[]      DEFAULT '{}',
  active        BOOLEAN     NOT NULL DEFAULT true,
  featured      BOOLEAN     NOT NULL DEFAULT false,
  shipping_days TEXT        DEFAULT '7-14 jours',
  created_by    UUID        REFERENCES auth.users(id),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category);
CREATE INDEX IF NOT EXISTS products_active_idx   ON public.products(active);
CREATE INDEX IF NOT EXISTS products_featured_idx ON public.products(featured);

-- updated_at automatique
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

DROP TRIGGER IF EXISTS products_updated_at ON public.products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 3. ORDERS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        REFERENCES auth.users(id),
  status          TEXT        NOT NULL DEFAULT 'pending'
                    CHECK (status IN ('pending','confirmed','shipped','delivered','cancelled','refunded')),
  total_cfa       INTEGER     NOT NULL CHECK (total_cfa >= 0),
  payment_type    TEXT        CHECK (payment_type IN ('orange_money','wave','moov','card','cash')),
  payment_status  TEXT        NOT NULL DEFAULT 'pending'
                    CHECK (payment_status IN ('pending','paid','failed','refunded')),
  delivery_address TEXT,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS orders_updated_at ON public.orders;
CREATE TRIGGER orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 4. ORDER ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID    NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id  BIGINT  NOT NULL REFERENCES public.products(id),
  quantity    INTEGER NOT NULL CHECK (quantity > 0),
  price_cfa   INTEGER NOT NULL CHECK (price_cfa >= 0),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS order_items_order_idx   ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_product_idx ON public.order_items(product_id);


-- ============================================================
-- 5. CART ITEMS (panier persisté en DB pour utilisateurs connectés)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.cart_items (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID    NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id  BIGINT  NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity    INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

CREATE INDEX IF NOT EXISTS cart_items_user_idx ON public.cart_items(user_id);

DROP TRIGGER IF EXISTS cart_items_updated_at ON public.cart_items;
CREATE TRIGGER cart_items_updated_at
  BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ============================================================
-- 6. CALLBACK REQUESTS (bouton "Être rappelé")
-- ============================================================
CREATE TABLE IF NOT EXISTS public.callback_requests (
  id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
  phone       TEXT    NOT NULL,
  name        TEXT,
  message     TEXT,
  status      TEXT    NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','contacted','done')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================
-- 7. ROW LEVEL SECURITY
-- ============================================================

-- PRODUCTS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_public_read"
  ON public.products FOR SELECT USING (active = true);

CREATE POLICY "products_admin_all"
  ON public.products FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin','founder')
  ));

-- PROFILES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_own_read"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_own_update"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_admin_read"
  ON public.profiles FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role IN ('admin','founder')
  ));

-- ORDERS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "orders_own"
  ON public.orders FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "orders_admin_read"
  ON public.orders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin','founder')
  ));

-- ORDER ITEMS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "order_items_own"
  ON public.order_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.orders
    WHERE id = order_id AND user_id = auth.uid()
  ));

-- CART ITEMS
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cart_own"
  ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- CALLBACK REQUESTS (écriture publique, lecture admin)
ALTER TABLE public.callback_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "callback_insert_public"
  ON public.callback_requests FOR INSERT WITH CHECK (true);

CREATE POLICY "callback_admin_read"
  ON public.callback_requests FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin','founder')
  ));


-- ============================================================
-- 8. FONCTION DÉCRÉMENTATION STOCK (atomique)
-- ============================================================
CREATE OR REPLACE FUNCTION public.decrement_stock(
  p_product_id BIGINT,
  p_quantity   INTEGER
)
RETURNS TABLE(success BOOLEAN, new_stock INTEGER, error_msg TEXT)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_stock INTEGER;
  v_name  TEXT;
BEGIN
  SELECT stock, name INTO v_stock, v_name
  FROM public.products WHERE id = p_product_id FOR UPDATE;

  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0, 'Produit introuvable';
    RETURN;
  END IF;

  IF v_stock = 0 THEN
    RETURN QUERY SELECT false, 0, '"' || v_name || '" est en rupture de stock';
    RETURN;
  END IF;

  IF v_stock < p_quantity THEN
    RETURN QUERY SELECT false, v_stock,
      'Stock insuffisant : ' || v_stock || ' dispo, ' || p_quantity || ' demandé(s)';
    RETURN;
  END IF;

  UPDATE public.products
    SET stock = stock - p_quantity, updated_at = NOW()
    WHERE id = p_product_id;

  RETURN QUERY SELECT true, (v_stock - p_quantity)::INTEGER, NULL::TEXT;
END;
$$;


-- ============================================================
-- 9. STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('product-images', 'product-images', true, 5242880,
        ARRAY['image/jpeg','image/png','image/webp','image/gif'])
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "storage_public_read"  ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_upload" ON storage.objects;
DROP POLICY IF EXISTS "storage_admin_delete" ON storage.objects;

CREATE POLICY "storage_public_read"
  ON storage.objects FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "storage_admin_upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin','founder')
    )
  );

CREATE POLICY "storage_admin_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'product-images'
    AND EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin','founder')
    )
  );


-- ============================================================
-- 10. DONNÉES DE TEST (optionnel - décommentez pour tester)
-- ============================================================

-- INSERT INTO public.products (name, price_cfa, stock, category, active) VALUES
--   ('Casque Bluetooth Sans Fil',  15000, 50, 'electronique', true),
--   ('Robe Africaine Wax',          8500, 30, 'mode',         true),
--   ('Ventilateur USB Portable',    6000, 25, 'maison',       true),
--   ('Ballon de Football',          4500, 40, 'sport',        true);


-- ============================================================
-- VÉRIFICATION FINALE
-- ============================================================
SELECT
  t.tablename,
  COUNT(p.policyname) AS nb_policies
FROM pg_tables t
LEFT JOIN pg_policies p ON p.tablename = t.tablename
WHERE t.schemaname = 'public'
  AND t.tablename IN ('products','profiles','orders','order_items','cart_items','callback_requests')
GROUP BY t.tablename
ORDER BY t.tablename;
