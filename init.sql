-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create enum types
CREATE TYPE tool_status AS ENUM ('active', 'pending', 'archived');
CREATE TYPE pricing_model AS ENUM ('free', 'freemium', 'paid', 'contact');

-- Create the categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for categories
CREATE TRIGGER update_categories_modtime
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create the tools table
CREATE TABLE tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    url VARCHAR(2048) NOT NULL,
    description TEXT,
    tagline VARCHAR(280),
    category_id INTEGER REFERENCES categories(id),
    pricing_model pricing_model DEFAULT 'free',
    status tool_status DEFAULT 'pending',
    upvotes INTEGER DEFAULT 0,
    match_score FLOAT,
    image_url VARCHAR(2048),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for tools
CREATE TRIGGER update_tools_modtime
    BEFORE UPDATE ON tools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create the tool_cards table
CREATE TABLE tool_cards (
    id SERIAL PRIMARY KEY,
    tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
    layout_type VARCHAR(50) DEFAULT 'default',
    card_size VARCHAR(50) DEFAULT 'medium',
    display_order INTEGER,
    is_featured BOOLEAN DEFAULT false,
    show_upvote_button BOOLEAN DEFAULT true,
    show_category_badge BOOLEAN DEFAULT true,
    custom_bg_color VARCHAR(50),
    custom_text_color VARCHAR(50),
    card_style JSONB,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for tool_cards
CREATE INDEX idx_tool_cards_tool_id ON tool_cards(tool_id);
CREATE INDEX idx_tool_cards_featured ON tool_cards(is_featured);
CREATE INDEX idx_tool_cards_display_order ON tool_cards(display_order);

-- Create trigger for tool_cards
CREATE TRIGGER update_tool_cards_modtime
    BEFORE UPDATE ON tool_cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
    embedding vector(384), -- OpenAI text-embedding-ada-002 dimensions
    image_url VARCHAR(2048),
    upvotes INTEGER DEFAULT 0,
    rating_avg DECIMAL(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create the reviews table
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tool_id, user_id)
);

-- Create the upvotes table
CREATE TABLE upvotes (
    id SERIAL PRIMARY KEY,
    tool_id INTEGER REFERENCES tools(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tool_id, user_id)
);

-- Create indexes for performance
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_created_at ON tools(created_at);
CREATE INDEX idx_reviews_tool_id ON reviews(tool_id);
CREATE INDEX idx_upvotes_tool_id ON upvotes(tool_id);
CREATE INDEX idx_tools_embedding ON tools USING ivfflat (embedding vector_cosine_ops);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_tools_updated_at
    BEFORE UPDATE ON tools
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update tool ratings
CREATE OR REPLACE FUNCTION update_tool_ratings()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tools
    SET 
        rating_avg = (
            SELECT AVG(rating)::DECIMAL(3,2)
            FROM reviews
            WHERE tool_id = NEW.tool_id
        ),
        rating_count = (
            SELECT COUNT(*)
            FROM reviews
            WHERE tool_id = NEW.tool_id
        )
    WHERE id = NEW.tool_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating tool ratings
CREATE TRIGGER update_tool_ratings_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_tool_ratings();

-- Function to update tool upvotes count
CREATE OR REPLACE FUNCTION update_tool_upvotes()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tools
    SET upvotes = (
        SELECT COUNT(*)
        FROM upvotes
        WHERE tool_id = NEW.tool_id
    )
    WHERE id = NEW.tool_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updating tool upvotes
CREATE TRIGGER update_tool_upvotes_trigger
    AFTER INSERT OR DELETE ON upvotes
    FOR EACH ROW
    EXECUTE FUNCTION update_tool_upvotes();
