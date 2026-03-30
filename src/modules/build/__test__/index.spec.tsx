import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import BuildPage from '../index';

const { addBurgerMock, toastDangerMock, toastSuccessMock, navigateMock } = vi.hoisted(() => ({
  addBurgerMock: vi.fn(),
  toastDangerMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  navigateMock: vi.fn(),
}));

vi.mock('react-router', async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock('@heroui/react', async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return {
    ...actual,
    Button: ({ onPress, children, type, disabled, ...props }: any) => (
      <button type={type ?? 'button'} onClick={() => onPress?.()} disabled={disabled} {...props}>
        {children}
      </button>
    ),
    toast: Object.assign(vi.fn(), { success: toastSuccessMock, danger: toastDangerMock }),
  };
});

const INGREDIENTS = [
  { id: 'bun-1', category: 'bun', name: 'Sesame Bun', emoji: '🫓', price: 0.5 },
  { id: 'patty-1', category: 'patty', name: 'Beef Patty', emoji: '🥩', price: 2.5 },
  { id: 'cheese-1', category: 'cheese', name: 'Cheddar', emoji: '🧀', price: 0.8 },
];

vi.mock('@/state', () => ({
  useBurgerStore: (selector: (s: any) => any) =>
    selector({
      addBurger: addBurgerMock,
      builderIngredients: INGREDIENTS,
    }),
}));

// Stub sub-components to avoid deep rendering complexity
vi.mock('@/modules/build/components/BurgerBoard', () => ({
  default: ({ selected }: any) => <div data-testid="burger-board">board:{selected?.length ?? 0}</div>,
}));

vi.mock('@/modules/build/components/IngredientPicker', () => ({
  default: ({ ingredients, onToggle }: any) => (
    <div data-testid="ingredient-picker">
      {ingredients.map((i: any) => (
        <button key={i.id} data-testid={`ing-${i.id}`} onClick={() => onToggle(i)}>
          {i.name}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('@/modules/build/components/NameBurgerModal', () => ({
  default: ({ isOpen, onConfirm }: any) =>
    isOpen ? (
      <div data-testid="name-modal">
        <button onClick={() => onConfirm('My Custom Burger')}>Confirm</button>
      </div>
    ) : null,
}));

const renderBuild = () =>
  render(
    <MemoryRouter>
      <BuildPage />
    </MemoryRouter>,
  );

describe('BuildPage — ingredient selection', () => {
  beforeEach(() => vi.clearAllMocks());

  test('renders ingredient picker', () => {
    const { getByTestId } = renderBuild();
    expect(getByTestId('ingredient-picker')).toBeTruthy();
  });

  test('selecting an ingredient updates burger board', () => {
    const { getByTestId, getByText } = renderBuild();
    fireEvent.click(getByText('Beef Patty'));
    expect(getByTestId('burger-board').textContent).toContain('1');
  });

  test('deselecting an ingredient removes it', () => {
    const { getByTestId, getByText } = renderBuild();
    fireEvent.click(getByText('Beef Patty'));
    fireEvent.click(getByText('Beef Patty'));
    expect(getByTestId('burger-board').textContent).toContain('0');
  });

  test('single-select replaces existing bun', () => {
    const { getByText, getByTestId } = renderBuild();
    fireEvent.click(getByText('Sesame Bun'));
    fireEvent.click(getByText('Sesame Bun')); // deselect
    expect(getByTestId('burger-board').textContent).toContain('0');
  });

  test('reset clears all selections', () => {
    const { getByTestId, getByText } = renderBuild();
    fireEvent.click(getByText('Beef Patty'));
    fireEvent.click(getByText('Reset'));
    expect(getByTestId('burger-board').textContent).toContain('0');
  });
});

describe('BuildPage — finish flow', () => {
  beforeEach(() => vi.clearAllMocks());

  test('shows danger toast when finishing without a patty', () => {
    const { getByText } = renderBuild();
    fireEvent.click(getByText('Select a patty first'));
    expect(toastDangerMock).toHaveBeenCalledWith('Add a patty first!', expect.anything());
  });

  test('opens name modal when finishing with a patty', () => {
    const { getByText, getByTestId } = renderBuild();
    fireEvent.click(getByText('Beef Patty'));
    fireEvent.click(getByText('Finish & Add to Cart'));
    expect(getByTestId('name-modal')).toBeTruthy();
  });

  test('adds burger to cart after naming', () => {
    const { getByText } = renderBuild();
    fireEvent.click(getByText('Beef Patty'));
    fireEvent.click(getByText('Finish & Add to Cart'));
    fireEvent.click(getByText('Confirm'));
    expect(addBurgerMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'My Custom Burger', category: 'Custom' }),
    );
  });

  test('navigates back on back button click', () => {
    const { getByText } = renderBuild();
    fireEvent.click(getByText('Back to home'));
    expect(navigateMock).toHaveBeenCalledWith('/');
  });
});
