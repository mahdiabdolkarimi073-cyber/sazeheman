/*
# Create tables for the "Sazeheman" builder registration feature

## Overview
This migration creates the database schema for the construction project registration flow.
Builders register their projects, verify their phone via SMS, select needed construction trades,
and after admin approval their project appears on the map and notifications go to relevant tradespeople.

## New Tables

1. **construction_projects** - Stores builder project registrations
   - id (uuid PK)
   - project_name (text) - نام پروژه
   - builder_name (text) - نام سازنده
   - area (numeric) - مساحت در حال ساخت
   - start_date (date) - شروع پروژه
   - floors_count (integer) - تعداد طبقه
   - manager_role (text) - مسئول پروژه (پیمانکار/کارفرما/مسئول خرید/صاحب ملک)
   - phone1 (text) - شماره تماس ۱
   - phone2 (text) - شماره تماس ۲
   - phone3 (text) - شماره تماس ۳
   - email (text) - ایمیل
   - other_contacts (text) - راه‌های ارتباطی دیگر
   - description (text) - توضیحات
   - address (text) - آدرس
   - location_lat (numeric) - عرض جغرافیایی
   - location_lng (numeric) - طول جغرافیایی
   - photo_url (text) - عکس پروژه
   - phone_verified (boolean default false) - آیا شماره تایید شده
   - status (text default 'pending') - pending/approved/rejected
   - created_at (timestamptz)

2. **construction_jobs** - Master list of construction trades/professions
   - id (uuid PK)
   - name (text) - نام شغل
   - slug (text unique) - slug
   - icon (text) - optional icon identifier
   - created_at (timestamptz)

3. **project_needs** - Which jobs a project needs (checklist selections)
   - id (uuid PK)
   - project_id (uuid FK -> construction_projects)
   - job_id (uuid FK -> construction_jobs)
   - description (text) - توضیحات بیشتر برای این نیاز
   - created_at (timestamptz)

4. **sms_codes** - OTP codes for phone verification
   - id (uuid PK)
   - phone (text)
   - code (text)
   - expires_at (timestamptz)
   - used (boolean default false)
   - created_at (timestamptz)

5. **notifications** - Notifications sent to tradespeople when a project is approved
   - id (uuid PK)
   - job_id (uuid FK -> construction_jobs)
   - project_id (uuid FK -> construction_projects)
   - description (text)
   - is_read (boolean default false)
   - created_at (timestamptz)

## Security
- RLS enabled on all tables
- Policies use TO anon, authenticated (no Supabase auth in this app; the app uses its own in-memory auth)
- All tables are writable by the frontend via the anon key since the app has no Supabase-managed sign-in
*/

-- construction_projects
CREATE TABLE IF NOT EXISTS construction_projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name text NOT NULL,
    builder_name text NOT NULL,
    area numeric,
    start_date date,
    floors_count integer,
    manager_role text,
    phone1 text NOT NULL,
    phone2 text,
    phone3 text,
    email text,
    other_contacts text,
    description text,
    address text,
    location_lat numeric,
    location_lng numeric,
    photo_url text,
    phone_verified boolean NOT NULL DEFAULT false,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE construction_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_projects" ON construction_projects;
CREATE POLICY "anon_select_projects" ON construction_projects FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_projects" ON construction_projects;
CREATE POLICY "anon_insert_projects" ON construction_projects FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_projects" ON construction_projects;
CREATE POLICY "anon_update_projects" ON construction_projects FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_projects" ON construction_projects;
CREATE POLICY "anon_delete_projects" ON construction_projects FOR DELETE
    TO anon, authenticated USING (true);

-- construction_jobs
CREATE TABLE IF NOT EXISTS construction_jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    icon text,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE construction_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_jobs" ON construction_jobs;
CREATE POLICY "anon_select_jobs" ON construction_jobs FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_jobs" ON construction_jobs;
CREATE POLICY "anon_insert_jobs" ON construction_jobs FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_jobs" ON construction_jobs;
CREATE POLICY "anon_update_jobs" ON construction_jobs FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_jobs" ON construction_jobs;
CREATE POLICY "anon_delete_jobs" ON construction_jobs FOR DELETE
    TO anon, authenticated USING (true);

-- project_needs
CREATE TABLE IF NOT EXISTS project_needs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid NOT NULL REFERENCES construction_projects(id) ON DELETE CASCADE,
    job_id uuid NOT NULL REFERENCES construction_jobs(id) ON DELETE CASCADE,
    description text,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE project_needs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_needs" ON project_needs;
CREATE POLICY "anon_select_needs" ON project_needs FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_needs" ON project_needs;
CREATE POLICY "anon_insert_needs" ON project_needs FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_needs" ON project_needs;
CREATE POLICY "anon_update_needs" ON project_needs FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_needs" ON project_needs;
CREATE POLICY "anon_delete_needs" ON project_needs FOR DELETE
    TO anon, authenticated USING (true);

-- sms_codes
CREATE TABLE IF NOT EXISTS sms_codes (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    phone text NOT NULL,
    code text NOT NULL,
    expires_at timestamptz NOT NULL,
    used boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sms_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_sms" ON sms_codes;
CREATE POLICY "anon_select_sms" ON sms_codes FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_sms" ON sms_codes;
CREATE POLICY "anon_insert_sms" ON sms_codes FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_sms" ON sms_codes;
CREATE POLICY "anon_update_sms" ON sms_codes FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_sms" ON sms_codes;
CREATE POLICY "anon_delete_sms" ON sms_codes FOR DELETE
    TO anon, authenticated USING (true);

-- notifications
CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id uuid REFERENCES construction_jobs(id) ON DELETE CASCADE,
    project_id uuid REFERENCES construction_projects(id) ON DELETE CASCADE,
    description text,
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_notifications" ON notifications;
CREATE POLICY "anon_select_notifications" ON notifications FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_notifications" ON notifications;
CREATE POLICY "anon_insert_notifications" ON notifications FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_notifications" ON notifications;
CREATE POLICY "anon_update_notifications" ON notifications FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_notifications" ON notifications;
CREATE POLICY "anon_delete_notifications" ON notifications FOR DELETE
    TO anon, authenticated USING (true);

-- Seed initial construction jobs
INSERT INTO construction_jobs (name, slug) VALUES
    ('پیمانکار', 'peymankar'),
    ('مهندس عمران', 'mohandes-omran'),
    ('معمار', 'memar'),
    ('نقشه‌بردار', 'nagheh-bardar'),
    ('کارگر ساختمانی', 'kargar-sakhtemani'),
    ('بنا', 'banna'),
    ('گچ‌کار', 'gachkar'),
    ('نقاش', 'naghash'),
    ('لوله‌کش', 'looleh-kesh'),
    ('برق‌کار', ' bargh-kar'),
    ('تاسیسات مکانیکی', 'tasisat-mekaniki'),
    ('کولر‌ساز', 'coolersaz'),
    ('پنجره‌ساز', 'panjareh-saz'),
    ('درساز', 'darsaz'),
    ('کابینت‌ساز', 'kabinet-saz'),
    ('پارکت‌کار', 'parket-kar'),
    ('سرامیک‌کار', 'saramik-kar'),
    ('عایق‌کار', 'ayegh-kar'),
    ('قیرگون‌کار', 'qirgun-kar'),
    ('شیشه‌کار', 'shisheh-kar'),
    ('آرماتوربند', 'armaturband'),
    ('قالب‌بند', 'qaleb-band'),
    ('بتن‌ریز', 'beton-riz'),
    ('ماشین‌آلات سنگین', 'mashin-alat-sangin'),
    ('خاکبرداری', 'khak-bardari'),
    ('شعله‌پز', 'shooleh-paz'),
    ('جوشکار', 'joshkar'),
    ('آهنگر', 'ahangar'),
    ('نجار', 'najjar'),
    ('آبکار', 'abkar'),
    ('چوب‌کار', 'choob-kar'),
    ('سنگ‌کار', 'sang-kar'),
    ('کاشی‌کار', 'kashi-kar'),
    ('عایق‌کار رطوبتی', 'ayegh-kar-rutubati'),
    ('سقف کاذوب', 'saqf-kazhoob'),
    ('دیوارچین', 'divar-chin'),
    ('مترور', 'metror'),
    ('فورمان', 'foreman'),
    ('انباردار', 'anbardar'),
    ('راننده کامیون', 'ranande-kamion'),
    ('باربر', 'barbar'),
    ('تعمیرکار', 'tamirkar'),
    ('نظافتچی ساختمانی', 'nazafatchi-sakhtemani'),
    ('محافظ ساختمان', 'mohafez-sakhteman'),
    ('مشاور املاک', 'moshaver-emlak'),
    ('وکیل ملک', 'vakil-molk'),
    ('زمین‌شناس', 'zamin-shenas'),
    ('آزمایشگاه فنی', 'azmayeshgah-fanni'),
    ('حمل و نقل مصالح', 'haml-naql-masaleh')
ON CONFLICT (slug) DO NOTHING;
