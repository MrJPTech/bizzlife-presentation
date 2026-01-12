-- ============================================================
-- BIZZLIFE & PLEASELISTENTOMYMUSIC.COM DATABASE SCHEMA
-- Supabase PostgreSQL Database
-- Version: 1.0.0
-- Last Updated: January 11, 2026
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- CORE TABLES (Shared between both platforms)
-- ============================================================

-- User Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    display_name TEXT,
    avatar_url TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'artist', 'ar_team', 'admin', 'super_admin')),
    bio TEXT,
    website TEXT,
    instagram TEXT,
    twitter TEXT,
    tiktok TEXT,
    youtube TEXT,
    spotify_url TEXT,
    apple_music_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BIZZLIFE.COM TABLES
-- ============================================================

-- Signed Artists (managed by BizzLife)
CREATE TABLE public.artists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id),
    stage_name TEXT NOT NULL,
    real_name TEXT,
    slug TEXT UNIQUE NOT NULL, -- URL-friendly name
    bio TEXT,
    genres TEXT[] DEFAULT '{}',
    profile_image_url TEXT,
    cover_image_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),

    -- Streaming Stats
    spotify_monthly_listeners BIGINT DEFAULT 0,
    apple_music_plays BIGINT DEFAULT 0,
    youtube_subscribers BIGINT DEFAULT 0,
    youtube_total_views BIGINT DEFAULT 0,
    soundcloud_plays BIGINT DEFAULT 0,
    tiktok_followers BIGINT DEFAULT 0,
    instagram_followers BIGINT DEFAULT 0,

    -- Billboard/Chart Data
    highest_billboard_position INTEGER,
    billboard_chart_name TEXT,
    total_placements INTEGER DEFAULT 0,

    -- Contract Info
    contract_signed_date DATE,
    contract_end_date DATE,
    management_percentage DECIMAL(5,2) DEFAULT 20.00,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artist Tracks/Singles
CREATE TABLE public.artist_tracks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES public.artists(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    release_date DATE,
    cover_art_url TEXT,
    youtube_url TEXT,
    spotify_url TEXT,
    apple_music_url TEXT,
    soundcloud_url TEXT,
    stream_count BIGINT DEFAULT 0,
    featured_track BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Studios
CREATE TABLE public.studios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT NOT NULL,
    state TEXT,
    zip_code TEXT,
    phone TEXT,
    email TEXT,
    image_url TEXT,
    gallery_urls TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL(10,2),
    amenities TEXT[] DEFAULT '{}',
    engineers TEXT[] DEFAULT '{}',
    booking_url TEXT,
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Partner Venues
CREATE TABLE public.venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    address TEXT,
    city TEXT NOT NULL,
    state TEXT,
    capacity INTEGER,
    venue_type TEXT CHECK (venue_type IN ('club', 'bar', 'arena', 'festival', 'other')),
    image_url TEXT,
    website TEXT,
    booking_email TEXT,
    booking_phone TEXT,
    partnership_level TEXT DEFAULT 'standard' CHECK (partnership_level IN ('standard', 'preferred', 'exclusive')),
    featured BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Creator Network (FoodGod, Supreme Patty, etc.)
CREATE TABLE public.creator_network (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    platform TEXT NOT NULL, -- Instagram, YouTube, TikTok
    handle TEXT NOT NULL,
    follower_count BIGINT,
    profile_image_url TEXT,
    category TEXT, -- Food, Comedy, Music, Lifestyle
    collaboration_type TEXT[] DEFAULT '{}', -- Features, Promos, Events
    contact_email TEXT,
    notes TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PLEASELISTENTOMYMUSIC.COM TABLES
-- ============================================================

-- Submission Tiers/Pricing
CREATE TABLE public.submission_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL, -- Basic, Feedback, Priority, Premium
    slug TEXT UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    features JSONB DEFAULT '[]',
    max_track_duration INTEGER DEFAULT 180, -- seconds
    includes_feedback BOOLEAN DEFAULT FALSE,
    includes_meeting BOOLEAN DEFAULT FALSE,
    includes_offer_letter BOOLEAN DEFAULT FALSE,
    priority_level INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Music Submissions
CREATE TABLE public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submitter_id UUID REFERENCES public.profiles(id),
    tier_id UUID REFERENCES public.submission_tiers(id),

    -- Track Info
    track_title TEXT NOT NULL,
    artist_name TEXT NOT NULL,
    genre TEXT NOT NULL,
    subgenres TEXT[] DEFAULT '{}',
    duration INTEGER, -- seconds
    bpm INTEGER,
    track_url TEXT NOT NULL, -- Supabase storage URL
    cover_art_url TEXT,

    -- Submitter Info (cached for review)
    submitter_email TEXT NOT NULL,
    submitter_phone TEXT,
    submitter_instagram TEXT,
    submitter_spotify TEXT,
    submitter_youtube TEXT,
    submitter_city TEXT,
    submitter_state TEXT,

    -- Review Status
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
        'pending', 'in_review', 'reviewed', 'passed', 'declined', 'meeting_scheduled', 'offer_sent', 'signed'
    )),

    -- Assignment
    assigned_ar_id UUID REFERENCES public.profiles(id),
    assigned_at TIMESTAMPTZ,

    -- Payment
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'refunded')),
    payment_intent_id TEXT, -- Stripe payment intent
    amount_paid DECIMAL(10,2),

    -- Timestamps
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- A&R Teams (Genre-specific review teams)
CREATE TABLE public.ar_teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    genres TEXT[] NOT NULL, -- Genres this team reviews
    lead_id UUID REFERENCES public.profiles(id),
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A&R Team Members
CREATE TABLE public.ar_team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES public.ar_teams(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('member', 'lead', 'admin')),
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(team_id, profile_id)
);

-- Feedback Reports
CREATE TABLE public.feedback_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES public.submissions(id) ON DELETE CASCADE,
    reviewer_id UUID REFERENCES public.profiles(id),

    -- Scores (1-10)
    production_quality INTEGER CHECK (production_quality BETWEEN 1 AND 10),
    vocal_performance INTEGER CHECK (vocal_performance BETWEEN 1 AND 10),
    songwriting INTEGER CHECK (songwriting BETWEEN 1 AND 10),
    originality INTEGER CHECK (originality BETWEEN 1 AND 10),
    commercial_potential INTEGER CHECK (commercial_potential BETWEEN 1 AND 10),
    overall_score INTEGER CHECK (overall_score BETWEEN 1 AND 10),

    -- Written Feedback
    strengths TEXT,
    areas_for_improvement TEXT,
    production_notes TEXT,
    marketing_suggestions TEXT,
    comparable_artists TEXT[],

    -- Recommendation
    recommendation TEXT CHECK (recommendation IN ('pass', 'consider', 'strong_consider', 'sign')),
    recommendation_notes TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI-Generated Offer Letters
CREATE TABLE public.offer_letters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES public.submissions(id),
    artist_profile_id UUID REFERENCES public.profiles(id),

    -- Offer Details
    offer_type TEXT NOT NULL, -- 'management', 'distribution', 'full_service'
    advance_amount DECIMAL(10,2),
    royalty_percentage DECIMAL(5,2),
    term_months INTEGER,
    territory TEXT DEFAULT 'Worldwide',

    -- Generated Content
    letter_content TEXT NOT NULL, -- AI-generated offer letter
    terms_summary JSONB,

    -- Status
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'accepted', 'declined', 'expired')),
    sent_at TIMESTAMPTZ,
    viewed_at TIMESTAMPTZ,
    response_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,

    -- E-signature (DocuSign/PandaDoc integration)
    envelope_id TEXT,
    signed_document_url TEXT,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- MERCHANDISE & DROPSHIPPING TABLES
-- ============================================================

-- Artist Merch Products
CREATE TABLE public.merch_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    artist_id UUID REFERENCES public.artists(id),
    name TEXT NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    artist_margin DECIMAL(10,2),
    product_type TEXT NOT NULL, -- shirt, hoodie, hat, poster, vinyl

    -- Printful/POD Integration
    printful_product_id TEXT,
    printful_variant_id TEXT,

    -- Product Details
    images TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',

    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SPONSORSHIP TABLES
-- ============================================================

-- Sponsorship Opportunities
CREATE TABLE public.sponsorships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sponsor_company TEXT,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,

    -- Deal Info
    sponsorship_type TEXT, -- event, artist, tour, content
    budget_range TEXT,
    start_date DATE,
    end_date DATE,

    -- Status
    status TEXT DEFAULT 'prospect' CHECK (status IN ('prospect', 'negotiating', 'active', 'completed', 'declined')),

    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ACTIVITY & AUDIT TABLES
-- ============================================================

-- Activity Log
CREATE TABLE public.activity_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    entity_type TEXT, -- submission, artist, offer, etc.
    entity_id UUID,
    metadata JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SEED DATA: Submission Tiers
-- ============================================================

INSERT INTO public.submission_tiers (name, slug, price, description, features, max_track_duration, includes_feedback, includes_meeting, includes_offer_letter, priority_level) VALUES
('Basic Review', 'basic', 5.00, 'Get your music heard by our A&R team',
 '["3 minutes max", "Genre-matched review", "7-day response time"]'::jsonb,
 180, FALSE, FALSE, FALSE, 0),

('Feedback Package', 'feedback', 25.00, 'Detailed feedback report with actionable insights',
 '["3 minutes max", "Detailed score breakdown", "Written feedback", "Comparable artist suggestions", "5-day response time"]'::jsonb,
 180, TRUE, FALSE, FALSE, 1),

('Priority Review', 'priority', 75.00, 'Fast-track your submission with senior A&R review',
 '["5 minutes max", "Senior A&R review", "Detailed feedback", "48-hour response time", "Direct communication"]'::jsonb,
 300, TRUE, FALSE, FALSE, 2),

('Premium Package', 'premium', 150.00, 'Full consideration with meeting and potential offer',
 '["5 minutes max", "Executive A&R review", "Comprehensive feedback", "Video call meeting", "Potential offer letter", "24-hour initial response"]'::jsonb,
 300, TRUE, TRUE, TRUE, 3);

-- ============================================================
-- SEED DATA: Partner Venues
-- ============================================================

INSERT INTO public.venues (name, slug, city, state, venue_type, partnership_level) VALUES
('Varsity Tavern', 'varsity-tavern', 'Dallas', 'TX', 'bar', 'preferred'),
('Rodeo Ranch', 'rodeo-ranch', 'Dallas', 'TX', 'club', 'exclusive'),
('The Sterling', 'the-sterling', 'Dallas', 'TX', 'club', 'preferred');

-- ============================================================
-- SEED DATA: Creator Network
-- ============================================================

INSERT INTO public.creator_network (name, platform, handle, category, collaboration_type) VALUES
('FoodGod', 'Instagram', '@foodgod', 'Food/Lifestyle', '{"Features", "Promos", "Events"}'),
('Supreme Patty', 'Instagram', '@supremepatty', 'Comedy/Lifestyle', '{"Features", "Promos", "Music Videos"}'),
('Charleston White', 'YouTube', '@charlestonwhite', 'Commentary', '{"Features", "Promos"}'),
('2K Baby', 'Instagram', '@2kbaby', 'Music', '{"Collaborations", "Features"}');

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offer_letters ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Artists: Public read, admin write
CREATE POLICY "Artists are viewable by everyone"
ON public.artists FOR SELECT USING (true);

CREATE POLICY "Only admins can modify artists"
ON public.artists FOR ALL USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
);

-- Submissions: Users see own, A&R team sees assigned
CREATE POLICY "Users can view own submissions"
ON public.submissions FOR SELECT USING (
    submitter_id = auth.uid()
    OR assigned_ar_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('ar_team', 'admin', 'super_admin')
    )
);

CREATE POLICY "Users can create submissions"
ON public.submissions FOR INSERT WITH CHECK (submitter_id = auth.uid());

-- Feedback: Submitter can view their feedback
CREATE POLICY "Users can view feedback on their submissions"
ON public.feedback_reports FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.submissions
        WHERE submissions.id = feedback_reports.submission_id
        AND submissions.submitter_id = auth.uid()
    )
    OR reviewer_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('ar_team', 'admin', 'super_admin')
    )
);

-- Offer Letters: Artist can view their offers
CREATE POLICY "Users can view their offer letters"
ON public.offer_letters FOR SELECT USING (
    artist_profile_id = auth.uid()
    OR EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    )
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_artists_updated_at
    BEFORE UPDATE ON public.artists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at
    BEFORE UPDATE ON public.submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

CREATE INDEX idx_artists_slug ON public.artists(slug);
CREATE INDEX idx_artists_featured ON public.artists(featured) WHERE featured = TRUE;
CREATE INDEX idx_submissions_status ON public.submissions(status);
CREATE INDEX idx_submissions_submitter ON public.submissions(submitter_id);
CREATE INDEX idx_submissions_assigned ON public.submissions(assigned_ar_id);
CREATE INDEX idx_activity_log_user ON public.activity_log(user_id);
CREATE INDEX idx_activity_log_entity ON public.activity_log(entity_type, entity_id);
