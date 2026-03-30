import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import BuilderAdmin from '../BuilderAdmin';

const {
  addBuilderIngredientMock,
  updateBuilderIngredientMock,
  removeBuilderIngredientMock,
  resetBuilderIngredientsMock,
  toastSuccessMock,
  toastDangerMock,
} = vi.hoisted(() => ({
  addBuilderIngredientMock: vi.fn(),
  updateBuilderIngredientMock: vi.fn(),
  removeBuilderIngredientMock: vi.fn(),
  resetBuilderIngredientsMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastDangerMock: vi.fn(),
}));

const INGREDIENT = {
  id: 'veggie-1',
  name: 'Lettuce',
  category: 'veggie' as const,
  emoji: '🥬',
  price: 0.5,
  description: 'Fresh lettuce',
};

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
      builderIngredients: [INGREDIENT],
      addBuilderIngredient: addBuilderIngredientMock,
      updateBuilderIngredient: updateBuilderIngredientMock,
      removeBuilderIngredient: removeBuilderIngredientMock,
      resetBuilderIngredients: resetBuilderIngredientsMock,
    }),
}));

vi.mock('@/modules/build/api/ingredients', () => ({
  CATEGORY_ORDER: ['bun', 'patty', 'cheese', 'veggie', 'sauce'],
  CATEGORY_META: {
    bun: { label: 'Bun', multi: false },
    patty: { label: 'Patty', multi: false },
    cheese: { label: 'Cheese', multi: false },
    veggie: { label: 'Veggie', multi: true },
    sauce: { label: 'Sauce', multi: true },
  },
}));

describe('BuilderAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('confirm', () => true);
  });

  const renderIt = () => render(<BuilderAdmin />);

  test('renders existing ingredient', () => {
    const { getByText } = renderIt();
    expect(getByText('Lettuce')).toBeTruthy();
  });

  test('opens add form on Add ingredient press', () => {
    const { getByText } = renderIt();
    fireEvent.click(getByText('Add ingredient'));
    expect(getByText('New ingredient')).toBeTruthy();
  });

  test('shows validation error when name or emoji missing', () => {
    const { getByText } = renderIt();
    fireEvent.click(getByText('Add ingredient'));
    fireEvent.submit(document.querySelector('form')!);
    expect(toastDangerMock).toHaveBeenCalled();
    expect(addBuilderIngredientMock).not.toHaveBeenCalled();
  });

  test('shows invalid price error', () => {
    const { getByPlaceholderText, getByText } = renderIt();
    fireEvent.click(getByText('Add ingredient'));
    fireEvent.change(getByPlaceholderText('e.g. Pickled Onions'), { target: { value: 'Pickle' } });
    fireEvent.change(getByPlaceholderText('🥕'), { target: { value: '🥒' } });
    fireEvent.change(getByPlaceholderText('0.50'), { target: { value: '-5' } });
    fireEvent.submit(document.querySelector('form')!);
    expect(toastDangerMock).toHaveBeenCalledWith('Invalid price', expect.anything());
  });

  test('adds ingredient with valid data', () => {
    const { getByPlaceholderText, getByText } = renderIt();
    fireEvent.click(getByText('Add ingredient'));
    fireEvent.change(getByPlaceholderText('e.g. Pickled Onions'), { target: { value: 'Pickle' } });
    fireEvent.change(getByPlaceholderText('🥕'), { target: { value: '🥒' } });
    fireEvent.change(getByPlaceholderText('0.50'), { target: { value: '0.5' } });
    fireEvent.submit(document.querySelector('form')!);
    expect(addBuilderIngredientMock).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Pickle', emoji: '🥒', price: 0.5 }),
    );
  });

  test('resets builder ingredients on confirm', () => {
    const { getByText } = renderIt();
    fireEvent.click(getByText('Reset defaults'));
    expect(resetBuilderIngredientsMock).toHaveBeenCalled();
  });
});
