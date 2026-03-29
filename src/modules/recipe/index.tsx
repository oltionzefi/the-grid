import { useState } from 'react';
import { Card, Button } from '@heroui/react';
import { Clock, Users, ChefHat, Tag } from 'lucide-react';

import { useRecipes, type Recipe } from '@/modules/recipe/api/fetchRecipes';

const DIFFICULTY_STYLE: Record<Recipe['difficulty'], string> = {
  Easy: 'bg-green-500/15 text-green-700 dark:text-green-400',
  Medium: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Hard: 'bg-red-500/15 text-red-700 dark:text-red-400',
};

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="overflow-hidden flex flex-col">
      <Card.Content className="p-0">
        <img src={recipe.image} alt={recipe.name} className="w-full h-44 object-cover" />
      </Card.Content>

      <Card.Header className="px-4 pt-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base leading-snug">{recipe.name}</h3>
          <span
            className={[
              'text-xs px-2 py-0.5 rounded-full font-medium shrink-0',
              DIFFICULTY_STYLE[recipe.difficulty],
            ].join(' ')}
          >
            {recipe.difficulty}
          </span>
        </div>
        <p className="text-sm text-muted mt-1 line-clamp-2">{recipe.description}</p>
      </Card.Header>

      <Card.Content className="px-4 pb-3 flex flex-col gap-3 flex-1">
        <div className="flex items-center gap-4 text-xs text-muted">
          <span className="flex items-center gap-1">
            <Clock size={13} />
            Prep {recipe.prepTime}m
          </span>
          <span className="flex items-center gap-1">
            <ChefHat size={13} />
            Cook {recipe.cookTime}m
          </span>
          <span className="flex items-center gap-1">
            <Users size={13} />
            {recipe.servings}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 text-xs bg-surface-secondary px-2 py-0.5 rounded-full"
            >
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>

        {expanded && (
          <div className="flex flex-col gap-3 mt-1">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-1.5">
                Ingredients
              </p>
              <ul className="list-disc list-inside text-sm space-y-0.5">
                {recipe.ingredients.map((ing) => (
                  <li key={ing}>{ing}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted mb-1.5">
                Steps
              </p>
              <ol className="list-decimal list-inside text-sm space-y-1">
                {recipe.steps.map((step, i) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </Card.Content>

      <Card.Footer className="px-4 pb-4">
        <Button variant="ghost" size="sm" fullWidth onPress={() => setExpanded((v) => !v)}>
          {expanded ? 'Hide recipe' : 'View recipe'}
        </Button>
      </Card.Footer>
    </Card>
  );
}

function Recipe() {
  const { recipes, loading } = useRecipes();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted text-sm">
        Loading recipes…
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Recipes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}

export default Recipe;
