import { Tool } from '@/types';
import allToolsData from './all-tools.json';
import { slugify } from '@/lib/utils';
import { ToolsSchema } from '../schemas/tool-schema';

const toTitleCase = (str: string) => {
  if (!str) return '';
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

// Modified processRawTools with deterministic defaults
export const processRawTools = (rawTools: any[], options: { addMockData?: boolean } = {}) => {
  const addMockData = options.addMockData === true;
  if (!Array.isArray(rawTools)) {
    console.error("Uploaded data is not an array:", rawTools);
    return [];
  }
  return rawTools.map((tool: any, index: number) => {
    let name = tool.name || tool['#untitled--2'] || '';
    let url = tool.url || tool['#untitled--6'] || '';
    let description = tool.description || tool['#untitled--3'] || '';
    let category = tool.category || tool['#untitled--4'] || 'Uncategorized';
    let image_url = tool.image_url || tool['#untitled'];

    // Data cleaning for common inconsistencies
    if (typeof url !== 'string' || !url.startsWith('http')) {
      if (typeof description === 'string' && description.startsWith('http')) {
        [url, description] = [description, url];
      } else if (typeof category === 'string' && category.startsWith('http')) {
        [url, category] = [category, url];
      }
    }
    
    if (typeof name !== 'string' || (name.includes('.') && !name.includes(' '))) {
       if (typeof url === 'string' && !url.startsWith('http')) {
          [name, url] = [url, name];
       }
    }

    if (!name || typeof name !== 'string' || !url || typeof url !== 'string' || !url.startsWith('http')) {
      return null;
    }

    const cleanedCategory = category.replace(/[\u{1F600}-\u{1F64F}]/gu, '')
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, '')
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, '')
      .replace(/[\u{2600}-\u{26FF}]/gu, '')
      .replace(/[\u{2700}-\u{27BF}]/gu, '')
      .replace(/[^\w\s&]/gi, '')
      .trim();

    const finalCategory = toTitleCase(cleanedCategory) || 'Uncategorized';
    
    // Deterministic fallback values
    const parsedUpvotes = parseInt(tool.upvotes || tool['#untitled--3'] || '') || 0;
    const upvotes = addMockData ? (parsedUpvotes || Math.floor(Math.random() * 2000) + 100) : parsedUpvotes;
    const matchScore = addMockData ? Math.random() : 0.5;
    
    return {
      id: slugify(`${name}-${index}`),
      name,
      slug: slugify(name),
      url,
      description: description || 'No description available.',
      tagline: tool.tagline || (description ? description.substring(0, 100) : name),
      category: finalCategory,
      image_url: image_url && typeof image_url === 'string' && image_url.startsWith('https') ? image_url : undefined,
      upvotes,
      matchScore,
    };
  }).filter((tool): tool is NonNullable<typeof tool> => tool !== null);
};


export const allTools: Tool[] = processRawTools(allToolsData as any[]);

export const processUploadedJson = (jsonText: string): Tool[] => {
  try {
    const rawData = JSON.parse(jsonText);
    return processRawTools(rawData);
  } catch (e) {
    console.error("JSON parsing error:", e);
    throw new Error("Invalid JSON format.");
  }
};

export const validateTools = (tools: any) => {
  try {
    return ToolsSchema.parse(tools);
  } catch (error) {
    console.error('Tool validation failed:', error);
    throw error;
  }
};

// Example usage in fetchPaginatedTools
export const fetchPaginatedTools = async (page: number, limit: number) => {
  const response = await fetch(`/api/tools?page=${page}&limit=${limit}`);
  const data = await response.json();

  // Validate the tools data
  return validateTools(data);
};

// Migrate all tools framework into schema validation
export const getAllTools = async () => {
  const response = await fetch('/api/tools');
  const data = await response.json();

  // Validate the tools data
  return validateTools(data);
};

export const getCategories = (tools: Tool[]): string[] => {
  const categories = new Set<string>();
  tools.forEach((tool) => {
    if (tool.category) {
      categories.add(tool.category);
    }
  });
  return Array.from(categories).sort();
};
