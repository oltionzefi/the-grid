import { useEffect, useState } from 'react';

import BurgerImage from '@/assets/burger.webp';

export interface Recipe {
  id: string;
  name: string;
  description: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  image: string;
  tags: string[];
}

const dummyRecipes: Recipe[] = [
  {
    id: 'r1',
    name: 'Classic Cheeseburger',
    description: 'A timeless classic with juicy beef, melted cheddar, crisp lettuce and tomato.',
    ingredients: [
      '200g beef mince',
      'Cheddar slice',
      'Brioche bun',
      'Lettuce',
      'Tomato',
      'Pickles',
      'Ketchup',
      'Mustard',
    ],
    steps: [
      'Season mince with salt and pepper, form into a patty.',
      'Grill on high heat 3–4 min per side.',
      'Melt cheese on top in last minute.',
      'Toast the bun, assemble with toppings.',
    ],
    prepTime: 10,
    cookTime: 10,
    servings: 1,
    difficulty: 'Easy',
    image: BurgerImage,
    tags: ['Beef', 'Classic'],
  },
  {
    id: 'r2',
    name: 'Spicy BBQ Bacon Burger',
    description: 'Smoky bacon, jalapeños and tangy BBQ sauce for those who like it hot.',
    ingredients: [
      '200g beef mince',
      'Streaky bacon (3 slices)',
      'Jalapeños',
      'BBQ sauce',
      'Smoked gouda',
      'Brioche bun',
      'Red onion',
    ],
    steps: [
      'Form the beef patty and season generously.',
      'Fry bacon until crispy.',
      'Grill patty 4 min each side, top with gouda.',
      'Assemble with BBQ sauce, bacon, jalapeños and onion.',
    ],
    prepTime: 15,
    cookTime: 15,
    servings: 1,
    difficulty: 'Easy',
    image: BurgerImage,
    tags: ['Beef', 'Spicy', 'BBQ'],
  },
  {
    id: 'r3',
    name: 'Mushroom Swiss Umami Burger',
    description: 'Sautéed mushrooms, Swiss cheese and truffle mayo elevate this umami bomb.',
    ingredients: [
      '200g beef mince',
      'Cremini mushrooms (100g)',
      'Swiss cheese',
      'Truffle mayo',
      'Sourdough bun',
      'Butter',
      'Thyme',
    ],
    steps: [
      'Sauté mushrooms in butter with thyme until golden.',
      'Grill patty to your liking.',
      'Top with Swiss and melt under the grill.',
      'Spread truffle mayo on bun and assemble.',
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 1,
    difficulty: 'Medium',
    image: BurgerImage,
    tags: ['Beef', 'Umami', 'Gourmet'],
  },
  {
    id: 'r4',
    name: 'Crispy Veggie Burger',
    description: 'A satisfying black bean and sweet potato patty with avocado and lime slaw.',
    ingredients: [
      '1 can black beans',
      '1 small sweet potato',
      'Breadcrumbs',
      'Avocado',
      'Red cabbage',
      'Lime juice',
      'Coriander',
      'Sesame bun',
    ],
    steps: [
      'Roast sweet potato, mash with drained beans.',
      'Mix in breadcrumbs, season and form patties.',
      'Pan-fry 4 min each side until golden.',
      'Make lime slaw, assemble with avocado.',
    ],
    prepTime: 20,
    cookTime: 20,
    servings: 2,
    difficulty: 'Medium',
    image: BurgerImage,
    tags: ['Vegan', 'Healthy'],
  },
  {
    id: 'r5',
    name: 'Smash Burger Stack',
    description: 'Double smashed patties with American cheese, crispy edges and special sauce.',
    ingredients: [
      '2x 100g beef balls',
      'American cheese (2 slices)',
      'Potato bun',
      'Shredded iceberg',
      'Pickles',
      'Special sauce (mayo + ketchup + mustard + relish)',
    ],
    steps: [
      'Mix special sauce ingredients and refrigerate.',
      'Heat a cast-iron skillet to screaming hot.',
      'Add beef balls and smash flat immediately.',
      'Cook 90 sec, flip, add cheese and steam.',
      'Stack double patties, assemble with sauce.',
    ],
    prepTime: 10,
    cookTime: 8,
    servings: 1,
    difficulty: 'Hard',
    image: BurgerImage,
    tags: ['Beef', 'Smash', 'Double'],
  },
  {
    id: 'r6',
    name: 'Chicken Avocado Burger',
    description: 'Grilled chicken breast, fresh avocado and herb aioli for a lighter bite.',
    ingredients: [
      '1 chicken breast',
      'Avocado',
      'Herb aioli (mayo + garlic + basil)',
      'Ciabatta bun',
      'Rocket',
      'Sun-dried tomatoes',
      'Lemon juice',
    ],
    steps: [
      'Butterfly chicken and marinate in lemon, garlic and herbs.',
      'Grill 5–6 min per side until cooked through.',
      'Make herb aioli by blending ingredients.',
      'Slice avocado, assemble with rocket and sun-dried tomatoes.',
    ],
    prepTime: 20,
    cookTime: 15,
    servings: 1,
    difficulty: 'Easy',
    image: BurgerImage,
    tags: ['Chicken', 'Healthy', 'Light'],
  },
];

const fetchRecipes = (): Promise<Recipe[]> =>
  new Promise((resolve) => setTimeout(() => resolve(dummyRecipes), 300));

export const useRecipes = (): { recipes: Recipe[]; loading: boolean } => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes().then((data) => {
      setRecipes(data);
      setLoading(false);
    });
  }, []);

  return { recipes, loading };
};
