import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import * as LucideIcons from 'lucide-react';
import { Tool } from '@/types';
import { ICONS } from '@/lib/utils';
import { useToolStore } from '@/providers/tool-store-provider';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ToolCardProps {
  tool: Tool;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
  const { upvoteTool } = useToolStore((state) => state);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
    onChange: (inView) => {
      if (inView) {
        console.log(`Analytics: tool_card_view - ${tool.id}`);
      }
    }
  });

  const IconComponent = (LucideIcons as any)[ICONS[tool.category] || ICONS['Default']] || LucideIcons.Box;

  const handleUpvote = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUpvoted) {
      upvoteTool(tool.id);
      setIsUpvoted(true);
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      whileHover={{ y: -5, scale: 1.02 }}
      className="h-full"
      role="listitem"
      aria-label={`Tool card for ${tool.name}`}
    >
      <Card className="h-full flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl dark:hover:border-primary/50 bg-card">
        <CardHeader className="p-4 flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-muted-foreground" />
            </div>
            <CardTitle className="text-lg leading-tight">{tool.name}</CardTitle>
          </div>
          {tool.matchScore && tool.matchScore > 0.92 && (
            <Badge className="bg-blue-500 text-white">AI Match</Badge>
          )}
        </CardHeader>
        <CardContent className="flex-grow p-4 pt-0">
            <p className="text-sm text-muted-foreground line-clamp-3 min-h-[60px]">
                {tool.tagline}
            </p>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto flex items-center justify-between">
            <Button 
              onClick={handleUpvote}
              aria-label={`Upvote ${tool.name}`}
              variant="ghost"
              size="sm"
              className={`flex items-center gap-1.5 text-muted-foreground hover:text-primary ${isUpvoted ? 'text-primary' : ''}`}
            >
              <LucideIcons.ThumbsUp size={18} />
              <span className="font-semibold">{tool.upvotes}</span>
            </Button>
            <Button asChild variant="ghost" size="icon" aria-label={`Visit ${tool.name} website`}>
              <a href={tool.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <LucideIcons.ExternalLink size={18} />
              </a>
            </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ToolCard;
