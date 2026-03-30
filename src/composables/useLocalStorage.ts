import React from 'react';

export const useLocalStorage = (key: string, initialValue: string) => {
  const [value, setValue] = React.useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? storedValue : initialValue;
  });

  // Write synchronously inside the setter so there is no render-cycle gap
  // where the in-memory state and localStorage diverge.
  const set = React.useCallback(
    (next: string | ((prev: string) => string)) => {
      setValue((prev) => {
        const resolved = typeof next === 'function' ? next(prev) : next;
        localStorage.setItem(key, resolved);
        return resolved;
      });
    },
    [key],
  );

  return [value, set] as const;
};
