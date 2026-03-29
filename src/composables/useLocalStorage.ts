import React from 'react';

/**
 * @todo: Implement logic with JSON.parse and JSON.stringify
 *
 * @param key Key to store the value in localStorage
 * @param initialValue Initial value to store in localStorage
 * @returns hook to get and set value in localStorage
 */
export const useLocalStorage = (key: string, initialValue: string) => {
  const [value, setValue] = React.useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? storedValue : initialValue;
  });

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue] as const;
};
