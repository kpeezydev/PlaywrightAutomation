export interface HealingEntry {
  originalLocator: string;
  healedLocator: string;
  pageUrl: string;
  confidence: number;
  timestamp: string;
}

export interface LocatorCandidate {
  locator: string;
  confidence: number;
  tagName: string;
  rationale: string;
}
