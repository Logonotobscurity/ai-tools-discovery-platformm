import json
import psycopg2
from sentence_transformers import SentenceTransformer
from psycopg2.extras import execute_values
import uuid
from datetime import datetime
import pandas as pd

# Database connection
conn = psycopg2.connect(
    host="localhost",
    dbname="aistart",
    user="aistart",
    password="supersecret"
)
cur = conn.cursor()

# Load the sentence transformer model
model = SentenceTransformer("all-MiniLM-L6-v2")

# Read the JSON file
with open("src/data/all-tools.json", "r", encoding="utf-8") as f:
    tools = json.load(f)

# First, insert categories
categories = set()
for tool in tools:
    if 'category' in tool:
        categories.add(tool['category'])

for category in categories:
    cur.execute(
        """
        INSERT INTO categories (name, slug, description)
        VALUES (%s, %s, %s)
        ON CONFLICT (name) DO NOTHING
        """,
        (category, category.lower().replace(' ', '-'), f"Tools related to {category}")
    )
conn.commit()

# Get category IDs
cur.execute("SELECT name, id FROM categories")
category_map = dict(cur.fetchall())

# Process and insert tools
for tool in tools:
    # Generate embedding for the description
    description = tool.get('description', '')
    embedding = model.encode(description).tolist() if description else None
    
    # Get category ID
    category_id = category_map.get(tool.get('category'))
    
    # Clean and prepare the data
    name = tool.get('name', '')
    slug = name.lower().replace(' ', '-')
    url = tool.get('url', '')
    tagline = description[:280] if description else ''  # Use first 280 chars as tagline
    image_url = tool.get('image_url')
    
    cur.execute(
        """
        INSERT INTO tools (
            name,
            slug,
            url,
            description,
            tagline,
            category_id,
            image_url,
            upvotes,
            match_score,
            status,
            created_at,
            updated_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (slug) DO UPDATE SET
            url = EXCLUDED.url,
            description = EXCLUDED.description,
            tagline = EXCLUDED.tagline,
            category_id = EXCLUDED.category_id,
            image_url = EXCLUDED.image_url,
            updated_at = CURRENT_TIMESTAMP
        RETURNING id;
        """,
        (
            name,
            slug,
            url,
            description,
            tagline,
            category_id,
            image_url,
            0,  # Initial upvotes
            0.0,  # Initial match_score
            'active',  # Default status
            datetime.now(),
            datetime.now()
        )
    )
    
    tool_id = cur.fetchone()[0]
    
    # Create default tool card
    cur.execute(
        """
        INSERT INTO tool_cards (
            tool_id,
            layout_type,
            card_size,
            display_order,
            is_featured,
            show_upvote_button,
            show_category_badge,
            created_at,
            updated_at
        )
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT DO NOTHING;
        """,
        (
            tool_id,
            'default',
            'medium',
            0,  # Default display order
            False,  # Not featured by default
            True,  # Show upvote button
            True,  # Show category badge
            datetime.now(),
            datetime.now()
        )
    )
    
    conn.commit()

cur.close()
conn.close()
print("Data import completed successfully!")
