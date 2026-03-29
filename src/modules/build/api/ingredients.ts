export type IngredientCategory = 'bun' | 'patty' | 'cheese' | 'veggie' | 'sauce';

export interface Ingredient {
  id: string;
  category: IngredientCategory;
  name: string;
  emoji: string;
  price: number;
  description?: string;
}

export const INGREDIENTS: Ingredient[] = [
  // Buns
  {
    id: 'bun-sesame',
    category: 'bun',
    name: 'Sesame Bun',
    emoji: '🫓',
    price: 0.5,
    description: 'Classic toasted sesame',
  },
  {
    id: 'bun-brioche',
    category: 'bun',
    name: 'Brioche Bun',
    emoji: '🫓',
    price: 0.8,
    description: 'Soft buttery brioche',
  },
  {
    id: 'bun-wheat',
    category: 'bun',
    name: 'Wheat Bun',
    emoji: '🫓',
    price: 0.6,
    description: 'Whole grain wholesome',
  },
  {
    id: 'bun-pretzel',
    category: 'bun',
    name: 'Pretzel Bun',
    emoji: '🥨',
    price: 0.9,
    description: 'Chewy pretzel crust',
  },

  // Patties
  {
    id: 'patty-smash',
    category: 'patty',
    name: 'Beef Smash',
    emoji: '🥩',
    price: 4.5,
    description: 'Crispy-edged smash patty',
  },
  {
    id: 'patty-double',
    category: 'patty',
    name: 'Double Beef',
    emoji: '🥩',
    price: 7.0,
    description: 'Two smash patties stacked',
  },
  {
    id: 'patty-chicken',
    category: 'patty',
    name: 'Crispy Chicken',
    emoji: '🍗',
    price: 4.0,
    description: 'Juicy crispy fried chicken',
  },
  {
    id: 'patty-veggie',
    category: 'patty',
    name: 'Black Bean',
    emoji: '🫘',
    price: 3.5,
    description: 'Hearty black bean patty',
  },
  {
    id: 'patty-beyond',
    category: 'patty',
    name: 'Beyond Meat',
    emoji: '🌿',
    price: 4.5,
    description: 'Plant-based, meat-like taste',
  },

  // Cheese
  {
    id: 'cheese-cheddar',
    category: 'cheese',
    name: 'Cheddar',
    emoji: '🧀',
    price: 0.5,
    description: 'Sharp aged cheddar',
  },
  {
    id: 'cheese-swiss',
    category: 'cheese',
    name: 'Swiss',
    emoji: '🧀',
    price: 0.5,
    description: 'Mild nutty Swiss',
  },
  {
    id: 'cheese-american',
    category: 'cheese',
    name: 'American',
    emoji: '🧀',
    price: 0.5,
    description: 'Classic melt',
  },
  {
    id: 'cheese-blue',
    category: 'cheese',
    name: 'Blue Cheese',
    emoji: '🧀',
    price: 0.8,
    description: 'Bold tangy crumbles',
  },

  // Veggies
  {
    id: 'veg-lettuce',
    category: 'veggie',
    name: 'Lettuce',
    emoji: '🥬',
    price: 0.3,
    description: 'Fresh iceberg crunch',
  },
  {
    id: 'veg-tomato',
    category: 'veggie',
    name: 'Tomato',
    emoji: '🍅',
    price: 0.3,
    description: 'Ripe sliced tomato',
  },
  {
    id: 'veg-onion',
    category: 'veggie',
    name: 'Red Onion',
    emoji: '🧅',
    price: 0.3,
    description: 'Thinly sliced red onion',
  },
  {
    id: 'veg-pickles',
    category: 'veggie',
    name: 'Pickles',
    emoji: '🥒',
    price: 0.3,
    description: 'Dill pickle chips',
  },
  {
    id: 'veg-jalapeno',
    category: 'veggie',
    name: 'Jalapeños',
    emoji: '🌶️',
    price: 0.4,
    description: 'Pickled jalapeño slices',
  },
  {
    id: 'veg-avocado',
    category: 'veggie',
    name: 'Avocado',
    emoji: '🥑',
    price: 0.8,
    description: 'Fresh creamy avocado',
  },
  {
    id: 'veg-mushroom',
    category: 'veggie',
    name: 'Mushrooms',
    emoji: '🍄',
    price: 0.6,
    description: 'Sautéed garlic mushrooms',
  },

  // Sauces
  {
    id: 'sauce-house',
    category: 'sauce',
    name: 'House Sauce',
    emoji: '🫙',
    price: 0.3,
    description: 'Our secret blend',
  },
  {
    id: 'sauce-bbq',
    category: 'sauce',
    name: 'BBQ',
    emoji: '🫙',
    price: 0.3,
    description: 'Smoky sweet BBQ',
  },
  {
    id: 'sauce-spicymayo',
    category: 'sauce',
    name: 'Spicy Mayo',
    emoji: '🌶️',
    price: 0.4,
    description: 'Sriracha mayo kick',
  },
  {
    id: 'sauce-aioli',
    category: 'sauce',
    name: 'Garlic Aioli',
    emoji: '🫙',
    price: 0.4,
    description: 'Classic roasted garlic',
  },
  {
    id: 'sauce-mustard',
    category: 'sauce',
    name: 'Mustard',
    emoji: '🫙',
    price: 0.2,
    description: 'Dijon or yellow',
  },
  {
    id: 'sauce-ketchup',
    category: 'sauce',
    name: 'Ketchup',
    emoji: '🫙',
    price: 0.2,
    description: 'Classic tomato',
  },
];

export const CATEGORY_META: Record<
  IngredientCategory,
  { label: string; emoji: string; multi: boolean }
> = {
  bun: { label: 'Bun', emoji: '🫓', multi: false },
  patty: { label: 'Patty', emoji: '🥩', multi: false },
  cheese: { label: 'Cheese', emoji: '🧀', multi: true },
  veggie: { label: 'Veggies', emoji: '🥬', multi: true },
  sauce: { label: 'Sauces', emoji: '🫙', multi: true },
};

export const CATEGORY_ORDER: IngredientCategory[] = ['bun', 'patty', 'cheese', 'veggie', 'sauce'];
