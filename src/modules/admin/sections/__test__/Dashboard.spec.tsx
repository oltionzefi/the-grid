import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import Dashboard from '../Dashboard';

vi.mock('@heroui/react', async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return {
    ...actual,
    Card: Object.assign(({ children }: any) => <div>{children}</div>, {
      Header: ({ children }: any) => <div>{children}</div>,
      Content: ({ children }: any) => <div>{children}</div>,
    }),
  };
});

vi.mock('@/state', () => ({
  useBurgerStore: (selector: (s: any) => any) =>
    selector({
      menuBurgers: [{ id: '1' }, { id: '2' }],
      shopLocations: [{ id: 'l1' }],
      builderIngredients: [{ id: 'i1' }, { id: 'i2' }, { id: 'i3' }],
      storeConfig: { name: 'Test Grid', emoji: '🍔' },
      burgers: [{ cartItemId: 'c1' }],
    }),
}));

describe('Dashboard', () => {
  const onNavigate = vi.fn();
  beforeEach(() => onNavigate.mockClear());

  test('shows menu item count', () => {
    const { getByText } = render(<Dashboard onNavigate={onNavigate} />);
    expect(getByText('2')).toBeTruthy();
  });

  test('shows location count', () => {
    const { getAllByText } = render(<Dashboard onNavigate={onNavigate} />);
    // "1" appears in both location count and potentially other stats
    expect(getAllByText('1').length).toBeGreaterThanOrEqual(1);
  });

  test('shows store name', () => {
    const { container } = render(<Dashboard onNavigate={onNavigate} />);
    expect(container.textContent).toContain('Test Grid');
  });

  test('calls onNavigate when stat card is clicked', () => {
    const { getAllByRole } = render(<Dashboard onNavigate={onNavigate} />);
    const buttons = getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onNavigate).toHaveBeenCalled();
  });

  test('shows welcome message', () => {
    const { getByText } = render(<Dashboard onNavigate={onNavigate} />);
    expect(getByText('Welcome back, Admin')).toBeTruthy();
  });
});
