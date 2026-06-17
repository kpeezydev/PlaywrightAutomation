export interface LocatorContext {
  elementContext?: string;
  stepContext?: string;
}

export interface HealingEntry {
  originalLocator: string;
  healedLocator: string;
  pageUrl: string;
  confidence: number;
  timestamp: string;
  context?: LocatorContext;
}

export interface LocatorCandidate {
  locator: string;
  confidence: number;
  tagName: string;
  rationale: string;
}
