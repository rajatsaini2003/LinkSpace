import { AppError } from '../../middlewares/error.middleware';
import { config } from '../../config/env';
import { SummarizeInput, TagSuggestInput } from './ai.validation';

async function callOpenAI(messages: Array<{ role: string; content: string }>, maxTokens = 300): Promise<string> {
  if (!config.openaiApiKey) {
    throw new AppError('AI service is not configured', 503);
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.openaiApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: maxTokens,
      temperature: 0.5,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new AppError(
      `AI service error: ${(error as { error?: { message?: string } }).error?.message || response.statusText}`,
      502,
    );
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0]?.message?.content?.trim() || '';
}

export async function summarizeUrl(data: SummarizeInput): Promise<{ summary: string; url: string }> {
  const contextLines: string[] = [`URL: ${data.url}`];
  if (data.title) contextLines.push(`Title: ${data.title}`);
  if (data.content) contextLines.push(`Content excerpt: ${data.content.slice(0, 3000)}`);

  const prompt = `You are a helpful assistant that summarizes web pages for a social bookmarking app. 
Given the following information about a web page, provide a concise 2-3 sentence summary that captures the key points.

${contextLines.join('\n')}

Provide only the summary text, no additional commentary.`;

  const summary = await callOpenAI([
    { role: 'system', content: 'You summarize web pages concisely and accurately.' },
    { role: 'user', content: prompt },
  ]);

  return { summary, url: data.url };
}

export async function suggestTags(data: TagSuggestInput): Promise<{ tags: string[] }> {
  const contextLines: string[] = [`Title: ${data.title}`];
  if (data.description) contextLines.push(`Description: ${data.description}`);
  if (data.url) contextLines.push(`URL: ${data.url}`);

  const prompt = `You are a helpful assistant for a social bookmarking platform.
Given the following information about a bookmark, suggest 5-8 relevant tags.

${contextLines.join('\n')}

Return only a JSON array of lowercase tag strings (no spaces, use hyphens), e.g. ["javascript", "web-development", "tutorial"]`;

  const result = await callOpenAI([
    { role: 'system', content: 'You suggest relevant tags for bookmarks. Always respond with a valid JSON array.' },
    { role: 'user', content: prompt },
  ]);

  try {
    const tags = JSON.parse(result) as string[];
    return { tags: tags.slice(0, 10) };
  } catch {
    // Fallback: extract anything that looks like an array
    const match = result.match(/\[.*?\]/s);
    if (match) {
      try {
        const tags = JSON.parse(match[0]) as string[];
        return { tags: tags.slice(0, 10) };
      } catch {
        // ignore
      }
    }
    return { tags: [] };
  }
}
