import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { ApiRequest, ApiResponse, Tool, Category, SearchResponse, UpvoteResponse } from './types/api';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'aistart',
  user: process.env.DB_USER || 'aistart',
  password: process.env.DB_PASSWORD || 'supersecret',
  port: parseInt(process.env.DB_PORT || '5432'),
});

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (_req: express.Request, res: express.Response) => {
  res.json({ status: 'ok' });
});

// Get all categories
app.get('/api/categories', async (_req: express.Request, res: express.Response<ApiResponse<Category[]>>) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY name');
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Search tools with filters
app.get('/api/tools/search', async (req: ApiRequest, res: express.Response<ApiResponse<SearchResponse>>) => {
  try {
    const { query, category, sort, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let sqlQuery = `
      SELECT t.*, c.name as category_name, tc.layout_type, tc.card_size, tc.is_featured
      FROM tools t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN tool_cards tc ON t.id = tc.tool_id
      WHERE t.status = 'active'
    `;
    const params: any[] = [];
    let paramCount = 1;

    if (query) {
      sqlQuery += ` AND (
        t.name ILIKE $${paramCount} OR
        t.description ILIKE $${paramCount} OR
        t.tagline ILIKE $${paramCount}
      )`;
      params.push(`%${query}%`);
      paramCount++;
    }

    if (category) {
      sqlQuery += ` AND c.slug = $${paramCount}`;
      params.push(category);
      paramCount++;
    }

    // Get total count
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM (${sqlQuery}) AS count`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    // Add sorting
    switch (sort) {
      case 'recent':
        sqlQuery += ' ORDER BY t.created_at DESC';
        break;
      case 'name':
        sqlQuery += ' ORDER BY t.name ASC';
        break;
      case 'popular':
      default:
        sqlQuery += ' ORDER BY t.upvotes DESC';
    }

    // Add pagination
    sqlQuery += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    params.push(limit, offset);

    const result = await pool.query(sqlQuery, params);

    res.json({
      success: true,
      data: {
        tools: result.rows,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Error searching tools:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get featured tools
app.get('/api/tools/featured', async (_req: express.Request, res: express.Response<ApiResponse<Tool[]>>) => {
  try {
    const result = await pool.query(`
      SELECT t.*, c.name as category_name, tc.layout_type, tc.card_size
      FROM tools t
      LEFT JOIN categories c ON t.category_id = c.id
      LEFT JOIN tool_cards tc ON t.id = tc.tool_id
      WHERE tc.is_featured = true
      ORDER BY t.upvotes DESC
      LIMIT 6
    `);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching featured tools:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get similar tools
app.get('/api/tools/:id/similar', async (req: express.Request<{ id: string }>, res: express.Response<ApiResponse<Tool[]>>) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT t.*, c.name as category_name
      FROM tools t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.category_id = (
        SELECT category_id FROM tools WHERE id = $1
      )
      AND t.id != $1
      ORDER BY t.upvotes DESC
      LIMIT 3
    `, [id]);
    res.json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Error fetching similar tools:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Upvote a tool
app.post('/api/tools/:id/upvote', async (req: express.Request<{ id: string }>, res: express.Response<ApiResponse<UpvoteResponse>>) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      UPDATE tools
      SET upvotes = upvotes + 1
      WHERE id = $1
      RETURNING upvotes
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Tool not found' });
    }

    res.json({
      success: true,
      data: {
        toolId: id,
        upvotes: result.rows[0].upvotes,
      },
    });
  } catch (error) {
    console.error('Error upvoting tool:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`API server running on port ${port}`);
});
