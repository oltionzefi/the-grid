/**
 * Tests for useBootstrap — verifies that API data is loaded into Zustand
 * on first authenticated mount, and that errors degrade gracefully.
 */
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import { useBootstrap } from '../useBootstrap';

// ── hoisted mocks ─────────────────────────────────────────────────────────
const {
  addMenuBurgerMock,
  updateMenuBurgerMock,
  addShopLocationMock,
  updateShopLocationMock,
  addBuilderIngredientMock,
  updateBuilderIngredientMock,
} = vi.hoisted(() => ({
  addMenuBurgerMock: vi.fn(),
  updateMenuBurgerMock: vi.fn(),
  addShopLocationMock: vi.fn(),
  updateShopLocationMock: vi.fn(),
  addBuilderIngredientMock: vi.fn(),
  updateBuilderIngredientMock: vi.fn(),
}));

let isAuthenticated = true;
let isLoading = false;

vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ isAuthenticated, isLoading }),
}));

const burgersListMock = vi.fn();
const locationsListMock = vi.fn();
const ingredientsListMock = vi.fn();

vi.mock('../useApi', () => ({
  useApi: () => ({
    burgers: { list: burgersListMock },
    locations: { list: locationsListMock },
    ingredients: { list: ingredientsListMock },
    orders: { list: vi.fn(), create: vi.fn() },
    me: { get: vi.fn() },
  }),
}));

vi.mock('@/state', () => ({
  useBurgerStore: () => ({
    menuBurgers: [],
    shopLocations: [],
    builderIngredients: [],
    addMenuBurger: addMenuBurgerMock,
    updateMenuBurger: updateMenuBurgerMock,
    addShopLocation: addShopLocationMock,
    updateShopLocation: updateShopLocationMock,
    addBuilderIngredient: addBuilderIngredientMock,
    updateBuilderIngredient: updateBuilderIngredientMock,
  }),
}));

vi.mock('@/assets/burger.webp', () => ({ default: 'burger.webp' }));

const API_BURGER = {
  id: 'b1',
  name: 'Classic',
  description: 'A burger',
  price_cents: 999,
  category: 'beef',
  image_url: '',
  active: true,
};

const API_LOCATION = { id: 'l1', name: 'Branch', address: '1 Main St', phone: '123' };

const API_INGREDIENT = { id: 'i1', name: 'Lettuce', category: 'vegetable', emoji: '🥬' };

describe('useBootstrap', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isAuthenticated = true;
    isLoading = false;
  });

  test('does not call APIs when not authenticated', async () => {
    isAuthenticated = false;
    renderHook(() => useBootstrap());
    await act(async () => {});
    expect(burgersListMock).not.toHaveBeenCalled();
    expect(locationsListMock).not.toHaveBeenCalled();
    expect(ingredientsListMock).not.toHaveBeenCalled();
  });

  test('does not call APIs while isLoading is true', async () => {
    isLoading = true;
    renderHook(() => useBootstrap());
    await act(async () => {});
    expect(burgersListMock).not.toHaveBeenCalled();
  });

  test('calls all three APIs when authenticated and not loading', async () => {
    burgersListMock.mockResolvedValue([]);
    locationsListMock.mockResolvedValue([]);
    ingredientsListMock.mockResolvedValue([]);
    renderHook(() => useBootstrap());
    await act(async () => {});
    expect(burgersListMock).toHaveBeenCalled();
    expect(locationsListMock).toHaveBeenCalled();
    expect(ingredientsListMock).toHaveBeenCalled();
  });

  test('adds new burger to store when API returns data', async () => {
    burgersListMock.mockResolvedValue([API_BURGER]);
    locationsListMock.mockResolvedValue([]);
    ingredientsListMock.mockResolvedValue([]);
    renderHook(() => useBootstrap());
    await act(async () => {});
    expect(addMenuBurgerMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'b1', name: 'Classic' }),
    );
  });

  test('adds new location to store when API returns data', async () => {
    burgersListMock.mockResolvedValue([]);
    locationsListMock.mockResolvedValue([API_LOCATION]);
    ingredientsListMock.mockResolvedValue([]);
    renderHook(() => useBootstrap());
    await act(async () => {});
    expect(addShopLocationMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'l1', name: 'Branch' }),
    );
  });

  test('adds new ingredient to store when API returns data', async () => {
    burgersListMock.mockResolvedValue([]);
    locationsListMock.mockResolvedValue([]);
    ingredientsListMock.mockResolvedValue([API_INGREDIENT]);
    renderHook(() => useBootstrap());
    await act(async () => {});
    expect(addBuilderIngredientMock).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'i1', name: 'Lettuce' }),
    );
  });

  test('maps API ingredient category bread → bun', async () => {
    burgersListMock.mockResolvedValue([]);
    locationsListMock.mockResolvedValue([]);
    ingredientsListMock.mockResolvedValue([{ ...API_INGREDIENT, category: 'bread' }]);
    renderHook(() => useBootstrap());
    await act(async () => {});
    expect(addBuilderIngredientMock).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'bun' }),
    );
  });

  test('maps API ingredient category protein → patty', async () => {
    burgersListMock.mockResolvedValue([]);
    locationsListMock.mockResolvedValue([]);
    ingredientsListMock.mockResolvedValue([{ ...API_INGREDIENT, category: 'protein' }]);
    renderHook(() => useBootstrap());
    await act(async () => {});
    expect(addBuilderIngredientMock).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'patty' }),
    );
  });

  test('does not add burgers when API returns empty list', async () => {
    burgersListMock.mockResolvedValue([]);
    locationsListMock.mockResolvedValue([]);
    ingredientsListMock.mockResolvedValue([]);
    renderHook(() => useBootstrap());
    await act(async () => {});
    expect(addMenuBurgerMock).not.toHaveBeenCalled();
  });

  test('degrades gracefully when API throws', async () => {
    burgersListMock.mockRejectedValue(new Error('network error'));
    locationsListMock.mockRejectedValue(new Error('network error'));
    ingredientsListMock.mockRejectedValue(new Error('network error'));
    // Should not throw
    renderHook(() => useBootstrap());
    await act(async () => {});
    expect(addMenuBurgerMock).not.toHaveBeenCalled();
  });

  test('price_cents is divided by 100 for burger price', async () => {
    burgersListMock.mockResolvedValue([{ ...API_BURGER, price_cents: 1299 }]);
    locationsListMock.mockResolvedValue([]);
    ingredientsListMock.mockResolvedValue([]);
    renderHook(() => useBootstrap());
    await act(async () => {});
    expect(addMenuBurgerMock).toHaveBeenCalledWith(
      expect.objectContaining({ price: 12.99 }),
    );
  });
});
