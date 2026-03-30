import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import IngredientPicker from '../IngredientPicker';

vi.mock('@/modules/build/api/ingredients', () => ({
  CATEGORY_ORDER: ['bun', 'patty', 'veggie', 'sauce'],
  CATEGORY_META: {
    bun: { label: 'Bun', emoji: '🫓', multi: false },
    patty: { label: 'Patty', emoji: '🥩', multi: false },
    veggie: { label: 'Veggie', emoji: '🥗', multi: true },
    sauce: { label: 'Sauce', emoji: '🫙', multi: true },
  },
}));

const INGREDIENTS = [
  { id: 'bun-1', category: 'bun', name: 'Sesame Bun', emoji: '🫓', price: 0.5 },
  { id: 'patty-1', category: 'patty', name: 'Beef Patty', emoji: '🥩', price: 2.5 },
  { id: 'veggie-1', category: 'veggie', name: 'Lettuce', emoji: '🥬', price: 0 },
];

const renderPicker = (selected: typeof INGREDIENTS = [], onToggle = vi.fn()) =>
  render(<IngredientPicker ingredients={INGREDIENTS} selected={selected} onToggle={onToggle} />);

describe('IngredientPicker', () => {
  beforeEach(() => vi.clearAllMocks());

  test('renders tab bar with category labels or emojis', () => {
    const { container } = renderPicker();
    const tabs = container.querySelectorAll('button');
    expect(tabs.length).toBeGreaterThanOrEqual(4);
  });

  test('shows bun tab items by default', () => {
    const { getByText } = renderPicker();
    expect(getByText('Sesame Bun')).toBeTruthy();
  });

  test('switches to patty tab on click', () => {
    const { getByText } = renderPicker();
    fireEvent.click(getByText('Patty'));
    expect(getByText('Beef Patty')).toBeTruthy();
  });

  test('switches to veggie tab on click', () => {
    const { getByText } = renderPicker();
    fireEvent.click(getByText('Veggie'));
    expect(getByText('Lettuce')).toBeTruthy();
  });

  test('calls onToggle with the ingredient when item is clicked', () => {
    const onToggle = vi.fn();
    const { getByText } = renderPicker([], onToggle);
    fireEvent.click(getByText('Sesame Bun'));
    expect(onToggle).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'bun-1', name: 'Sesame Bun' }),
    );
  });

  test('shows selected indicator when ingredient is in selected list', () => {
    const { container } = renderPicker([INGREDIENTS[0]]);
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
  });

  test('shows count badge on tab when items from that category are selected', () => {
    const { getByText } = renderPicker([INGREDIENTS[0]]);
    expect(getByText('1')).toBeTruthy();
  });

  test('shows price for each ingredient', () => {
    const { getByText } = renderPicker();
    expect(getByText('+$0.50')).toBeTruthy();
  });

  test('shows Required hint on patty tab', () => {
    const { getByText } = renderPicker();
    fireEvent.click(getByText('Patty'));
    expect(getByText('✦ Required')).toBeTruthy();
  });

  test('shows multi-select hint for veggie tab', () => {
    const { getByText } = renderPicker();
    fireEvent.click(getByText('Veggie'));
    expect(getByText(/Pick as many as you like/)).toBeTruthy();
  });

  test('shows single-select hint for bun tab', () => {
    const { container } = renderPicker();
    expect(container.textContent).toContain('Pick one');
  });
});
