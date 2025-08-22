export interface ApiResponse<T> {
  data: T;
  error?: string;
  success: boolean;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SearchParams extends PaginationParams {
  query?: string;
  category?: string;
  sort?: 'popular' | 'recent' | 'name';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Tool {
  id: number;
  name: string;
  slug: string;
  url: string;
  description?: string;
  tagline: string;
  category_id: number;
  category?: Category;
  image_url?: string;
  upvotes: number;
  match_score?: number;
  pricing_model: 'free' | 'freemium' | 'paid' | 'contact';
  status: 'active' | 'pending' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface ToolCard {
  id: number;
  tool_id: number;
  layout_type: string;
  card_size: 'small' | 'medium' | 'large';
  display_order: number;
  is_featured: boolean;
  show_upvote_button: boolean;
  show_category_badge: boolean;
  custom_bg_color?: string;
  custom_text_color?: string;
  card_style?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface CreateToolRequest {
  name: string;
  url: string;
  description?: string;
  category_id: number;
  image_url?: string;
  pricing_model?: Tool['pricing_model'];
}

export interface UpdateToolRequest extends Partial<CreateToolRequest> {
  id: number;
}

export interface SearchResponse {
  tools: Tool[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UpvoteResponse {
  success: boolean;
  toolId: string;
  upvotes: number;
}
