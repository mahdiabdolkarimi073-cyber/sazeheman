-- Migration: Create all missing tables, add columns, enable RLS, add policies
-- This migration was applied via Supabase MCP as: 20261013113435_create_all_missing_tables_and_columns
-- Safe to re-run: uses IF NOT EXISTS throughout

-- =====================================================
-- 1. Users table
-- =====================================================
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "phone" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "account_type" TEXT NOT NULL DEFAULT 'sazeheman',
    "nickname" TEXT,
    "slug" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "token" TEXT UNIQUE,
    "token_expires" TIMESTAMP(3),
    "trial_used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "users_phone_key" ON "users"("phone");
CREATE UNIQUE INDEX IF NOT EXISTS "users_token_key" ON "users"("token");

-- =====================================================
-- 2. Add columns to existing tables
-- =====================================================
ALTER TABLE "construction_projects" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "construction_projects" ADD COLUMN IF NOT EXISTS "city" TEXT;

ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "city" TEXT;

ALTER TABLE "sms_codes" ADD COLUMN IF NOT EXISTS "attempts" INTEGER NOT NULL DEFAULT 0;

-- =====================================================
-- 3. Auctions table
-- =====================================================
CREATE TABLE IF NOT EXISTS "auctions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "phone" TEXT NOT NULL,
    "city" TEXT,
    "budget" INTEGER,
    "deadline" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'open',
    "dashboard_type" TEXT NOT NULL DEFAULT 'sazeheman',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- 4. Auction bids table
CREATE TABLE IF NOT EXISTS "auction_bids" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "auction_id" TEXT NOT NULL,
    "user_id" TEXT,
    "bidder_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "auction_bids_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "auction_bids_auction_id_idx" ON "auction_bids"("auction_id");

-- 5. Shops table
CREATE TABLE IF NOT EXISTS "shops" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "owner_phone" TEXT NOT NULL,
    "description" TEXT,
    "logo_url" TEXT,
    "banner_url" TEXT,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'active',
    "dashboard_type" TEXT NOT NULL DEFAULT 'sazeheman',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- 6. Product categories table
CREATE TABLE IF NOT EXISTS "product_categories" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "product_categories_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "product_categories_slug_key" ON "product_categories"("slug");

-- 7. Products table
CREATE TABLE IF NOT EXISTS "products" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "shop_id" TEXT NOT NULL,
    "category_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "image_url" TEXT,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "products_shop_id_idx" ON "products"("shop_id");
CREATE INDEX IF NOT EXISTS "products_category_id_idx" ON "products"("category_id");

-- 8. Shop ads table
CREATE TABLE IF NOT EXISTS "shop_ads" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "shop_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "link_url" TEXT,
    "amount_paid" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "starts_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "shop_ads_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "shop_ads_shop_id_idx" ON "shop_ads"("shop_id");

-- 9. Advertisements table
CREATE TABLE IF NOT EXISTS "advertisements" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "business_name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "media_url" TEXT NOT NULL,
    "media_type" TEXT NOT NULL DEFAULT 'image',
    "link_url" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "amount_paid" INTEGER NOT NULL DEFAULT 0,
    "starts_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id")
);

-- 10. User comments table
CREATE TABLE IF NOT EXISTS "user_comments" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "text" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_comments_pkey" PRIMARY KEY ("id")
);

-- 11. Support tickets table
CREATE TABLE IF NOT EXISTS "support_tickets" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "subject" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'general',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "status" TEXT NOT NULL DEFAULT 'open',
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "support_tickets_pkey" PRIMARY KEY ("id")
);

-- 12. Ticket replies table
CREATE TABLE IF NOT EXISTS "ticket_replies" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "ticket_id" TEXT NOT NULL,
    "user_id" TEXT,
    "message" TEXT NOT NULL,
    "is_admin" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ticket_replies_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "ticket_replies_ticket_id_idx" ON "ticket_replies"("ticket_id");

-- 13. Subscriptions table
CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "user_id" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'free',
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "starts_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),
    "trial_used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "subscriptions_user_id_idx" ON "subscriptions"("user_id");

-- 14. Payments table
CREATE TABLE IF NOT EXISTS "payments" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "user_id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "plan" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "gateway" TEXT NOT NULL DEFAULT 'test',
    "tracking_id" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "payments_user_id_idx" ON "payments"("user_id");

-- 15. User notifications table
CREATE TABLE IF NOT EXISTS "user_notifications" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_notifications_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "user_notifications_user_id_idx" ON "user_notifications"("user_id");

-- 16. Contact messages table
CREATE TABLE IF NOT EXISTS "contact_messages" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "name" TEXT NOT NULL,
    "last_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- 17. File uploads table
CREATE TABLE IF NOT EXISTS "file_uploads" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid()::text,
    "user_id" TEXT,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "data" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "file_uploads_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "file_uploads_user_id_idx" ON "file_uploads"("user_id");

-- =====================================================
-- Foreign key constraints (safe with DO block)
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auctions_user_id_fkey') THEN
        ALTER TABLE "auctions" ADD CONSTRAINT "auctions_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auction_bids_auction_id_fkey') THEN
        ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_auction_id_fkey"
            FOREIGN KEY ("auction_id") REFERENCES "auctions"("id") ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auction_bids_user_id_fkey') THEN
        ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'shops_user_id_fkey') THEN
        ALTER TABLE "shops" ADD CONSTRAINT "shops_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_shop_id_fkey') THEN
        ALTER TABLE "products" ADD CONSTRAINT "products_shop_id_fkey"
            FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_category_id_fkey') THEN
        ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey"
            FOREIGN KEY ("category_id") REFERENCES "product_categories"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'shop_ads_shop_id_fkey') THEN
        ALTER TABLE "shop_ads" ADD CONSTRAINT "shop_ads_shop_id_fkey"
            FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'support_tickets_user_id_fkey') THEN
        ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ticket_replies_ticket_id_fkey') THEN
        ALTER TABLE "ticket_replies" ADD CONSTRAINT "ticket_replies_ticket_id_fkey"
            FOREIGN KEY ("ticket_id") REFERENCES "support_tickets"("id") ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ticket_replies_user_id_fkey') THEN
        ALTER TABLE "ticket_replies" ADD CONSTRAINT "ticket_replies_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_comments_user_id_fkey') THEN
        ALTER TABLE "user_comments" ADD CONSTRAINT "user_comments_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'subscriptions_user_id_fkey') THEN
        ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payments_user_id_fkey') THEN
        ALTER TABLE "payments" ADD CONSTRAINT "payments_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_notifications_user_id_fkey') THEN
        ALTER TABLE "user_notifications" ADD CONSTRAINT "user_notifications_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'file_uploads_user_id_fkey') THEN
        ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'construction_projects_user_id_fkey') THEN
        ALTER TABLE "construction_projects" ADD CONSTRAINT "construction_projects_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'businesses_user_id_fkey') THEN
        ALTER TABLE "businesses" ADD CONSTRAINT "businesses_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Constraint creation skipped: %', SQLERRM;
END $$;

-- =====================================================
-- Enable RLS on all new tables
-- =====================================================
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "auctions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "auction_bids" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shops" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "product_categories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "products" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "shop_ads" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "advertisements" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_comments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "support_tickets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ticket_replies" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "user_notifications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "contact_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "file_uploads" ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS policies: allow anon + authenticated
-- (app uses own JWT auth via Prisma, not Supabase Auth)
-- =====================================================

-- Users
DROP POLICY IF EXISTS "anon_select_users" ON "users";
CREATE POLICY "anon_select_users" ON "users" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_users" ON "users";
CREATE POLICY "anon_insert_users" ON "users" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_users" ON "users";
CREATE POLICY "anon_update_users" ON "users" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_users" ON "users";
CREATE POLICY "anon_delete_users" ON "users" FOR DELETE TO anon, authenticated USING (true);

-- Auctions
DROP POLICY IF EXISTS "anon_select_auctions" ON "auctions";
CREATE POLICY "anon_select_auctions" ON "auctions" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_auctions" ON "auctions";
CREATE POLICY "anon_insert_auctions" ON "auctions" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_auctions" ON "auctions";
CREATE POLICY "anon_update_auctions" ON "auctions" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_auctions" ON "auctions";
CREATE POLICY "anon_delete_auctions" ON "auctions" FOR DELETE TO anon, authenticated USING (true);

-- Auction bids
DROP POLICY IF EXISTS "anon_select_auction_bids" ON "auction_bids";
CREATE POLICY "anon_select_auction_bids" ON "auction_bids" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_auction_bids" ON "auction_bids";
CREATE POLICY "anon_insert_auction_bids" ON "auction_bids" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_auction_bids" ON "auction_bids";
CREATE POLICY "anon_update_auction_bids" ON "auction_bids" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_auction_bids" ON "auction_bids";
CREATE POLICY "anon_delete_auction_bids" ON "auction_bids" FOR DELETE TO anon, authenticated USING (true);

-- Shops
DROP POLICY IF EXISTS "anon_select_shops" ON "shops";
CREATE POLICY "anon_select_shops" ON "shops" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_shops" ON "shops";
CREATE POLICY "anon_insert_shops" ON "shops" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_shops" ON "shops";
CREATE POLICY "anon_update_shops" ON "shops" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_shops" ON "shops";
CREATE POLICY "anon_delete_shops" ON "shops" FOR DELETE TO anon, authenticated USING (true);

-- Product categories
DROP POLICY IF EXISTS "anon_select_product_categories" ON "product_categories";
CREATE POLICY "anon_select_product_categories" ON "product_categories" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_product_categories" ON "product_categories";
CREATE POLICY "anon_insert_product_categories" ON "product_categories" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_product_categories" ON "product_categories";
CREATE POLICY "anon_update_product_categories" ON "product_categories" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_product_categories" ON "product_categories";
CREATE POLICY "anon_delete_product_categories" ON "product_categories" FOR DELETE TO anon, authenticated USING (true);

-- Products
DROP POLICY IF EXISTS "anon_select_products" ON "products";
CREATE POLICY "anon_select_products" ON "products" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_products" ON "products";
CREATE POLICY "anon_insert_products" ON "products" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_products" ON "products";
CREATE POLICY "anon_update_products" ON "products" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_products" ON "products";
CREATE POLICY "anon_delete_products" ON "products" FOR DELETE TO anon, authenticated USING (true);

-- Shop ads
DROP POLICY IF EXISTS "anon_select_shop_ads" ON "shop_ads";
CREATE POLICY "anon_select_shop_ads" ON "shop_ads" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_shop_ads" ON "shop_ads";
CREATE POLICY "anon_insert_shop_ads" ON "shop_ads" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_shop_ads" ON "shop_ads";
CREATE POLICY "anon_update_shop_ads" ON "shop_ads" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_shop_ads" ON "shop_ads";
CREATE POLICY "anon_delete_shop_ads" ON "shop_ads" FOR DELETE TO anon, authenticated USING (true);

-- Advertisements
DROP POLICY IF EXISTS "anon_select_advertisements" ON "advertisements";
CREATE POLICY "anon_select_advertisements" ON "advertisements" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_advertisements" ON "advertisements";
CREATE POLICY "anon_insert_advertisements" ON "advertisements" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_advertisements" ON "advertisements";
CREATE POLICY "anon_update_advertisements" ON "advertisements" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_advertisements" ON "advertisements";
CREATE POLICY "anon_delete_advertisements" ON "advertisements" FOR DELETE TO anon, authenticated USING (true);

-- User comments
DROP POLICY IF EXISTS "anon_select_user_comments" ON "user_comments";
CREATE POLICY "anon_select_user_comments" ON "user_comments" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_user_comments" ON "user_comments";
CREATE POLICY "anon_insert_user_comments" ON "user_comments" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_user_comments" ON "user_comments";
CREATE POLICY "anon_update_user_comments" ON "user_comments" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_user_comments" ON "user_comments";
CREATE POLICY "anon_delete_user_comments" ON "user_comments" FOR DELETE TO anon, authenticated USING (true);

-- Support tickets
DROP POLICY IF EXISTS "anon_select_support_tickets" ON "support_tickets";
CREATE POLICY "anon_select_support_tickets" ON "support_tickets" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_support_tickets" ON "support_tickets";
CREATE POLICY "anon_insert_support_tickets" ON "support_tickets" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_support_tickets" ON "support_tickets";
CREATE POLICY "anon_update_support_tickets" ON "support_tickets" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_support_tickets" ON "support_tickets";
CREATE POLICY "anon_delete_support_tickets" ON "support_tickets" FOR DELETE TO anon, authenticated USING (true);

-- Ticket replies
DROP POLICY IF EXISTS "anon_select_ticket_replies" ON "ticket_replies";
CREATE POLICY "anon_select_ticket_replies" ON "ticket_replies" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_ticket_replies" ON "ticket_replies";
CREATE POLICY "anon_insert_ticket_replies" ON "ticket_replies" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_ticket_replies" ON "ticket_replies";
CREATE POLICY "anon_update_ticket_replies" ON "ticket_replies" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_ticket_replies" ON "ticket_replies";
CREATE POLICY "anon_delete_ticket_replies" ON "ticket_replies" FOR DELETE TO anon, authenticated USING (true);

-- Subscriptions
DROP POLICY IF EXISTS "anon_select_subscriptions" ON "subscriptions";
CREATE POLICY "anon_select_subscriptions" ON "subscriptions" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_subscriptions" ON "subscriptions";
CREATE POLICY "anon_insert_subscriptions" ON "subscriptions" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_subscriptions" ON "subscriptions";
CREATE POLICY "anon_update_subscriptions" ON "subscriptions" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_subscriptions" ON "subscriptions";
CREATE POLICY "anon_delete_subscriptions" ON "subscriptions" FOR DELETE TO anon, authenticated USING (true);

-- Payments
DROP POLICY IF EXISTS "anon_select_payments" ON "payments";
CREATE POLICY "anon_select_payments" ON "payments" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_payments" ON "payments";
CREATE POLICY "anon_insert_payments" ON "payments" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_payments" ON "payments";
CREATE POLICY "anon_update_payments" ON "payments" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_payments" ON "payments";
CREATE POLICY "anon_delete_payments" ON "payments" FOR DELETE TO anon, authenticated USING (true);

-- User notifications
DROP POLICY IF EXISTS "anon_select_user_notifications" ON "user_notifications";
CREATE POLICY "anon_select_user_notifications" ON "user_notifications" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_user_notifications" ON "user_notifications";
CREATE POLICY "anon_insert_user_notifications" ON "user_notifications" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_user_notifications" ON "user_notifications";
CREATE POLICY "anon_update_user_notifications" ON "user_notifications" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_user_notifications" ON "user_notifications";
CREATE POLICY "anon_delete_user_notifications" ON "user_notifications" FOR DELETE TO anon, authenticated USING (true);

-- Contact messages
DROP POLICY IF EXISTS "anon_select_contact_messages" ON "contact_messages";
CREATE POLICY "anon_select_contact_messages" ON "contact_messages" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_contact_messages" ON "contact_messages";
CREATE POLICY "anon_insert_contact_messages" ON "contact_messages" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_contact_messages" ON "contact_messages";
CREATE POLICY "anon_update_contact_messages" ON "contact_messages" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_contact_messages" ON "contact_messages";
CREATE POLICY "anon_delete_contact_messages" ON "contact_messages" FOR DELETE TO anon, authenticated USING (true);

-- File uploads
DROP POLICY IF EXISTS "anon_select_file_uploads" ON "file_uploads";
CREATE POLICY "anon_select_file_uploads" ON "file_uploads" FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_file_uploads" ON "file_uploads";
CREATE POLICY "anon_insert_file_uploads" ON "file_uploads" FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_file_uploads" ON "file_uploads";
CREATE POLICY "anon_update_file_uploads" ON "file_uploads" FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_file_uploads" ON "file_uploads";
CREATE POLICY "anon_delete_file_uploads" ON "file_uploads" FOR DELETE TO anon, authenticated USING (true);
