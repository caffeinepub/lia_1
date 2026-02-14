import type { Tool } from '../backend';

export type CommandType = 'search' | 'open' | 'youtube' | 'help' | 'custom';

export interface ParsedCommand {
  type: CommandType;
  query?: string;
  url?: string;
  tool?: Tool;
}

export function parseCommand(text: string, customTools: Tool[]): ParsedCommand | null {
  const trimmed = text.trim().toLowerCase();

  // Help command
  if (trimmed === 'help' || trimmed === 'मदद') {
    return { type: 'help' };
  }

  // Search command
  if (trimmed.startsWith('search:') || trimmed.startsWith('खोज:')) {
    const query = text.substring(text.indexOf(':') + 1).trim();
    return { type: 'search', query };
  }

  // Open URL command
  if (trimmed.startsWith('open:') || trimmed.startsWith('खोलें:')) {
    const url = text.substring(text.indexOf(':') + 1).trim();
    return { type: 'open', url };
  }

  // YouTube command
  if (trimmed.startsWith('youtube:') || trimmed.startsWith('यूट्यूब:')) {
    const query = text.substring(text.indexOf(':') + 1).trim();
    return { type: 'youtube', query };
  }

  // Check custom tools
  for (const tool of customTools) {
    const toolKeyword = tool.name.toLowerCase();
    if (trimmed.startsWith(toolKeyword + ':')) {
      const query = text.substring(text.indexOf(':') + 1).trim();
      return { type: 'custom', query, tool };
    }
  }

  return null;
}
