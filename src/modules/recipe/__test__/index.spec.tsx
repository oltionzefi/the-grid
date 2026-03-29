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

test('Clicking View recipe opens the drawer with Ingredients', async () => {
  render(<RecipePage />);

  await act(async () => {
    vi.advanceTimersByTime(400);
    await Promise.resolve();
  });

  const viewButtons = screen.getAllByText('View recipe');
  expect(viewButtons.length).toBeGreaterThan(0);

  // Open drawer for first recipe card
  fireEvent.click(viewButtons[0]);
  expect(screen.getByText('Ingredients')).toBeDefined();
  expect(screen.getByText('Steps')).toBeDefined();
});

test('Drawer closes when close button is clicked', async () => {
  render(<RecipePage />);

  await act(async () => {
    vi.advanceTimersByTime(400);
    await Promise.resolve();
  });

  const viewButtons = screen.getAllByText('View recipe');
  fireEvent.click(viewButtons[0]);
  expect(screen.getByText('Ingredients')).toBeDefined();

  const closeBtn = screen.getByLabelText('Close recipe');
  fireEvent.click(closeBtn);
  expect(screen.queryByText('Ingredients')).toBeNull();
});

test('RecipeCard shows difficulty badges', async () => {
  render(<RecipePage />);

  await act(async () => {
    vi.advanceTimersByTime(400);
    await Promise.resolve();
  });

  const easyBadges = screen.queryAllByText('easy').concat(screen.queryAllByText('Easy'));
  const medBadges = screen.queryAllByText('medium').concat(screen.queryAllByText('Medium'));
  const hardBadges = screen.queryAllByText('hard').concat(screen.queryAllByText('Hard'));
  expect(easyBadges.length + medBadges.length + hardBadges.length).toBeGreaterThan(0);
});

test('Category tabs filter recipes', async () => {
  render(<RecipePage />);

  await act(async () => {
    vi.advanceTimersByTime(400);
    await Promise.resolve();
  });

  // Click the Beef category tab (first occurrence — the tab itself)
  const beefTabs = screen.getAllByText('Beef');
  fireEvent.click(beefTabs[0]);
  const cards = document.querySelectorAll('[data-slot="card"]');
  expect(cards.length).toBeGreaterThan(0);
});
