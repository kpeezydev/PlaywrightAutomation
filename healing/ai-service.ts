import { GoogleGenAI } from '@google/genai';
import { LocatorCandidate, LocatorContext } from './types';
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
    context?: LocatorContext,
  ): Promise<LocatorCandidate[]> {
    const prompt = this.buildPrompt(pageHtml, brokenLocator, context);

    TestLogger.staticStep(`Calling Gemini for locator: ${brokenLocator}`, { context });

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

  private buildPrompt(pageHtml: string, brokenLocator: string, context?: LocatorContext): string {
    const contextBlock = context
      ? `

=== Test Context ===
Element context: ${context.elementContext ?? 'unknown'}
${context.stepContext ? `Current test step: ${context.stepContext}` : ''}
`
      : '';

    return `You are a QA automation expert. A Playwright test uses the following locator that no longer matches any element on the page:

Broken locator: ${brokenLocator}
${contextBlock}
Examine the page HTML below and find the most likely replacement locator(s). Focus on \`data-test\` attributes on interactive elements (input, button, select, textarea, a, etc.).

IMPORTANT — Use the element context to infer intent: if the description says "user name input box" but the broken locator says "password", the developer intended to target the username field — look for elements related to "username" or the login form's username/email input. Let the element context override the broken locator's misleading signal.

For each candidate, return:
- \`locator\`: the full CSS selector string (e.g., \`[data-test="username"]\`)
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
