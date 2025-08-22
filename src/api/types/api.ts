import { Request, Response } from 'express';

export interface ApiRequest extends Request {
  query: {
    query?: string;
    category?: string;
    sort?: 'popular' | 'recent' | 'name';
    page?: string;
    limit?: string;
  };
}

export interface ApiResponse<T> extends Response {
  json: (body: {
    success: boolean;
    data?: T;
    error?: string;
  }) => void;
}

export interface Tool {
  id: number;
  name: string;
  slug: string;
  url: string;
  description?: string;
  tagline: string;
  category_id: number;
  category_name?: string;
  image_url?: string;
  upvotes: number;
  match_score?: number;
  pricing_model: string;
  status: string;
  created_at: string;
  updated_at: string;
  layout_type?: string;
  card_size?: string;
  is_featured?: boolean;
}

export interface SearchResponse {
  tools: Tool[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface UpvoteResponse {
  toolId: string;
  upvotes: number;
}
