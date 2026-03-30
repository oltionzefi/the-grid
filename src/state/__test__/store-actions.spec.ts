/**
 * Additional state store tests covering uncovered action branches.
 * Focuses on: locations, menuBurgers, builderIngredients, storeConfig, updateQuantity.
 */
import { describe, test, expect, beforeEach } from 'vitest';
import { useBurgerStore } from '../index';

const BASE_LOCATION = {
  id: 'loc1',
  name: 'Test Location',
  address: { street: '1 Main', city: 'Munich', state: 'Bavaria' },
};

const BASE_BURGER = {
  id: 'b1',
  name: 'Classic',
  description: 'A burger',
  price: 5.99,
  image: '',
  category: 'Beef',
  toppings: [],
};

const BASE_INGREDIENT = {
  id: 'ing1',
  name: 'Lettuce',
  category: 'veggie' as const,
  emoji: '🥬',
  price: 0,
};

const CART_ITEM = {
  cartItemId: 'c1',
  burgerId: 'b1',
  name: 'Classic',
  category: 'Beef',
  description: 'A burger',
  price: 5.99,
  image: '',
  quantity: 2,
  extras: [],
  itemTotal: 11.98,
};

beforeEach(() => {
  useBurgerStore.setState({
    burgers: [],
    shopLocations: [],
    menuBurgers: [],
    builderIngredients: [],
    preferredLocationId: null,
    locationEnabled: false,
    storeConfig: { name: 'The Grid', emoji: '🍔' },
  });
});

// ── Locations ──────────────────────────────────────────────────────────────

describe('shopLocations', () => {
  test('addShopLocation appends a location', () => {
    useBurgerStore.getState().addShopLocation(BASE_LOCATION);
    expect(useBurgerStore.getState().shopLocations).toHaveLength(1);
  });

  test('updateShopLocation replaces by id', () => {
    useBurgerStore.getState().addShopLocation(BASE_LOCATION);
    useBurgerStore.getState().updateShopLocation({ ...BASE_LOCATION, name: 'Updated' });
    expect(useBurgerStore.getState().shopLocations[0].name).toBe('Updated');
  });

  test('removeShopLocation removes by id', () => {
    useBurgerStore.getState().addShopLocation(BASE_LOCATION);
    useBurgerStore.getState().removeShopLocation('loc1');
    expect(useBurgerStore.getState().shopLocations).toHaveLength(0);
  });

  test('setPreferredLocation stores id', () => {
    useBurgerStore.getState().setPreferredLocation('loc1');
    expect(useBurgerStore.getState().preferredLocationId).toBe('loc1');
  });

  test('setLocationEnabled toggles flag', () => {
    useBurgerStore.getState().setLocationEnabled(true);
    expect(useBurgerStore.getState().locationEnabled).toBe(true);
  });
});

// ── Menu burgers ──────────────────────────────────────────────────────────

describe('menuBurgers', () => {
  test('addMenuBurger appends', () => {
    useBurgerStore.getState().addMenuBurger(BASE_BURGER);
    expect(useBurgerStore.getState().menuBurgers).toHaveLength(1);
  });

  test('updateMenuBurger replaces by id', () => {
    useBurgerStore.getState().addMenuBurger(BASE_BURGER);
    useBurgerStore.getState().updateMenuBurger({ ...BASE_BURGER, name: 'Deluxe' });
    expect(useBurgerStore.getState().menuBurgers[0].name).toBe('Deluxe');
  });

  test('removeMenuBurger removes by id', () => {
    useBurgerStore.getState().addMenuBurger(BASE_BURGER);
    useBurgerStore.getState().removeMenuBurger('b1');
    expect(useBurgerStore.getState().menuBurgers).toHaveLength(0);
  });
});

// ── Builder ingredients ───────────────────────────────────────────────────

describe('builderIngredients', () => {
  test('addBuilderIngredient appends', () => {
    useBurgerStore.getState().addBuilderIngredient(BASE_INGREDIENT);
    expect(useBurgerStore.getState().builderIngredients).toHaveLength(1);
  });

  test('updateBuilderIngredient replaces by id', () => {
    useBurgerStore.getState().addBuilderIngredient(BASE_INGREDIENT);
    useBurgerStore.getState().updateBuilderIngredient({ ...BASE_INGREDIENT, name: 'Spinach' });
    expect(useBurgerStore.getState().builderIngredients[0].name).toBe('Spinach');
  });

  test('removeBuilderIngredient removes by id', () => {
    useBurgerStore.getState().addBuilderIngredient(BASE_INGREDIENT);
    useBurgerStore.getState().removeBuilderIngredient('ing1');
    expect(useBurgerStore.getState().builderIngredients).toHaveLength(0);
  });
});

// ── Store config ──────────────────────────────────────────────────────────

describe('storeConfig', () => {
  test('setStoreConfig merges partial update', () => {
    useBurgerStore.getState().setStoreConfig({ name: 'New Name' });
    expect(useBurgerStore.getState().storeConfig.name).toBe('New Name');
    expect(useBurgerStore.getState().storeConfig.emoji).toBe('🍔');
  });

  test('setStoreConfig updates emoji', () => {
    useBurgerStore.getState().setStoreConfig({ emoji: '🌮' });
    expect(useBurgerStore.getState().storeConfig.emoji).toBe('🌮');
  });
});

// ── Cart quantity ─────────────────────────────────────────────────────────

describe('updateQuantity', () => {
  beforeEach(() => {
    useBurgerStore.setState({ burgers: [CART_ITEM] });
  });

  test('updateQuantity changes quantity and recalculates itemTotal', () => {
    useBurgerStore.getState().updateQuantity('c1', 3);
    const item = useBurgerStore.getState().burgers[0];
    expect(item.quantity).toBe(3);
    expect(item.itemTotal).toBe(5.99 * 3);
  });

  test('updateQuantity with 0 removes the item', () => {
    useBurgerStore.getState().updateQuantity('c1', 0);
    expect(useBurgerStore.getState().burgers).toHaveLength(0);
  });

  test('updateQuantity with negative removes the item', () => {
    useBurgerStore.getState().updateQuantity('c1', -1);
    expect(useBurgerStore.getState().burgers).toHaveLength(0);
  });

  test('removeBurger removes single item by cartItemId', () => {
    useBurgerStore.getState().removeBurger('c1');
    expect(useBurgerStore.getState().burgers).toHaveLength(0);
  });
});
