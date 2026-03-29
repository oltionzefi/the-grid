import { test, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import { useLocalStorage } from '../useLocalStorage';

function Comp() {
  const key = 'initialValue';
  const initialValue = '0';

  const [value, setValue] = useLocalStorage(key, initialValue);

  return (
    <div>
      <p data-test-id="value">{value}</p>
      <button onClick={() => setValue(value + 1)}>Add value</button>
    </div>
  );
}

test('useLocalStorage', async () => {
  const { getByText, rerender, unmount } = render(<Comp />);
  expect(getByText(/0/i)).toBeDefined();

  fireEvent.click(getByText(/add value/i));

  expect(getByText(/1/i)).toBeDefined();
  rerender(<Comp />);
  expect(getByText(/1/i)).toBeDefined();

  unmount();
});
