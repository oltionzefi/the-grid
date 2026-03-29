import { test, expect, beforeEach } from 'vitest';
import { useBurgerStore } from '../index';

beforeEach(() => {
  useBurgerStore.setState({ burgers: [] });
});

test('initial state has empty burgers array', () => {
  const { burgers } = useBurgerStore.getState();
  expect(burgers).toEqual([]);
});

test('addBurger adds a new burger', () => {
  const { addBurger } = useBurgerStore.getState();
  addBurger({
    cartItemId: 'a-1',
    burgerId: '1',
    name: 'Classic Burger',
    category: 'Beef',
    description: 'A classic beef burger.',
    price: 9.99,
    image: 'classic-burger.webp',
    quantity: 1,
    extras: [],
    itemTotal: 9.99,
  });
  expect(useBurgerStore.getState().burgers).toHaveLength(1);
  expect((useBurgerStore.getState().burgers as any[])[0].burgerId).toBe('1');
});

test('addBurger always appends a new line item (no merge by id)', () => {
  const { addBurger } = useBurgerStore.getState();
  addBurger({
    cartItemId: 'a-1',
    burgerId: '1',
    name: 'Classic',
    category: 'Beef',
    description: 'A classic beef burger.',
    price: 9.99,
    image: 'classic.webp',
    quantity: 1,
    extras: [],
    itemTotal: 9.99,
  });
  addBurger({
    cartItemId: 'b-1',
    burgerId: '2',
    name: 'Veggie',
    category: 'Veggie',
    description: 'A plant-based patty.',
    price: 8.99,
    image: 'veggie.webp',
    quantity: 1,
    extras: [],
    itemTotal: 8.99,
  });
  addBurger({
    cartItemId: 'a-2',
    burgerId: '1',
    name: 'Classic',
    category: 'Beef',
    description: 'A classic beef burger.',
    price: 9.99,
    image: 'classic.webp',
    quantity: 1,
    extras: [],
    itemTotal: 9.99,
  });
  const burgers = useBurgerStore.getState().burgers as any[];
  // New store always appends — same burgerId = 3 separate line items
  expect(burgers).toHaveLength(3);
});

test('addBurger appends different burgers', () => {
  const { addBurger } = useBurgerStore.getState();
  addBurger({
    cartItemId: 'a-1',
    burgerId: '1',
    name: 'Classic',
    category: 'Beef',
    description: 'A classic beef burger.',
    price: 9.99,
    image: 'classic.webp',
    quantity: 1,
    extras: [],
    itemTotal: 9.99,
  });
  addBurger({
    cartItemId: 'b-1',
    burgerId: '2',
    name: 'Veggie',
    category: 'Veggie',
    description: 'A plant-based patty.',
    price: 8.99,
    image: 'veggie.webp',
    quantity: 1,
    extras: [],
    itemTotal: 8.99,
  });
  expect(useBurgerStore.getState().burgers).toHaveLength(2);
});

test('removeAllBurgers clears the cart', () => {
  const { addBurger, removeAllBurgers } = useBurgerStore.getState();
  addBurger({
    cartItemId: 'a-1',
    burgerId: '1',
    name: 'Classic',
    category: 'Beef',
    description: 'A classic beef burger.',
    price: 9.99,
    image: 'classic.webp',
    quantity: 1,
    extras: [],
    itemTotal: 9.99,
  });
  removeAllBurgers();
  expect(useBurgerStore.getState().burgers).toEqual([]);
});
