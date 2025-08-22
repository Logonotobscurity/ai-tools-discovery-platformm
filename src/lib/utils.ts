import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const slugify = (text: string): string => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

export const ICONS: { [key: string]: string } = {
  'Accounting & Modeling': 'calculator',
  'Aggregators': 'library',
  'Api & Security': 'shield-check',
  'Avatar': 'user-circle',
  'Career & Education': 'briefcase',
  'Chat': 'message-circle',
  'Chat Marketing': 'message-square-plus',
  'Company Formation': 'building',
  'Community': 'users',
  'Compliance & Legal': 'gavel',
  'Copywriting': 'pencil-ruler',
  'Crm & Support': 'heart-handshake',
  'Databases': 'database',
  'Deployment': 'upload-cloud',
  'Design & Graphics': 'figma',
  'Design Resources': 'palette',
  'Developer Tools': 'code-2',
  'Email & Marketing': 'mail',
  'Finance': 'dollar-sign',
  'For Fun': 'gamepad-2',
  'Frameworks & Runtimes': 'atom',
  'Gaming': 'swords',
  'Generative Art': 'image',
  'Generative Code': 'terminal-square',
  'Generative Video': 'film',
  'Hiring': 'user-plus',
  'Image Improvement': 'sparkles',
  'Image Scanning': 'camera',
  'Incubators & Grants': 'piggy-bank',
  'Infrastructure As Code & Dns / Cdn': 'cloud-cog',
  'Inspiration': 'lightbulb',
  'Investors & Crowdfunding': 'trending-up',
  'Marketing': 'megaphone',
  'Monitoring & Logs': 'activity',
  'Motion Capture': 'move-3d',
  'Music': 'music',
  'Naming & Domains': 'globe',
  'PaaS / FaaS / BaaS / IaaS': 'server',
  'Payments & Finance': 'credit-card',
  'Podcasting': 'mic',
  'Presentation & Video': 'presentation',
  'Problems & Need-Gap': 'search-x',
  'Productivity': 'zap',
  'Productivity & Health': 'heart-pulse',
  'Professionals & Freelance': 'briefcase',
  'Programming Languages': 'braces',
  'Prompt Guides': 'book-open',
  'Reading & Blogs': 'newspaper',
  'Research': 'search',
  'Salary & Equity': 'coins',
  'School': 'school',
  'Search & Analytics': 'bar-chart-2',
  'Self-Improvement': 'brain-circuit',
  'Social Media': 'share-2',
  'Software Architecture & Patterns': 'architecture',
  'Speech-To-Text': 'audio-lines',
  'Spreadsheets & Docs': 'file-spreadsheet',
  'Startup': 'rocket',
  'Startup Freebies': 'gift',
  'Team Chat & Conference': 'messages-square',
  'Testing & Qa': 'flask-conical',
  'Text-To-Speech': 'volume-2',
  'Text-To-Video': 'clapperboard',
  'Training & Courses': 'graduation-cap',
  'Translation': 'languages',
  'Uncategorized': 'box',
  'Video Editing': 'video',
  'Voice Modulation': 'waves',
  'Default': 'box'
};
