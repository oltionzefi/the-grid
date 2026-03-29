import { useEffect, useState } from 'react';

import BurgerImage from '@/assets/burger.webp';

export interface Topping {
  id: string;
  name: string;
  price: number;
  category: 'sauce' | 'topping' | 'extra';
}

export interface Burger {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  image: string;
  category: string;
  badge?: {
    text?: string;
    color?: string;
  };
  toppings: Topping[];
}

const SAUCES: Topping[] = [
  { id: 's1', name: 'Ketchup', price: 0, category: 'sauce' },
  { id: 's2', name: 'Mustard', price: 0, category: 'sauce' },
  { id: 's3', name: 'Mayo', price: 0, category: 'sauce' },
  { id: 's4', name: 'BBQ Sauce', price: 0, category: 'sauce' },
  { id: 's5', name: 'Chipotle', price: 0.5, category: 'sauce' },
  { id: 's6', name: 'Sriracha', price: 0.5, category: 'sauce' },
];

const TOPPINGS: Topping[] = [
  { id: 't1', name: 'Lettuce', price: 0, category: 'topping' },
  { id: 't2', name: 'Tomato', price: 0, category: 'topping' },
  { id: 't3', name: 'Red Onion', price: 0, category: 'topping' },
  { id: 't4', name: 'Pickles', price: 0, category: 'topping' },
  { id: 't5', name: 'Jalapeños', price: 0.5, category: 'topping' },
  { id: 't6', name: 'Avocado', price: 1.29, category: 'topping' },
];

const EXTRAS: Topping[] = [
  { id: 'e1', name: 'Extra Cheese', price: 0.99, category: 'extra' },
  { id: 'e2', name: 'Bacon', price: 1.49, category: 'extra' },
  { id: 'e3', name: 'Double Patty', price: 2.49, category: 'extra' },
  { id: 'e4', name: 'Fried Egg', price: 1.19, category: 'extra' },
];

export const ALL_TOPPINGS = [...TOPPINGS, ...SAUCES, ...EXTRAS];

export const DEFAULT_BURGERS: Burger[] = [
  {
    id: '691d41cd-c4b3-45cb-8945-aa2428c9cd87',
    name: 'Cheeseburger',
    description: 'A classic cheeseburger with lettuce, tomato, and cheese.',
    price: 5.99,
    image: BurgerImage,
    category: 'Beef',
    badge: { text: 'New', color: 'green' },
    toppings: ALL_TOPPINGS,
  },
  {
    id: 'bcfa98eb-c73b-44d0-95ff-0f14a89ab12b',
    name: 'Veggie Burger',
    description: 'A delicious veggie burger with a black bean patty.',
    price: 6.49,
    image: BurgerImage,
    category: 'Veggie',
    badge: { text: 'Favorite', color: 'blue' },
    toppings: ALL_TOPPINGS,
  },
  {
    id: '599e8e0c-f918-4e25-8a3e-e2cfa3ed9657',
    name: 'Bacon Burger',
    description: 'A juicy burger topped with crispy bacon and cheddar cheese.',
    price: 7.99,
    image: BurgerImage,
    category: 'Beef',
    toppings: ALL_TOPPINGS,
  },
  {
    id: 'd3a85d7b-769c-40e2-a2ec-d164311e439f',
    name: 'BBQ Chicken',
    description: 'Grilled chicken breast with BBQ sauce and coleslaw.',
    price: 8.49,
    image: BurgerImage,
    category: 'Chicken',
    badge: { text: 'Popular', color: 'orange' },
    toppings: ALL_TOPPINGS,
  },
  {
    id: '8785dfcb-5c81-416e-a598-28e3c6198fbc',
    name: 'Mushroom Swiss',
    description: 'A savory burger topped with sautéed mushrooms and Swiss cheese.',
    price: 7.49,
    image: BurgerImage,
    category: 'Beef',
    toppings: ALL_TOPPINGS,
  },
  {
    id: 'a4c2f9e1-b8d3-4f7a-9c6e-d2b5e8f0a1c3',
    name: 'Spicy Crispy Chicken',
    description: 'Crispy fried chicken with house hot sauce and pickled slaw.',
    price: 8.99,
    image: BurgerImage,
    category: 'Chicken',
    badge: { text: 'Hot', color: 'red' },
    toppings: ALL_TOPPINGS,
  },
  {
    id: 'f7d1a3c5-e9b2-4d8f-a0c6-b3e7f2d4a8c1',
    name: 'Plant-Based Stack',
    description: 'Beyond patty with vegan cheese, roasted peppers, and herb aioli.',
    price: 9.49,
    image: BurgerImage,
    category: 'Veggie',
    badge: { text: 'Vegan', color: 'green' },
    toppings: ALL_TOPPINGS,
  },
];

const fetchBurgers = (): Promise<Burger[]> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(DEFAULT_BURGERS));
  });

export const useFetchBurgers = (): Burger[] => {
  const [burgers, setBurgers] = useState<Burger[]>([]);

  useEffect(() => {
    fetchBurgers().then((data) => setBurgers(data));
  }, []);

  return burgers;
};
