-- APIdex INITIAL SCHEMA
-- Description: Complete backend architecture for API Universe Explorer

-- 0. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. ENUM TYPES
CREATE TYPE pricing_tier AS ENUM ('free', 'freemium', 'paid');
CREATE TYPE auth_type AS ENUM ('none', 'api_key', 'oauth2', 'sdk', 'bearer');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'team');
CREATE TYPE incident_type AS ENUM ('down', 'slow', 'breaking_change');

-- 2. TABLES

-- TABLE: profiles
CREATE TABLE profiles (
  id              UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username        TEXT UNIQUE NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  bio             TEXT,
  website         TEXT,
  plan            subscription_plan DEFAULT 'free',
  razorpay_customer_id       TEXT UNIQUE,
  razorpay_subscription_id   TEXT UNIQUE,
  subscription_status        TEXT,  -- 'active' | 'halted' | 'cancelled' | null
  subscription_end_date      TIMESTAMPTZ,
  bookmark_count  INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- TABLE: api_categories
CREATE TABLE api_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT UNIQUE NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT,
  description TEXT,
  color       TEXT,
  api_count   INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- TABLE: apis
CREATE TABLE apis (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name           TEXT NOT NULL,
  slug           TEXT UNIQUE NOT NULL,
  provider       TEXT NOT NULL,
  category_id    UUID REFERENCES api_categories(id) ON DELETE SET NULL,
  base_url       TEXT NOT NULL,
  auth_type      auth_type NOT NULL DEFAULT 'api_key',
  pricing_tier   pricing_tier NOT NULL DEFAULT 'freemium',
  description    TEXT NOT NULL,
  long_description TEXT,
  docs_url       TEXT NOT NULL,
  affiliate_url  TEXT,
  logo_url       TEXT,
  website_url    TEXT,
  tags           TEXT[],
  has_sandbox    BOOLEAN DEFAULT false,
  is_featured    BOOLEAN DEFAULT false,
  is_verified    BOOLEAN DEFAULT false,
  is_active      BOOLEAN DEFAULT true,
  view_count     INT DEFAULT 0,
  bookmark_count INT DEFAULT 0,
  avg_rating     NUMERIC(3,2) DEFAULT 0,
  review_count   INT DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT now(),
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- TABLE: bookmarks
CREATE TABLE bookmarks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  api_id      UUID REFERENCES apis(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, api_id)
);

-- TABLE: api_reviews
CREATE TABLE api_reviews (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  api_id      UUID REFERENCES apis(id) ON DELETE CASCADE,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT,
  helpful_count INT DEFAULT 0,
  is_verified_user BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, api_id)
);

-- TABLE: api_submissions
CREATE TABLE api_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitter_id    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  submitter_email TEXT NOT NULL,
  api_name        TEXT NOT NULL,
  provider        TEXT NOT NULL,
  website_url     TEXT NOT NULL,
  base_url        TEXT NOT NULL,
  docs_url        TEXT NOT NULL,
  category_id     UUID REFERENCES api_categories(id),
  description     TEXT NOT NULL,
  pricing_tier    pricing_tier,
  auth_type       auth_type,
  reason          TEXT,
  status          submission_status DEFAULT 'pending',
  reviewed_by     UUID REFERENCES profiles(id),
  reviewed_at     TIMESTAMPTZ,
  rejection_note  TEXT,
  razorpay_payment_id TEXT,
  payment_verified BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- TABLE: api_key_vault
CREATE TABLE api_key_vault (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  api_id      UUID REFERENCES apis(id) ON DELETE SET NULL,
  label       TEXT NOT NULL,
  key_value   TEXT NOT NULL, -- encrypted
  notes       TEXT,
  last_used   TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- TABLE: monitored_endpoints
CREATE TABLE monitored_endpoints (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID REFERENCES profiles(id) ON DELETE CASCADE,
  api_id               UUID REFERENCES apis(id) ON DELETE SET NULL,
  endpoint_url         TEXT NOT NULL,
  check_interval_mins  INT DEFAULT 15,
  last_checked         TIMESTAMPTZ,
  last_status          TEXT, -- 'up' | 'down' | 'degraded'
  uptime_percentage    NUMERIC(5,2) DEFAULT 100,
  notify_email         BOOLEAN DEFAULT true,
  is_active            BOOLEAN DEFAULT true,
  created_at           TIMESTAMPTZ DEFAULT now()
);

-- TABLE: monitoring_incidents
CREATE TABLE monitoring_incidents (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  monitored_api_id  UUID REFERENCES monitored_endpoints(id) ON DELETE CASCADE,
  incident_type     incident_type NOT NULL,
  details           TEXT,
  detected_at       TIMESTAMPTZ DEFAULT now(),
  resolved_at       TIMESTAMPTZ,
  notified          BOOLEAN DEFAULT false
);

-- TABLE: newsletter_subscribers
CREATE TABLE newsletter_subscribers (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  confirmed   BOOLEAN DEFAULT false,
  token       TEXT UNIQUE,
  plan        TEXT DEFAULT 'free',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- 3. INDEXES
CREATE INDEX idx_apis_category_id ON apis(category_id);
CREATE INDEX idx_apis_slug ON apis(slug);
CREATE INDEX idx_apis_is_featured ON apis(is_featured);
CREATE INDEX idx_apis_tags ON apis USING GIN (tags);
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_api_id ON bookmarks(api_id);
CREATE INDEX idx_reviews_api_id ON api_reviews(api_id);
CREATE INDEX idx_reviews_user_id ON api_reviews(user_id);

-- 4. TRIGGERS & FUNCTIONS

-- Function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_apis_updated_at BEFORE UPDATE ON apis FOR EACH ROW EXECUTE FUNCTION handle_updated_at();
CREATE TRIGGER set_api_reviews_updated_at BEFORE UPDATE ON api_reviews FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Function to update api_categories.api_count
CREATE OR REPLACE FUNCTION update_category_api_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE api_categories SET api_count = api_count + 1 WHERE id = NEW.category_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE api_categories SET api_count = api_count - 1 WHERE id = OLD.category_id;
  ELSIF (TG_OP = 'UPDATE') THEN
    IF (OLD.category_id IS DISTINCT FROM NEW.category_id) THEN
      UPDATE api_categories SET api_count = api_count - 1 WHERE id = OLD.category_id;
      UPDATE api_categories SET api_count = api_count + 1 WHERE id = NEW.category_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_category_count AFTER INSERT OR DELETE OR UPDATE ON apis FOR EACH ROW EXECUTE FUNCTION update_category_api_count();

-- Function to update apis rating and review count
CREATE OR REPLACE FUNCTION update_api_review_stats()
RETURNS TRIGGER AS $$
DECLARE
  new_avg NUMERIC(3,2);
  new_count INT;
BEGIN
  SELECT AVG(rating)::NUMERIC(3,2), COUNT(*) INTO new_avg, new_count
  FROM api_reviews WHERE api_id = COALESCE(NEW.api_id, OLD.api_id);
  
  UPDATE apis SET avg_rating = COALESCE(new_avg, 0), review_count = new_count 
  WHERE id = COALESCE(NEW.api_id, OLD.api_id);
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_api_reviews AFTER INSERT OR DELETE OR UPDATE ON api_reviews FOR EACH ROW EXECUTE FUNCTION update_api_review_stats();

-- Function to update bookmark counts
CREATE OR REPLACE FUNCTION update_bookmark_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE apis SET bookmark_count = bookmark_count + 1 WHERE id = NEW.api_id;
    UPDATE profiles SET bookmark_count = bookmark_count + 1 WHERE id = NEW.user_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE apis SET bookmark_count = bookmark_count - 1 WHERE id = OLD.api_id;
    UPDATE profiles SET bookmark_count = bookmark_count - 1 WHERE id = OLD.user_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_bookmarks AFTER INSERT OR DELETE ON bookmarks FOR EACH ROW EXECUTE FUNCTION update_bookmark_counts();

-- 5. ROW LEVEL SECURITY (RLS) policies

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_key_vault ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitored_endpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Profiles: Public read, owner update
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Categories: Public read
CREATE POLICY "Categories are viewable by everyone" ON api_categories FOR SELECT USING (true);

-- APIs: Public read
CREATE POLICY "APIs are viewable by everyone" ON apis FOR SELECT USING (true);

-- Bookmarks: Owner read/write
CREATE POLICY "Users can view own bookmarks" ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Reviews: Public read, owner write
CREATE POLICY "Reviews are viewable by everyone" ON api_reviews FOR SELECT USING (true);
CREATE POLICY "Users can create own reviews" ON api_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON api_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON api_reviews FOR DELETE USING (auth.uid() = user_id);

-- Submissions: Owner read own, admin read all
CREATE POLICY "Users can view own submissions" ON api_submissions FOR SELECT USING (auth.uid() = submitter_id);
CREATE POLICY "Users can create submissions" ON api_submissions FOR INSERT WITH CHECK (auth.uid() = submitter_id);

-- Vault: Owner only
CREATE POLICY "Users can view own vault" ON api_key_vault FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own vault" ON api_key_vault FOR ALL USING (auth.uid() = user_id);

-- Monitored: Owner only
CREATE POLICY "Users can view own monitors" ON monitored_endpoints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own monitors" ON monitored_endpoints FOR ALL USING (auth.uid() = user_id);

-- Incidents: Owner only (via join)
CREATE POLICY "Users can view own incidents" ON monitoring_incidents FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM monitored_endpoints 
    WHERE id = monitored_api_id AND user_id = auth.uid()
  )
);

-- Newsletter: Admin only
CREATE POLICY "Admin only read newsletter" ON newsletter_subscribers FOR SELECT USING (false);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_api_views(api_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE apis SET view_count = view_count + 1 WHERE slug = api_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', SPLIT_PART(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
