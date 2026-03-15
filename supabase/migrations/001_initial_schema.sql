-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE auth_type AS ENUM ('None', 'API Key', 'OAuth2', 'SDK');
CREATE TYPE pricing_tier AS ENUM ('Free', 'Freemium', 'Paid');
CREATE TYPE subscription_status AS ENUM ('free', 'pro', 'cancelled');

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_status subscription_status DEFAULT 'free',
  razorpay_customer_id TEXT UNIQUE,
  razorpay_subscription_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- API Categories table
CREATE TABLE api_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- APIs table
CREATE TABLE apis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  category_id UUID REFERENCES api_categories(id),
  base_url TEXT NOT NULL,
  auth_type auth_type NOT NULL,
  pricing_tier pricing_tier NOT NULL,
  description TEXT NOT NULL,
  docs_url TEXT NOT NULL,
  use_cases TEXT[],
  is_verified BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  api_id UUID REFERENCES apis(id) ON DELETE CASCADE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, api_id)
);

-- API Reviews table
CREATE TABLE api_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  api_id UUID REFERENCES apis(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- API Submissions table
CREATE TABLE api_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  provider TEXT NOT NULL,
  category_suggestion TEXT,
  base_url TEXT NOT NULL,
  auth_type auth_type NOT NULL,
  pricing_tier pricing_tier NOT NULL,
  description TEXT NOT NULL,
  docs_url TEXT NOT NULL,
  use_cases TEXT[],
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_apis_category ON apis(category_id);
CREATE INDEX idx_apis_name ON apis(name);
CREATE INDEX idx_apis_pricing ON apis(pricing_tier);
CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_api ON bookmarks(api_id);
CREATE INDEX idx_reviews_api ON api_reviews(api_id);
CREATE INDEX idx_submissions_status ON api_submissions(status);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE apis ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_submissions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- RLS Policies for api_categories (public read)
CREATE POLICY "Anyone can view categories"
  ON api_categories FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for apis (public read, authenticated insert/update)
CREATE POLICY "Anyone can view APIs"
  ON apis FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert APIs"
  ON apis FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update APIs"
  ON apis FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for reviews
CREATE POLICY "Anyone can view approved reviews"
  ON api_reviews FOR SELECT
  TO authenticated
  USING (is_approved = true OR user_id = auth.uid());

CREATE POLICY "Authenticated users can create reviews"
  ON api_reviews FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own reviews"
  ON api_reviews FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for submissions
CREATE POLICY "Users can view own submissions"
  ON api_submissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR auth.jwt()->>'role' = 'admin');

CREATE POLICY "Authenticated users can submit APIs"
  ON api_submissions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Function to handle updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_apis_updated_at
  BEFORE UPDATE ON apis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_reviews_updated_at
  BEFORE UPDATE ON api_reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default categories
INSERT INTO api_categories (name, description, icon, color) VALUES
('AI', 'Artificial Intelligence and Machine Learning APIs', '🤖', '#22d3ee'),
('Weather', 'Weather and climate data APIs', '🌤️', '#4ade80'),
('Maps', 'Mapping, geolocation, and GIS APIs', '🗺️', '#fbbf24'),
('Finance', 'Financial, banking, and cryptocurrency APIs', '💰', '#a78bfa'),
('Auth', 'Authentication and authorization services', '🔐', '#fb7185'),
('Media', 'Images, videos, music, and media APIs', '📸', '#c084fc'),
('Comms', 'Communication APIs - SMS, Email, Voice', '📞', '#2dd4bf'),
('Dev Tools', 'Developer tools and utilities', '🔧', '#f472b6'),
('Public Data', 'Government and public datasets', '🌍', '#4ade80'),
('Health', 'Health, medical, and fitness APIs', '💊', '#fb7185'),
('Entertainment', 'Movies, games, TV, and entertainment', '🎬', '#a78bfa'),
('Commerce', 'E-commerce, payments, and shipping', '🛍️', '#fbbf24');
