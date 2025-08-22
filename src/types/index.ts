export interface Tool {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  url: string;
  category: string;
  image_url?: string;
  matchScore?: number;
  upvotes: number;
}

export interface FilterState {
  category?: string;
  sort: 'popular' | 'name' | 'recent';
  query: string;
  page: number;
  limit: number;
}
