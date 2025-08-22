import React from 'react';
import { useToolStore } from '@/providers/tool-store-provider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Filters: React.FC = () => {
  const { filters, setFilters, categories } = useToolStore((state) => state);

  return (
    <div className="bg-card/80 dark:bg-card/50 border border-border/80 py-4 px-6 rounded-xl shadow-sm backdrop-blur-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div className="sm:col-span-1">
          <Select onValueChange={(value) => setFilters({ category: value === 'all' ? undefined : value })} defaultValue={filters.category || 'all'}>
            <SelectTrigger aria-label="Filter by category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category} className="capitalize">{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="sm:col-span-1">
          <Select onValueChange={(value) => setFilters({ sort: value as 'popular' | 'name' })} defaultValue={filters.sort}>
            <SelectTrigger aria-label="Sort by">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default Filters;
