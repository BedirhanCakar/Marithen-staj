-- 1. ENUM TYPES
CREATE TYPE content_status AS ENUM (
  'draft', 
  'pending_approval', 
  'approved', 
  'scheduled', 
  'published', 
  'failed', 
  'cancelled'
);

CREATE TYPE social_platform AS ENUM (
  'instagram', 
  'facebook', 
  'linkedin', 
  'x', 
  'tiktok', 
  'youtube'
);

CREATE TYPE content_type AS ENUM (
  'post', 
  'story', 
  'reel', 
  'video', 
  'article', 
  'thread'
);

CREATE TYPE account_status AS ENUM (
  'active', 
  'inactive', 
  'disconnected'
);

CREATE TYPE file_type AS ENUM (
  'jpg', 
  'png', 
  'webp', 
  'mp4', 
  'pdf'
);

CREATE TYPE notification_type AS ENUM (
  'publish_success', 
  'publish_failed', 
  'upcoming_content', 
  'daily_report'
);

-- 2. TABLES

-- users
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- customers
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  company text,
  notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- brands
CREATE TABLE brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  website text,
  industry text,
  brand_tone text,
  target_audience text,
  logo_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- social_accounts
CREATE TABLE social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform social_platform NOT NULL,
  username text NOT NULL,
  profile_url text,
  status account_status DEFAULT 'active' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- uploads
CREATE TABLE uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  file_type file_type NOT NULL,
  file_size bigint,
  storage_path text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- contents
CREATE TABLE contents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  brand_id uuid NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  social_account_id uuid REFERENCES social_accounts(id) ON DELETE SET NULL,
  upload_id uuid REFERENCES uploads(id) ON DELETE SET NULL,
  title text NOT NULL,
  body text NOT NULL,
  platform social_platform NOT NULL,
  content_type content_type NOT NULL,
  status content_status DEFAULT 'draft' NOT NULL,
  hashtags text[],
  scheduled_at timestamptz,
  published_at timestamptz,
  failure_reason text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- notifications
CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id uuid REFERENCES contents(id) ON DELETE SET NULL,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  is_read boolean DEFAULT false NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- activity_logs
CREATE TABLE activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  action text NOT NULL,
  metadata jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- 3. INDEXES
CREATE INDEX idx_contents_user_id ON contents (user_id);
CREATE INDEX idx_contents_brand_id ON contents (brand_id);
CREATE INDEX idx_contents_status ON contents (status);
CREATE INDEX idx_contents_scheduled_at ON contents (scheduled_at);
CREATE INDEX idx_contents_platform ON contents (platform);

CREATE INDEX idx_activity_logs_user_id ON activity_logs (user_id);
CREATE INDEX idx_activity_logs_entity_type ON activity_logs (entity_type);
CREATE INDEX idx_activity_logs_created_at ON activity_logs (created_at);

CREATE INDEX idx_notifications_user_id ON notifications (user_id);
CREATE INDEX idx_notifications_is_read ON notifications (is_read);

-- 4. AUTOMATIC UPDATE FOR updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_social_accounts_updated_at
  BEFORE UPDATE ON social_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_contents_updated_at
  BEFORE UPDATE ON contents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Users policies (using 'id' as user identifier)
CREATE POLICY select_users_policy ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY insert_users_policy ON users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY update_users_policy ON users FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY delete_users_policy ON users FOR DELETE USING (auth.uid() = id);

-- Customers policies
CREATE POLICY select_customers_policy ON customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_customers_policy ON customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_customers_policy ON customers FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY delete_customers_policy ON customers FOR DELETE USING (auth.uid() = user_id);

-- Brands policies
CREATE POLICY select_brands_policy ON brands FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_brands_policy ON brands FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_brands_policy ON brands FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY delete_brands_policy ON brands FOR DELETE USING (auth.uid() = user_id);

-- Social accounts policies
CREATE POLICY select_social_accounts_policy ON social_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_social_accounts_policy ON social_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_social_accounts_policy ON social_accounts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY delete_social_accounts_policy ON social_accounts FOR DELETE USING (auth.uid() = user_id);

-- Uploads policies
CREATE POLICY select_uploads_policy ON uploads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_uploads_policy ON uploads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_uploads_policy ON uploads FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY delete_uploads_policy ON uploads FOR DELETE USING (auth.uid() = user_id);

-- Contents policies
CREATE POLICY select_contents_policy ON contents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_contents_policy ON contents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_contents_policy ON contents FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY delete_contents_policy ON contents FOR DELETE USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY select_notifications_policy ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_notifications_policy ON notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_notifications_policy ON notifications FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY delete_notifications_policy ON notifications FOR DELETE USING (auth.uid() = user_id);

-- Activity logs policies
CREATE POLICY select_activity_logs_policy ON activity_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY insert_activity_logs_policy ON activity_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY update_activity_logs_policy ON activity_logs FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY delete_activity_logs_policy ON activity_logs FOR DELETE USING (auth.uid() = user_id);

-- 6. REALTIME
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE contents;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
