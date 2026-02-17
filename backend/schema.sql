-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Enable PostGIS for geospatial queries
CREATE EXTENSION IF NOT EXISTS "postgis";

-- ENUMs
CREATE TYPE user_role AS ENUM ('CLIENT', 'PROVIDER');
CREATE TYPE subscription_status AS ENUM ('ACTIVE', 'CANCELED', 'PAST_DUE');
CREATE TYPE payment_status AS ENUM ('PAID', 'FAILED', 'PENDING');
CREATE TYPE plan_interval AS ENUM ('MONTHLY', 'YEARLY');

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Plans Table (Monetization Core)
CREATE TABLE plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL, -- 'Basic', 'Pro', 'Vip'
    price DECIMAL(10, 2) NOT NULL,
    interval plan_interval DEFAULT 'MONTHLY',
    features JSONB NOT NULL,
    -- Store Product IDs
    google_product_id VARCHAR(100), -- 'com.servicoperto.pro_monthly'
    apple_product_id VARCHAR(100), -- 'com.servicoperto.pro_monthly'
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Providers Table (Linked 1:1 with Users)
CREATE TABLE providers (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    service_type VARCHAR(50) NOT NULL,
    neighborhood VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    description TEXT,
    photo_url VARCHAR(255),
    rating_avg DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    -- Monetization fields
    is_verified BOOLEAN DEFAULT FALSE, -- Granted by Premium plans
    ranking_score INTEGER DEFAULT 0, -- Boosted by Premium plans
    -- Geolocation
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions Table
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES providers(user_id),
    plan_id UUID NOT NULL REFERENCES plans(id),
    status subscription_status DEFAULT 'ACTIVE',
    current_period_start TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    platform VARCHAR(20) DEFAULT 'WEB', -- 'WEB', 'GOOGLE', 'APPLE'
    external_subscription_id VARCHAR(255), -- ID from Payment Gateway or Store Purchase Token
    original_transaction_id VARCHAR(255), -- For Apple/Google receipt chaining
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments History
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id UUID REFERENCES subscriptions(id),
    amount DECIMAL(10, 2) NOT NULL,
    status payment_status DEFAULT 'PENDING',
    external_payment_id VARCHAR(255), -- Transaction ID from Gateway
    payment_method VARCHAR(50), -- 'credit_card', 'pix', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES users(id),
    provider_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_providers_service_neighborhood ON providers(service_type, neighborhood);
CREATE INDEX idx_subscriptions_provider ON subscriptions(provider_id);
CREATE INDEX idx_payments_subscription ON payments(subscription_id);

-- Pre-registration (Leads) Table
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100), -- Optional for clients, required for providers
    whatsapp VARCHAR(20) NOT NULL,
    type VARCHAR(20) NOT NULL, -- 'CLIENT' or 'PROVIDER'
    specialty VARCHAR(50), -- Only for providers
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Plans (Example Data)
INSERT INTO plans (name, price, features) VALUES
('Gratuito', 0.00, '{"whatsapp_direct": false, "featured": false, "photos_limit": 1}'),
('Profissional', 49.90, '{"whatsapp_direct": true, "featured": true, "photos_limit": 10, "verified_badge": true}'),
('Premium', 99.90, '{"whatsapp_direct": true, "featured": true, "photos_limit": 50, "verified_badge": true, "ranking_boost": true}');
