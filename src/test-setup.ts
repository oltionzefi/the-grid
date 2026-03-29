/**
 * Vitest global setup — runs before every test file.
 * Silences known framework-level warnings from React Aria / HeroUI that are
 * not actionable in a jsdom environment (no real DOM press handling).
 */

const SUPPRESSED_PATTERNS = [
  /PressResponder was rendered without a pressable child/,
  /An update to .* inside a test was not wrapped in act/i,
  /React does not recognize the `is[A-Z]/,
  /React does not recognize the `data-slot/,
];

const isSuppressed = (...args: unknown[]): boolean => {
  const msg = args.map(String).join(' ');
  return SUPPRESSED_PATTERNS.some((p) => p.test(msg));
};

const originalError = console.error.bind(console);
const originalWarn = console.warn.bind(console);

console.error = (...args: unknown[]) => {
  if (isSuppressed(...args)) return;
  originalError(...args);
};

console.warn = (...args: unknown[]) => {
  if (isSuppressed(...args)) return;
  originalWarn(...args);
};
