import { ApiResponse, CreateToolRequest, SearchParams, SearchResponse, Tool, UpdateToolRequest, UpvoteResponse } from './types';

const baseUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3000/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
  if (!response.ok) {
    throw new ApiError(response.status, await response.text());
  }
  return response.json();
}

export async function searchTools(params: SearchParams): Promise<SearchResponse> {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value.toString());
  });
  
  const response = await fetch(`${baseUrl}/tools/search?${queryParams}`);
  return handleResponse<SearchResponse>(response).then(res => res.data);
}

export async function getTool(slug: string): Promise<Tool> {
  const response = await fetch(`${baseUrl}/tools/${slug}`);
  return handleResponse<Tool>(response).then(res => res.data);
}

export async function createTool(data: CreateToolRequest): Promise<Tool> {
  const response = await fetch(`${baseUrl}/tools`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Tool>(response).then(res => res.data);
}

export async function updateTool(data: UpdateToolRequest): Promise<Tool> {
  const response = await fetch(`${baseUrl}/tools/${data.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse<Tool>(response).then(res => res.data);
}

export async function upvoteTool(toolId: string): Promise<UpvoteResponse> {
  const response = await fetch(`${baseUrl}/tools/${toolId}/upvote`, {
    method: 'POST',
  });
  return handleResponse<UpvoteResponse>(response).then(res => res.data);
}

export async function getCategories(): Promise<string[]> {
  const response = await fetch(`${baseUrl}/categories`);
  return handleResponse<string[]>(response).then(res => res.data);
}

export async function getSimilarTools(toolId: string): Promise<Tool[]> {
  const response = await fetch(`${baseUrl}/tools/${toolId}/similar`);
  return handleResponse<Tool[]>(response).then(res => res.data);
}

export async function getFeaturedTools(): Promise<Tool[]> {
  const response = await fetch(`${baseUrl}/tools/featured`);
  return handleResponse<Tool[]>(response).then(res => res.data);
}
