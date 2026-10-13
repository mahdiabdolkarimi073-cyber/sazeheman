-- Migration: Add User, Subscription, Payment, ContactMessage, FileUpload tables and new columns

-- Users table
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

-- Add user_id to construction_projects
ALTER TABLE "construction_projects" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "construction_projects" ADD COLUMN IF NOT EXISTS "city" TEXT;

-- Add user_id to businesses
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "user_id" TEXT;
ALTER TABLE "businesses" ADD COLUMN IF NOT EXISTS "city" TEXT;

-- Add user_id to auctions
ALTER TABLE "auctions" ADD COLUMN IF NOT EXISTS "user_id" TEXT;

-- Add user_id to auction_bids
ALTER TABLE "auction_bids" ADD COLUMN IF NOT EXISTS "user_id" TEXT;

-- Add user_id to shops
ALTER TABLE "shops" ADD COLUMN IF NOT EXISTS "user_id" TEXT;

-- Add user_id to support_tickets
ALTER TABLE "support_tickets" ADD COLUMN IF NOT EXISTS "user_id" TEXT;

-- Add user_id to ticket_replies
ALTER TABLE "ticket_replies" ADD COLUMN IF NOT EXISTS "user_id" TEXT;

-- Add user_id to user_comments
ALTER TABLE "user_comments" ADD COLUMN IF NOT EXISTS "user_id" TEXT;

-- Add attempts to sms_codes
ALTER TABLE "sms_codes" ADD COLUMN IF NOT EXISTS "attempts" INTEGER NOT NULL DEFAULT 0;

-- Change advertisements status default to pending
ALTER TABLE "advertisements" ALTER COLUMN "status" SET DEFAULT 'pending';

-- Change shop_ads status default to pending
ALTER TABLE "shop_ads" ALTER COLUMN "status" SET DEFAULT 'pending';

-- Subscriptions table
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

-- Payments table
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

-- User notifications table
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

-- Contact messages table
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

-- File uploads table
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

-- Add foreign key constraints (non-blocking, using IF NOT EXISTS via DO block)
DO $$
BEGIN
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
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auctions_user_id_fkey') THEN
        ALTER TABLE "auctions" ADD CONSTRAINT "auctions_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'auction_bids_user_id_fkey') THEN
        ALTER TABLE "auction_bids" ADD CONSTRAINT "auction_bids_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'shops_user_id_fkey') THEN
        ALTER TABLE "shops" ADD CONSTRAINT "shops_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'support_tickets_user_id_fkey') THEN
        ALTER TABLE "support_tickets" ADD CONSTRAINT "support_tickets_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'ticket_replies_user_id_fkey') THEN
        ALTER TABLE "ticket_replies" ADD CONSTRAINT "ticket_replies_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_comments_user_id_fkey') THEN
        ALTER TABLE "user_comments" ADD CONSTRAINT "user_comments_user_id_fkey"
            FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL;
    END IF;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Constraint creation skipped: %', SQLERRM;
END $$;
