import React, { useState }from 'react';
import { Tool } from '../types';
import { Star, ArrowUpRight, ChevronUp, Sparkles } from 'lucide-react';
import { apiService } from '../services/api';
import * as LucideIcons from 'lucide-react';
import { ICONS } from '../lib/utils';
import { motion } from 'framer-motion';

interface ToolCardProps {
  tool: Tool;
  onUpvote?: (toolId: string) => void;
}

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const ToolCard: React.FC<ToolCardProps> = ({ tool, onUpvote }) => {
  const [enhancedDescription, setEnhancedDescription] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const IconComponent = (LucideIcons as any)[ICONS[tool.category] || ICONS['Default']] || LucideIcons.Box;

  const getPricingColor = (model: string) => {
    switch (model) {
      case 'free': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border border-green-200/50 dark:border-green-500/30';
      case 'freemium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200/50 dark:border-blue-500/30';
      case 'paid': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200/50 dark:border-purple-500/30';
      case 'usage': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border border-orange-200/50 dark:border-orange-500/30';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700/50 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/30';
    }
  };

  const handleEnhanceDescription = async () => {
    if (isEnhancing || enhancedDescription) return;
    
    setIsEnhancing(true);
    try {
      const enhanced = await apiService.enhanceToolWithAI(tool.id);
      setEnhancedDescription(enhanced);
    } catch (error) {
      console.error('Failed to enhance description:', error);
    } finally {
      setIsEnhancing(false);
    }
  };

  return (
    <motion.div 
      variants={cardVariants}
      whileHover={{ y: -6, scale: 1.02 }}
      className="product-card bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50 p-6 flex flex-col transition-shadow duration-300 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600/50"
    >
      <div className="card-header flex items-start justify-between mb-4">
        <div className="card-icon-wrapper w-12 h-12 bg-gray-100 dark:bg-gray-700/50 rounded-xl flex items-center justify-center transition-colors">
          <IconComponent className="w-6 h-6 text-gray-500 dark:text-gray-400 transition-colors" />
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onUpvote?.(tool.id)}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700/50 dark:hover:bg-gray-700 rounded-lg transition-colors text-sm text-gray-600 dark:text-gray-300 font-medium"
          >
            <ChevronUp className="w-4 h-4" />
            <span>{tool.upvotes}</span>
          </button>
        </div>
      </div>

      <div className="card-content mb-4 flex-grow">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 transition-colors">
          {tool.name}
        </h3>
        
        <div className="mb-4 min-h-[80px]">
          <p className="card-description text-gray-500 dark:text-gray-400 text-sm line-clamp-3">
            {enhancedDescription || tool.tagline}
          </p>
          
          {!enhancedDescription && (
            <button
              onClick={handleEnhanceDescription}
              disabled={isEnhancing}
              className="mt-2 flex items-center space-x-1.5 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors disabled:opacity-50"
            >
              {isEnhancing ? (
                <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Sparkles className="w-3 h-3" />
              )}
              <span className="font-medium">{isEnhancing ? 'Enhancing...' : 'Enhance with AI'}</span>
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full"
          >
            {tool.category}
          </span>
           <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getPricingColor(tool.pricing_model)}`}>
            {tool.pricing_model}
          </span>
        </div>
      </div>

      <div className="card-footer flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700/50">
        <div className="card-stats flex items-center space-x-4">
          <div className="flex items-center space-x-1.5">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{tool.rating_avg.toFixed(1)}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">({tool.rating_count})</span>
          </div>
        </div>
        
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1.5 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-semibold transition-colors"
        >
          <span>Visit</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </motion.div>
  );
};

export default ToolCard;
