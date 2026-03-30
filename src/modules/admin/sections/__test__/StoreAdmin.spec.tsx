import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import StoreAdmin from '../StoreAdmin';

const { toastSuccessMock, toastDangerMock, setStoreConfigMock } = vi.hoisted(() => ({
  toastSuccessMock: vi.fn(),
  toastDangerMock: vi.fn(),
  setStoreConfigMock: vi.fn(),
}));

vi.mock('@heroui/react', async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return {
    ...actual,
    Button: ({ onPress, children, type, ...props }: any) => (
      <button type={type ?? 'button'} onClick={() => onPress?.()} {...props}>
        {children}
      </button>
    ),
    Card: Object.assign(({ children }: any) => <div>{children}</div>, {
      Header: ({ children }: any) => <div>{children}</div>,
      Content: ({ children }: any) => <div>{children}</div>,
    }),
    toast: Object.assign(vi.fn(), { success: toastSuccessMock, danger: toastDangerMock }),
  };
});

vi.mock('@/state', () => ({
  useBurgerStore: (selector: (s: any) => any) =>
    selector({
      storeConfig: { name: 'My Grid', emoji: '🍔' },
      setStoreConfig: setStoreConfigMock,
    }),
}));

describe('StoreAdmin', () => {
  beforeEach(() => {
    setStoreConfigMock.mockClear();
    toastSuccessMock.mockClear();
    toastDangerMock.mockClear();
  });

  const renderIt = () => render(<StoreAdmin />);

  test('renders store name and emoji inputs pre-filled', () => {
    const { getByDisplayValue } = renderIt();
    expect(getByDisplayValue('My Grid')).toBeTruthy();
    expect(getByDisplayValue('🍔')).toBeTruthy();
  });

  test('shows live preview of store name and emoji', () => {
    const { getByText } = renderIt();
    expect(getByText('My Grid')).toBeTruthy();
  });

  test('saves new store config on submit', () => {
    const { getByDisplayValue, getByText } = renderIt();
    fireEvent.change(getByDisplayValue('My Grid'), { target: { value: 'New Name' } });
    fireEvent.submit(getByDisplayValue('New Name').closest('form')!);
    expect(setStoreConfigMock).toHaveBeenCalledWith({ name: 'New Name', emoji: '🍔' });
    expect(toastSuccessMock).toHaveBeenCalled();
  });

  test('shows danger toast when name is empty', () => {
    const { getByDisplayValue, container } = renderIt();
    fireEvent.change(getByDisplayValue('My Grid'), { target: { value: '   ' } });
    fireEvent.submit(container.querySelector('form')!);
    expect(toastDangerMock).toHaveBeenCalled();
    expect(setStoreConfigMock).not.toHaveBeenCalled();
  });

  test('uses default emoji 🍔 when emoji field is cleared', () => {
    const { getByDisplayValue } = renderIt();
    fireEvent.change(getByDisplayValue('🍔'), { target: { value: '' } });
    fireEvent.submit(getByDisplayValue('My Grid').closest('form')!);
    expect(setStoreConfigMock).toHaveBeenCalledWith({ name: 'My Grid', emoji: '🍔' });
  });

  test('updates live preview as user types', () => {
    const { getByDisplayValue, getAllByText } = renderIt();
    fireEvent.change(getByDisplayValue('My Grid'), { target: { value: 'Live Preview' } });
    const previews = getAllByText('Live Preview');
    expect(previews.length).toBeGreaterThanOrEqual(1);
  });
});
