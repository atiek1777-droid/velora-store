# 🚀 دليل رفع موقع فيلورا — خطوة بخطوة

## ✅ المتطلبات
- حساب GitHub (مجاني): https://github.com
- حساب Vercel (مجاني): https://vercel.com
- حساب Supabase (مجاني): https://supabase.com
- Node.js مثبت على الجهاز: https://nodejs.org

---

## 🗄️ الخطوة 1 — إعداد Supabase

### 1.1 أنشئ مشروعاً جديداً
1. اذهب إلى https://supabase.com وسجّل دخولك
2. اضغط **New Project** — اختر اسماً واحتفظ بكلمة مرور قاعدة البيانات
3. انتظر ~2 دقيقة حتى يكتمل الإنشاء

### 1.2 شغّل SQL الجداول
في Supabase → **SQL Editor** → **New Query** → الصق هذا الكود واضغط **Run**:

```sql
-- ── جدول الملفات الشخصية (أدوار المستخدمين) ─────────────────────────
create table public.profiles (
  id          uuid references auth.users(id) on delete cascade primary key,
  full_name   text,
  role        text not null default 'order_supervisor'
                   check (role in ('admin','editor','order_supervisor')),
  created_at  timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── جدول المنتجات ────────────────────────────────────────────────────
create table public.products (
  id          bigint generated always as identity primary key,
  name        text not null,
  description text,
  price       numeric not null default 0,
  stock       int     not null default 0,
  sizes       int[]   not null default '{36,37,38,39,40,41}',
  category    text,
  is_new      boolean default false,
  gradient    text    default 'linear-gradient(145deg,#4B164C,#8B2F8C)',
  images      text[]  default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);
alter table public.products enable row level security;
create policy "Public read products"  on public.products for select to anon using (true);
create policy "Editors manage products" on public.products for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin','editor'))
);

-- ── جدول الطلبات ─────────────────────────────────────────────────────
create table public.orders (
  id              text primary key,
  product_id      bigint references public.products(id),
  product_name    text,
  size            int,
  price           numeric,
  wallet          text,
  customer_name   text,
  customer_phone  text,
  status          text not null default 'جديد'
                       check (status in ('جديد','مؤكد','قيد التحضير','تم الشحن')),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);
alter table public.orders enable row level security;
create policy "Supervisors manage orders" on public.orders for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid())
);
create policy "Public insert orders" on public.orders for insert to anon with check (true);

-- ── جدول إعدادات الموقع ──────────────────────────────────────────────
create table public.site_settings (
  key        text primary key,
  value      text,
  updated_at timestamptz default now()
);
alter table public.site_settings enable row level security;
create policy "Public read settings"  on public.site_settings for select to anon using (true);
create policy "Admins manage settings" on public.site_settings for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- ── بيانات أولية ─────────────────────────────────────────────────────
insert into public.site_settings (key, value) values
  ('store_name',  'Velora'),
  ('tagline',     'REFINED . FEMININE . VELORA'),
  ('description', 'أحذية فيلورا — حيث تلتقي الأناقة بالجمال اليمني الأصيل'),
  ('whatsapp',    '967781885252'),
  ('instagram',   '@velora.sho'),
  ('tiktok',      '@velora258'),
  ('facebook',    'Velora Yemen');

-- ── Trigger لإنشاء profile تلقائياً عند التسجيل ─────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role','order_supervisor'));
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### 1.3 أنشئ مستخدم المدير الأول
في Supabase → **Authentication** → **Users** → **Add User**:
- Email: `admin@velora.ye`
- Password: (اختاري كلمة مرور قوية)

ثم في **SQL Editor**:
```sql
update public.profiles
set role = 'admin'
where id = (select id from auth.users where email = 'admin@velora.ye');
```

### 1.4 أنشئ Storage Bucket
في Supabase → **Storage** → **New Bucket**:
- Name: `velora-media`
- Public: ✅ نعم

ثم في **SQL Editor**:
```sql
create policy "Public read velora-media"
on storage.objects for select to anon using (bucket_id = 'velora-media');
create policy "Auth upload velora-media"
on storage.objects for insert to authenticated using (bucket_id = 'velora-media');
create policy "Auth delete velora-media"
on storage.objects for delete to authenticated using (bucket_id = 'velora-media');
```

### 1.5 احتفظ بمفاتيح API
في Supabase → **Project Settings** → **API**:
- `Project URL` → هذا هو VITE_SUPABASE_URL
- `anon public key` → هذا هو VITE_SUPABASE_ANON_KEY

---

## 💻 الخطوة 2 — إعداد المشروع محلياً

```bash
# انسخي مجلد المشروع
cd velora

# ثبّتي المكتبات
npm install

# أنشئي ملف البيئة
cp .env.example .env
```

افتحي `.env` وضعي المفاتيح:
```
VITE_SUPABASE_URL=https://XXXXXXXX.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

```bash
# شغّلي المشروع محلياً
npm run dev
# افتحي: http://localhost:3000
```

---

## 📦 الخطوة 3 — GitHub

```bash
# من داخل مجلد velora
git init
git add .
git commit -m "🚀 Velora v2.0 - Production Ready"

# اذهبي إلى github.com → New Repository → velora-store
# ثم:
git remote add origin https://github.com/YOUR_USERNAME/velora-store.git
git branch -M main
git push -u origin main
```

---

## 🌐 الخطوة 4 — Vercel (النشر المجاني)

1. اذهبي إلى https://vercel.com وسجّلي بحساب GitHub
2. اضغطي **Add New Project** → اختاري `velora-store`
3. Framework Preset: **Vite**
4. في **Environment Variables** أضيفي:
   - `VITE_SUPABASE_URL` = (قيمة من Supabase)
   - `VITE_SUPABASE_ANON_KEY` = (قيمة من Supabase)
5. اضغطي **Deploy** ✅

بعد ~60 ثانية موقعك يعمل على رابط مثل:
`https://velora-store.vercel.app`

---

## 🔧 نصائح ما بعد الرفع

| المهمة | المكان |
|--------|--------|
| تغيير دومين مخصص | Vercel → Domains |
| إضافة منتجات | لوحة التحكم → المنتجات |
| متابعة الطلبات | لوحة التحكم → الطلبات |
| تغيير الشعار | لوحة التحكم → الإعدادات |
| إضافة موظف | Supabase → Auth → Add User |

---

## 🆘 مشاكل شائعة

**الموقع يعمل محلياً لكن لا في Vercel؟**
→ تأكدي أن Environment Variables مضافة في Vercel بشكل صحيح.

**لا تظهر المنتجات؟**
→ تأكدي من تشغيل SQL الجداول في Supabase.

**خطأ في رفع الصور؟**
→ تأكدي من إنشاء bucket `velora-media` وتطبيق سياسات Storage.

---

**✨ موقع فيلورا سيكون حياً في غضون 10 دقائق!**
