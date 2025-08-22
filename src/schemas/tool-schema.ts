import { z } from 'zod';

// Define the schema for a tool
export const ToolSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  category: z.string(),
  description: z.string().optional(),
});

// Define the schema for a list of tools
export const ToolsSchema = z.array(ToolSchema);

export type Tool = z.infer<typeof ToolSchema>;
export type Tools = z.infer<typeof ToolsSchema>;
