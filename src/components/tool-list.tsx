import React, { useEffect, useState, useCallback } from 'react';
import { fetchPaginatedTools } from '@/data/tools';
import ToolCard from './ToolCard';
import { Tool } from '@/types';

// Constants
const ITEMS_PER_PAGE = 10;
const SCROLL_THRESHOLD = 100; // pixels from bottom

interface ToolListProps {
  className?: string;
}

const ToolList: React.FC<ToolListProps> = ({ className }) => {
  const [tools, setTools] = useState<Tool[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Load tools with error handling
  const loadTools = useCallback(async () => {
    if (!hasMore || loading) return;

    try {
      setLoading(true);
      const newTools = await fetchPaginatedTools(page, ITEMS_PER_PAGE);
      
      if (newTools.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }

      setTools(prev => [...prev, ...newTools]);
    } catch (error) {
      console.error('Error loading tools:', error);
    } finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  // Scroll handler with throttling
  const handleScroll = useCallback(() => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const threshold = document.documentElement.offsetHeight - SCROLL_THRESHOLD;

    if (scrollPosition >= threshold && !loading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  // Initial load
  useEffect(() => {
    loadTools();
  }, [page, loadTools]);

  // Scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (!tools.length && loading) {
    return <div className="text-center py-8">Loading tools...</div>;
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent"></div>
        </div>
      )}
      {!hasMore && tools.length > 0 && (
        <div className="text-center py-4 text-muted-foreground">
          No more tools to load
        </div>
      )}
    </div>
  );
};

export default ToolList;
