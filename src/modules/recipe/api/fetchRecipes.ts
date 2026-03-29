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
  featured?: boolean;
}

const dummyRecipes: Recipe[] = [
  {
    id: 'r1',
    name: 'Classic Cheeseburger',
    description: 'A timeless classic with juicy beef, melted cheddar, crisp lettuce and tomato.',
    ingredients: [
      '200g beef mince (80/20 fat ratio)',
      '1 thick slice aged cheddar',
      '1 brioche bun, split and toasted',
      '2 leaves butter lettuce',
      '2 slices ripe tomato',
      '6 dill pickle slices',
      '1 tbsp ketchup',
      '1 tsp yellow mustard',
      'Salt and freshly cracked pepper',
    ],
    steps: [
      'Divide mince into a loose 200g ball — do not over-work the meat.',
      'Season generously with salt and pepper on both sides just before cooking.',
      'Grill or pan-fry on high heat for 3–4 min per side for medium.',
      'Lay the cheddar on in the last 60 seconds, cover to melt.',
      'Toast the bun cut-side down in the same pan for 30 sec.',
      'Build: bottom bun → mustard → lettuce → tomato → patty with cheese → pickles → ketchup → top bun.',
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
      '3 slices thick-cut streaky bacon',
      '6 slices pickled jalapeños',
      '2 tbsp smoky BBQ sauce',
      '1 slice smoked gouda',
      '1 brioche bun',
      '2 rings red onion',
      'Chipotle mayo',
    ],
    steps: [
      'Form the beef into a patty, season on both sides.',
      'Fry bacon in a dry skillet over medium heat until crispy; set aside.',
      'Grill patty on high heat 4 min each side.',
      'In the last minute, drape with gouda and cover to melt.',
      'Toast bun, spread chipotle mayo on both sides.',
      'Layer: bottom bun → onion → patty → bacon → jalapeños → BBQ sauce → top bun.',
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
      '100g cremini mushrooms, sliced',
      '1 slice Swiss cheese',
      '1 tbsp truffle mayo',
      '1 sourdough bun',
      '1 tbsp unsalted butter',
      '2 sprigs fresh thyme',
      '1 garlic clove, minced',
    ],
    steps: [
      'Melt butter in a skillet over medium heat; add mushrooms, thyme and garlic.',
      'Sauté 8–10 min until deep golden and moisture has evaporated.',
      'Season beef and grill patty to your liking.',
      'Lay Swiss cheese on patty and cover to melt in final 2 min.',
      'Spread truffle mayo generously on both bun halves.',
      'Assemble with mushrooms piled on top of the patty.',
    ],
    prepTime: 15,
    cookTime: 20,
    servings: 1,
    difficulty: 'Medium',
    image: BurgerImage,
    tags: ['Beef', 'Gourmet'],
  },
  {
    id: 'r4',
    name: 'Crispy Veggie Burger',
    description: 'A satisfying black bean and sweet potato patty with avocado and lime slaw.',
    ingredients: [
      '1 × 400g can black beans, drained and rinsed',
      '1 small sweet potato (about 200g), roasted',
      '60g panko breadcrumbs',
      '1 avocado, sliced',
      '100g red cabbage, thinly shredded',
      '2 tbsp lime juice',
      'Small bunch coriander',
      '1 sesame bun',
      '1 tsp cumin, 1 tsp smoked paprika',
    ],
    steps: [
      'Roast sweet potato at 200 °C for 25 min, then mash.',
      'Combine with drained beans, panko, cumin and paprika; season well.',
      'Form into 2 patties and refrigerate 30 min to firm up.',
      'Pan-fry in a little oil over medium heat, 4 min each side until golden-crisp.',
      'Toss cabbage with lime juice, coriander and a pinch of salt to make slaw.',
      'Assemble: bun → avocado → patty → slaw → top bun.',
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
      '2 × 100g loose beef balls (80/20)',
      '2 slices American cheese',
      '1 soft potato bun',
      'Shredded iceberg lettuce',
      'Sliced dill pickles',
      '2 tbsp mayo, 1 tbsp ketchup, 1 tsp yellow mustard, 1 tsp sweet relish',
      'Neutral oil for the skillet',
    ],
    steps: [
      'Mix mayo, ketchup, mustard and relish; refrigerate as special sauce.',
      'Heat a cast-iron skillet over high heat until smoking.',
      'Place first beef ball on the skillet and immediately smash flat with a spatula.',
      'Season with salt and pepper; cook 90 seconds until edges are deeply crispy.',
      'Flip, lay cheese on top, cook 30 sec more.',
      'Repeat for second patty; stack both on the toasted bun with sauce.',
    ],
    prepTime: 10,
    cookTime: 8,
    servings: 1,
    difficulty: 'Hard',
    image: BurgerImage,
    tags: ['Beef', 'Smash', 'Double'],
    featured: true,
  },
  {
    id: 'r6',
    name: 'Chicken Avocado Burger',
    description: 'Grilled chicken breast, fresh avocado and herb aioli for a lighter bite.',
    ingredients: [
      '1 large chicken breast',
      '1 ripe avocado',
      '3 tbsp mayo',
      '1 garlic clove, minced',
      'Small handful fresh basil',
      '1 ciabatta bun',
      'Handful of rocket',
      '4 sun-dried tomatoes in oil',
      'Juice of ½ lemon',
    ],
    steps: [
      'Butterfly the chicken breast to an even thickness.',
      'Marinate in lemon juice, garlic, olive oil and herbs for 20 min.',
      'Grill over medium-high heat 5–6 min per side until cooked through.',
      'Blend mayo with garlic and basil to make herb aioli.',
      'Slice avocado and season with a pinch of sea salt.',
      'Assemble with rocket, sun-dried tomatoes and herb aioli.',
    ],
    prepTime: 20,
    cookTime: 15,
    servings: 1,
    difficulty: 'Easy',
    image: BurgerImage,
    tags: ['Chicken', 'Healthy', 'Light'],
  },
  {
    id: 'r7',
    name: 'Korean BBQ Smash Burger',
    description: 'Gochujang-glazed patty, pickled daikon, kimchi aioli and crispy shallots.',
    ingredients: [
      '200g beef mince',
      '2 tbsp gochujang paste',
      '1 tbsp soy sauce',
      '1 tsp sesame oil',
      '50g daikon, julienned',
      '2 tbsp rice vinegar',
      '1 tsp sugar',
      '2 tbsp mayo + 1 tbsp kimchi (blended for kimchi aioli)',
      '2 tbsp crispy fried shallots',
      '1 brioche bun',
      'Spring onion, thinly sliced',
    ],
    steps: [
      'Quick-pickle daikon: toss with rice vinegar, sugar and a pinch of salt; set aside 20 min.',
      'Mix gochujang, soy sauce and sesame oil into a glaze.',
      'Form beef into a patty and smash flat on a ripping hot skillet.',
      'Cook 2 min, flip, brush with gochujang glaze and cook 1 min more.',
      'Blend mayo with kimchi until smooth for the aioli.',
      'Build: toasted bun → kimchi aioli → patty → pickled daikon → crispy shallots → spring onion.',
    ],
    prepTime: 25,
    cookTime: 10,
    servings: 1,
    difficulty: 'Medium',
    image: BurgerImage,
    tags: ['Beef', 'Spicy', 'Asian'],
  },
  {
    id: 'r8',
    name: 'Nashville Hot Chicken Burger',
    description: 'Crispy cayenne-fried chicken thigh, dill pickles and cooling buttermilk slaw.',
    ingredients: [
      '1 boneless chicken thigh',
      '200ml buttermilk',
      '100g plain flour',
      '2 tbsp cayenne pepper',
      '1 tbsp smoked paprika',
      '1 tsp garlic powder',
      '3 tbsp neutral oil (for hot sauce)',
      'Dill pickles',
      '100g white cabbage, shredded',
      '2 tbsp buttermilk ranch dressing',
      '1 brioche bun',
    ],
    steps: [
      'Marinate chicken thigh in buttermilk with salt for at least 1 hour.',
      'Mix flour with half the cayenne, paprika and garlic powder.',
      'Dredge marinated chicken in seasoned flour; shake off excess.',
      'Deep-fry at 175 °C for 7–8 min until golden and cooked through.',
      'Warm oil with remaining cayenne, paprika and a pinch of sugar; brush over hot chicken.',
      'Toss cabbage with ranch dressing for the slaw.',
      'Stack: bottom bun → pickles → slaw → hot chicken → top bun.',
    ],
    prepTime: 70,
    cookTime: 15,
    servings: 1,
    difficulty: 'Hard',
    image: BurgerImage,
    tags: ['Chicken', 'Spicy'],
  },
  {
    id: 'r9',
    name: 'Greek Lamb Burger',
    description: 'Herbed lamb patty with cool tzatziki, crumbled feta and fresh cucumber.',
    ingredients: [
      '250g lamb mince',
      '1 garlic clove, minced',
      '1 tbsp fresh mint, chopped',
      '1 tsp dried oregano',
      '½ tsp cumin',
      '100g Greek yoghurt',
      '½ cucumber (half grated for tzatziki, half sliced)',
      '1 tbsp lemon juice',
      '40g feta, crumbled',
      '1 pita or ciabatta bun',
      'Baby gem lettuce leaves',
    ],
    steps: [
      'Combine lamb with garlic, mint, oregano and cumin; season well.',
      'Form into a thick patty — do not over-mix.',
      'Grill on medium-high heat 4–5 min per side.',
      'Make tzatziki: grate cucumber, squeeze out moisture, mix with yoghurt, lemon juice, mint and a pinch of salt.',
      'Lightly toast the bun or warm the pita.',
      'Assemble: bun → lettuce → patty → tzatziki → sliced cucumber → crumbled feta.',
    ],
    prepTime: 15,
    cookTime: 12,
    servings: 1,
    difficulty: 'Medium',
    image: BurgerImage,
    tags: ['Lamb', 'Mediterranean', 'Healthy'],
  },
  {
    id: 'r10',
    name: 'Wagyu Truffle Burger',
    description:
      'A5 Wagyu patty, black truffle mayo, caramelised onion and aged Gruyère on a brioche.',
    ingredients: [
      '200g A5 Wagyu beef mince',
      '1 slice aged Gruyère',
      '2 tbsp black truffle mayo',
      '1 large onion, thinly sliced',
      '1 tbsp butter',
      '1 tsp brown sugar',
      '1 tsp balsamic vinegar',
      '1 premium brioche bun',
      'Flaky sea salt',
      'Micro herbs for garnish',
    ],
    steps: [
      'Slowly caramelise onions in butter over low heat for 30–40 min; deglaze with balsamic and sugar.',
      'Handle Wagyu mince as little as possible; form a loose 200g patty.',
      'Cook in a dry, very hot cast-iron pan — Wagyu has enough fat — 2 min per side for medium-rare.',
      'Season with flaky salt immediately off the heat.',
      'Lay Gruyère on the patty and rest 2 min off the heat to melt.',
      'Spread truffle mayo on both bun halves.',
      'Build: bun → caramelised onions → patty with Gruyère → micro herbs → top bun.',
    ],
    prepTime: 45,
    cookTime: 10,
    servings: 1,
    difficulty: 'Hard',
    image: BurgerImage,
    tags: ['Beef', 'Gourmet'],
    featured: true,
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
