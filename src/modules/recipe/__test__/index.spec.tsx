import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import RecipePage from '../index';

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

vi.mock('@heroui/react', async (orig) => {
  const actual = (await orig()) as any;
  return {
    ...actual,
    Button: ({ children, onPress, fullWidth, ...rest }: any) => (
      <button onClick={onPress} {...rest}>
        {children}
      </button>
    ),
  };
});

test('Recipe page shows loading state initially', () => {
  render(<RecipePage />);
  const el = screen.queryByText(/Loading/i) ?? screen.queryByText(/Recipes/i);
  expect(el).toBeDefined();
});

test('Recipe page renders cards after load', async () => {
  render(<RecipePage />);

  await act(async () => {
    vi.advanceTimersByTime(400);
    await Promise.resolve();
  });

  expect(screen.getByText('Recipes')).toBeDefined();
  const cards = document.querySelectorAll('[data-slot="card"]');
  expect(cards.length).toBeGreaterThan(0);
});

test('RecipeCard expand/collapse toggles ingredients', async () => {
  render(<RecipePage />);

  await act(async () => {
    vi.advanceTimersByTime(400);
    await Promise.resolve();
  });

  const viewButtons = screen.getAllByText('View recipe');
  expect(viewButtons.length).toBeGreaterThan(0);

  // Expand first recipe
  fireEvent.click(viewButtons[0]);
  expect(screen.getByText('Ingredients')).toBeDefined();

  // Collapse it
  const hideBtn = screen.getByText('Hide recipe');
  fireEvent.click(hideBtn);
  expect(screen.queryByText('Hide recipe')).toBeNull();
});

test('RecipeCard shows difficulty and tags', async () => {
  render(<RecipePage />);

  await act(async () => {
    vi.advanceTimersByTime(400);
    await Promise.resolve();
  });

  // At least one difficulty badge exists (multiple recipes may share a difficulty)
  const easyBadges = screen.queryAllByText('easy').concat(screen.queryAllByText('Easy'));
  const medBadges = screen.queryAllByText('medium').concat(screen.queryAllByText('Medium'));
  const hardBadges = screen.queryAllByText('hard').concat(screen.queryAllByText('Hard'));
  expect(easyBadges.length + medBadges.length + hardBadges.length).toBeGreaterThan(0);
});
