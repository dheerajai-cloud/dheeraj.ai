export type ToolCategory = 'all' | 'featured' | 'marketing' | 'finance' | 'utilities' | 'dev';

export interface ToolDefinition {
  id: string;
  titleKey: string;
  descKey: string;
  category: ToolCategory;
  iconName: string;
  badge?: string;
  accentGradient: string;
  tags: string[];
}

export interface RecentTool {
  id: string;
  timestamp: number;
}
