/*
# Create tables for the "Shoghl Man" (My Job) business registration feature

## Overview
This migration creates the database schema for the "شغل من" (My Job) feature.
Service providers (tradespeople, businesses) register their business, verify their phone,
select a plan, and after admin approval their business is published.

## New Tables

1. **businesses** - Stores business/service-provider registrations
   - id (uuid PK)
   - business_name (text) - نام کسب و کار
   - full_name (text) - نام و نام خانوادگی
   - job_id (uuid FK -> construction_jobs) - نوع خدمات (category)
   - work_experience (text) - سابقه کار
   - phone (text) - شماره تماس
   - email (text) - ایمیل
   - other_contacts (text) - راه‌های ارتباطی دیگر
   - description (text) - توضیحات
   - address (text) - آدرس
   - location_lat (numeric) - عرض جغرافیایی
   - location_lng (numeric) - طول جغرافیایی
   - plan (text default 'free') - پلن انتخابی
   - phone_verified (boolean default false) - آیا شماره تایید شده
   - status (text default 'pending') - pending/approved/rejected
   - created_at (timestamptz)

2. **business_photos** - Sample work photos for a business
   - id (uuid PK)
   - business_id (uuid FK -> businesses)
   - photo_url (text) - URL or base64 of the photo
   - created_at (timestamptz)

## Security
- RLS enabled on all tables
- Policies use TO anon, authenticated (no Supabase auth; app uses in-memory auth)
- All tables are writable by the frontend via the anon key
*/

CREATE TABLE IF NOT EXISTS businesses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_name text NOT NULL,
    full_name text NOT NULL,
    job_id uuid REFERENCES construction_jobs(id) ON DELETE SET NULL,
    work_experience text,
    phone text NOT NULL,
    email text,
    other_contacts text,
    description text,
    address text,
    location_lat numeric,
    location_lng numeric,
    plan text NOT NULL DEFAULT 'free',
    phone_verified boolean NOT NULL DEFAULT false,
    status text NOT NULL DEFAULT 'pending',
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_businesses" ON businesses;
CREATE POLICY "anon_select_businesses" ON businesses FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_businesses" ON businesses;
CREATE POLICY "anon_insert_businesses" ON businesses FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_businesses" ON businesses;
CREATE POLICY "anon_update_businesses" ON businesses FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_businesses" ON businesses;
CREATE POLICY "anon_delete_businesses" ON businesses FOR DELETE
    TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS business_photos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id uuid NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    photo_url text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE business_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_business_photos" ON business_photos;
CREATE POLICY "anon_select_business_photos" ON business_photos FOR SELECT
    TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_business_photos" ON business_photos;
CREATE POLICY "anon_insert_business_photos" ON business_photos FOR INSERT
    TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_business_photos" ON business_photos;
CREATE POLICY "anon_update_business_photos" ON business_photos FOR UPDATE
    TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_business_photos" ON business_photos;
CREATE POLICY "anon_delete_business_photos" ON business_photos FOR DELETE
    TO anon, authenticated USING (true);
