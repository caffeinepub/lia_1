import type { ParsedCommand } from './commandParser';

export async function executeCustomTool(command: ParsedCommand): Promise<string> {
  if (!command.tool || !command.query) {
    return 'Invalid custom tool command.';
  }

  try {
    const url = command.tool.urlTemplate.replace('{query}', encodeURIComponent(command.query));
    window.open(url, '_blank');
    return `Opened ${command.tool.name} for "${command.query}" in a new tab.`;
  } catch (error) {
    return `Failed to execute ${command.tool.name}.`;
  }
}
