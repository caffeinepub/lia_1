export interface SearchResult {
  title: string;
  link: string;
}

export async function searchWeb(query: string): Promise<SearchResult[]> {
  // Note: Direct web search APIs often require API keys or have CORS restrictions
  // This is a placeholder that attempts to use a public API
  // In production, you might want to use a backend proxy or a specific search API
  
  try {
    // Attempt to use DuckDuckGo Instant Answer API (no auth required, but limited)
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`
    );
    
    if (!response.ok) {
      throw new Error('Search API failed');
    }

    const data = await response.json();
    const results: SearchResult[] = [];

    // Extract related topics
    if (data.RelatedTopics && Array.isArray(data.RelatedTopics)) {
      for (const topic of data.RelatedTopics.slice(0, 5)) {
        if (topic.Text && topic.FirstURL) {
          results.push({
            title: topic.Text,
            link: topic.FirstURL,
          });
        }
      }
    }

    return results;
  } catch (error) {
    console.error('Web search failed:', error);
    // Return empty array to trigger fallback behavior
    return [];
  }
}
