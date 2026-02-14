import type { ParsedCommand } from './commandParser';
import { searchWeb } from './webSearch';

export async function executeBuiltInTool(command: ParsedCommand): Promise<string> {
  switch (command.type) {
    case 'help':
      return `Available commands:
• search: <query> - Search the web
• open: <url> - Open a website
• youtube: <query> - Search YouTube
• help - Show this help message

Example: "search: weather in Delhi"`;

    case 'search':
      if (!command.query) {
        return 'Please provide a search query. Example: search: climate change';
      }
      try {
        const results = await searchWeb(command.query);
        if (results.length > 0) {
          return `Search results for "${command.query}":\n\n${results
            .map((r, i) => `${i + 1}. ${r.title}\n   ${r.link}`)
            .join('\n\n')}`;
        } else {
          // Fallback: open search page
          window.open(`https://www.google.com/search?q=${encodeURIComponent(command.query)}`, '_blank');
          return `Opened search results for "${command.query}" in a new tab.`;
        }
      } catch (error) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(command.query)}`, '_blank');
        return `Opened search results for "${command.query}" in a new tab.`;
      }

    case 'open':
      if (!command.url) {
        return 'Please provide a URL. Example: open: https://example.com';
      }
      try {
        let url = command.url;
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          url = 'https://' + url;
        }
        window.open(url, '_blank');
        return `Opened ${url} in a new tab.`;
      } catch (error) {
        return `Failed to open ${command.url}. Please check the URL.`;
      }

    case 'youtube':
      if (!command.query) {
        return 'Please provide a search query. Example: youtube: lo-fi beats';
      }
      try {
        const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(command.query)}`;
        window.open(url, '_blank');
        return `Opened YouTube search for "${command.query}" in a new tab.`;
      } catch (error) {
        return `Failed to open YouTube search.`;
      }

    default:
      return 'Unknown command. Type "help" to see available commands.';
  }
}
