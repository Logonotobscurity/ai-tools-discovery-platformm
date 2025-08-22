import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Zap, Target, Brain } from 'lucide-react';

const HeroCarousel: React.FC = () => {
  return (
    <section className="hero-carousel bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900/95 dark:via-gray-900 dark:to-black py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Discover the Perfect
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
              AI Tools
            </span>
            for Your Project
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            From startup ideation to enterprise scaling, find exactly what you need 
            with our AI-powered discovery platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="#tools" className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
              Explore Tools
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <Link to="/admin" className="inline-flex items-center px-8 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors">
              Upload Your Tools
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-600 dark:text-gray-400">Virtualized scrolling for a smooth experience.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Custom Data</h3>
              <p className="text-gray-600 dark:text-gray-400">Upload your own JSON file to create personalized tool collections.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Production Grade</h3>
              <p className="text-gray-600 dark:text-gray-400">Built with Vite + React and modern best practices.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
