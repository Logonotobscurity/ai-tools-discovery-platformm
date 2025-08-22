import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Menu, User, Search } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useDebounce } from 'use-debounce';
import { useToolStore } from '@/providers/tool-store-provider';
import { Input } from './ui/input';

const Header: React.FC = () => {
  const { filters, setFilters } = useToolStore((state) => state);
  const { register, watch } = useForm({
    defaultValues: {
      query: filters.query,
    },
  });

  const queryValue = watch('query');
  const [debouncedQuery] = useDebounce(queryValue, 300);

  useEffect(() => {
    setFilters({ query: debouncedQuery });
  }, [debouncedQuery, setFilters]);

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/80 dark:border-gray-700/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                <Brain className="w-4 h-4 text-white/80" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">AI Tools</span>
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search tools..."
                {...register('query')}
                className="w-full pl-12 pr-4 py-2.5"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link to="/admin" className="flex items-center space-x-2 px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors font-medium text-sm">
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors md:hidden">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
