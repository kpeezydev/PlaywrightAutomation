import { GoogleGenAI } from '@google/genai';
import { LocatorCandidate } from './types';
import { TestLogger } from '@/utils/logger';

const DEFAULT_CONFIDENCE_THRESHOLD = 0.8;
const GEMINI_MODEL = 'gemini-2.5-flash';

export class AiLocatorService {
  private client: GoogleGenAI;
  private confidenceThreshold: number;

  constructor(confidenceThreshold = DEFAULT_CONFIDENCE_THRESHOLD) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error(
        'GEMINI_API_KEY environment variable is not set. ' +
          'Set it in .env or export GEMINI_API_KEY=your_key',
      );
    }
    this.client = new GoogleGenAI({ apiKey });
    this.confidenceThreshold = confidenceThreshold;
  }

  async findReplacementLocators(
    pageHtml: string,
    brokenLocator: string,
  ): Promise<LocatorCandidate[]> {
    const prompt = this.buildPrompt(pageHtml, brokenLocator);

    TestLogger.staticStep(`Calling Gemini for locator: ${brokenLocator}`);

    const response = await this.client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      TestLogger.staticError('Gemini returned empty response');
      return [];
    }

    TestLogger.staticStep('Gemini AI response', { response: text });
    return this.parseResponse(text);
  }

  private buildPrompt(pageHtml: string, brokenLocator: string): string {
    return `You are a QA automation expert. A Playwright test uses the following locator that no longer matches any element on the page:

Broken locator: ${brokenLocator}

Examine the page HTML below and find the most likely replacement locator(s). Focus on \`data-test\` attributes on interactive elements (input, button, select, textarea, a, etc.).

For each candidate, return:
- \`locator\`: the full CSS selector string (e.g., \`[data-test="username1"]\`)
- \`confidence\`: a number between 0.0 and 1.0 indicating how confident you are
- \`tagName\`: the HTML tag of the matched element
- \`rationale\`: a brief explanation of why this is the best match

Return candidates sorted by confidence descending (highest first).
Only return candidates with confidence >= ${this.confidenceThreshold}.

Page HTML:
${pageHtml}`;
  }

  private parseResponse(text: string): LocatorCandidate[] {
    try {
      const parsed = JSON.parse(text);
      const candidates: LocatorCandidate[] = Array.isArray(parsed)
        ? parsed
        : (parsed.candidates ?? []);

      return candidates
        .filter((c) => c.confidence >= this.confidenceThreshold)
        .sort((a, b) => b.confidence - a.confidence);
    } catch (err) {
      TestLogger.staticError('Failed to parse Gemini response as JSON', err);
      return [];
    }
  }
}
