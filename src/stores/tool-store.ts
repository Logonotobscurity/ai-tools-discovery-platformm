import { createStore } from 'zustand';
import { Tool, FilterState } from '@/types';
import { searchTools, upvoteTool as upvoteToolAPI, getCategories as fetchCategories, getFeaturedTools } from '@/api/client';

export interface ToolStore {
  tools: Tool[];
  totalTools: number;
  totalPages: number;
  loading: boolean;
  filters: FilterState;
  categories: string[];
  featuredTools: Tool[];
  loadTools: () => Promise<void>;
  loadFeaturedTools: () => Promise<void>;
  loadCategories: () => Promise<void>;
  setFilters: (filters: Partial<FilterState>) => void;
  upvoteTool: (toolId: string) => Promise<void>;
}

export const createToolStore = () => {
  const initialFilters: FilterState = { 
    sort: 'popular',
    query: '',
    page: 1,
    limit: 20
  };

  return createStore<ToolStore>((set, get) => ({
    tools: [],
    totalTools: 0,
    totalPages: 0,
    loading: false,
    filters: initialFilters,
    categories: [],
    featuredTools: [],

    loadTools: async () => {
      set({ loading: true });
      try {
        const response = await searchTools(get().filters);
        set({
          tools: response.tools,
          totalTools: response.total,
          totalPages: response.totalPages,
          loading: false,
        });
      } catch (error) {
        console.error('Failed to load tools:', error);
        set({ loading: false });
        throw error;
      }
    },

    loadFeaturedTools: async () => {
      try {
        const featured = await getFeaturedTools();
        set({ featuredTools: featured });
      } catch (error) {
        console.error('Failed to load featured tools:', error);
        throw error;
      }
    },

    loadCategories: async () => {
      try {
        const categories = await fetchCategories();
        set({ categories });
      } catch (error) {
        console.error('Failed to load categories:', error);
        throw error;
      }
    },

    setFilters: (newFilters: Partial<FilterState>) => {
      const currentFilters = get().filters;
      const updatedFilters = { ...currentFilters, ...newFilters };
      set({ filters: updatedFilters });
      get().loadTools();
    },

    upvoteTool: async (toolId: string) => {
      try {
        const response = await upvoteToolAPI(toolId);
        if (response.success) {
          const tools = get().tools.map((tool) =>
            tool.id === toolId ? { ...tool, upvotes: response.upvotes } : tool
          );
          set({ tools });
        }
      } catch (error) {
        console.error('Failed to upvote tool:', error);
        throw error;
      }
    },
  }));
        });
        try {
          await upvoteToolAPI(toolId);
        } catch (error) {
          // Rollback on error
          set({
            allTools: prevTools,
            filteredTools: applyFilters(prevTools, get().filters),
            categories: get().categories,
            filters: get().filters,
            setTools: get().setTools,
            setFilters: get().setFilters,
            upvoteTool: get().upvoteTool,
          });
          console.error('Upvote failed:', error);
        }
      },
    })
  );
};
