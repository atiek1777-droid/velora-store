/*
  # Velora Store - Initial Schema

  1. New Tables
    - `profiles` - User roles (admin, editor, order_supervisor)
    - `products` - Shoe products with images, sizes, pricing
    - `orders` - Customer orders linked to products
    - `site_settings` - Key/value store for configurable site content

  2. Security
    - RLS enabled on all tables
    - Profiles: users see own, admins see all
    - Products: public read, editors/admins write
    - Orders: authenticated staff manage, anon can insert
    - Settings: public read, admins manage

  3. Automation
    - Trigger creates profile automatically on new auth user signup
    - Default settings seeded for Velora brand
*/

-- ── Profiles ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id         uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name  text,
  role       text NOT NULL DEFAULT 'order_supervisor'
               CHECK (role IN ('admin','editor','order_supervisor')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can view own profile') THEN
    CREATE POLICY "Users can view own profile"
      ON public.profiles FOR SELECT TO authenticated
      USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Admins can view all profiles') THEN
    CREATE POLICY "Admins can view all profiles"
      ON public.profiles FOR SELECT TO authenticated
      USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='profiles' AND policyname='Users can update own profile') THEN
    CREATE POLICY "Users can update own profile"
      ON public.profiles FOR UPDATE TO authenticated
      USING (auth.uid() = id)
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;

-- ── Products ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name        text NOT NULL,
  description text,
  price       numeric NOT NULL DEFAULT 0,
  stock       int NOT NULL DEFAULT 0,
  sizes       int[] NOT NULL DEFAULT '{36,37,38,39,40,41}',
  category    text,
  is_new      boolean DEFAULT false,
  gradient    text DEFAULT 'linear-gradient(145deg,#4B164C,#8B2F8C)',
  images      text[] DEFAULT '{}',
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Public can read products') THEN
    CREATE POLICY "Public can read products" ON public.products FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Authenticated can read products') THEN
    CREATE POLICY "Authenticated can read products" ON public.products FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Editors can insert products') THEN
    CREATE POLICY "Editors can insert products" ON public.products FOR INSERT TO authenticated
      WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor')));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Editors can update products') THEN
    CREATE POLICY "Editors can update products" ON public.products FOR UPDATE TO authenticated
      USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor')))
      WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor')));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='products' AND policyname='Editors can delete products') THEN
    CREATE POLICY "Editors can delete products" ON public.products FOR DELETE TO authenticated
      USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('admin','editor')));
  END IF;
END $$;

-- ── Orders ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id             text PRIMARY KEY,
  product_id     bigint REFERENCES public.products(id),
  product_name   text,
  size           int,
  price          numeric,
  wallet         text,
  customer_name  text,
  customer_phone text,
  status         text NOT NULL DEFAULT 'جديد'
                   CHECK (status IN ('جديد','مؤكد','قيد التحضير','تم الشحن')),
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Anon can insert orders') THEN
    CREATE POLICY "Anon can insert orders" ON public.orders FOR INSERT TO anon WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Authenticated can insert orders') THEN
    CREATE POLICY "Authenticated can insert orders" ON public.orders FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Staff can view orders') THEN
    CREATE POLICY "Staff can view orders" ON public.orders FOR SELECT TO authenticated
      USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid()));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='orders' AND policyname='Staff can update orders') THEN
    CREATE POLICY "Staff can update orders" ON public.orders FOR UPDATE TO authenticated
      USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid()))
      WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid()));
  END IF;
END $$;

-- ── Site Settings ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.site_settings (
  key        text PRIMARY KEY,
  value      text,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='Public can read settings') THEN
    CREATE POLICY "Public can read settings" ON public.site_settings FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='Authenticated can read settings') THEN
    CREATE POLICY "Authenticated can read settings" ON public.site_settings FOR SELECT TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='Admins can insert settings') THEN
    CREATE POLICY "Admins can insert settings" ON public.site_settings FOR INSERT TO authenticated
      WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='Admins can update settings') THEN
    CREATE POLICY "Admins can update settings" ON public.site_settings FOR UPDATE TO authenticated
      USING (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
      WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));
  END IF;
END $$;

-- ── Default settings ──────────────────────────────────────────────────────────
INSERT INTO public.site_settings (key, value) VALUES
  ('store_name',  'Velora'),
  ('tagline',     'REFINED . FEMININE . VELORA'),
  ('description', 'أحذية فيلورا — حيث تلتقي الأناقة بالجمال اليمني الأصيل'),
  ('whatsapp',    '967781885252'),
  ('instagram',   '@velora.sho'),
  ('tiktok',      '@velora258'),
  ('facebook',    'Velora Yemen')
ON CONFLICT (key) DO NOTHING;

-- ── Auto-create profile on signup ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'order_supervisor')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
