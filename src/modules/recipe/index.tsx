import { useState, useMemo } from 'react';
import { Button } from '@heroui/react';
import {
  Clock,
  Users,
  ChefHat,
  X,
  FlameKindling,
  Leaf,
  Beef,
  Drumstick,
  UtensilsCrossed,
  CheckCircle2,
  Circle,
  Flame,
  Zap,
} from 'lucide-react';

import { useRecipes, type Recipe } from '@/modules/recipe/api/fetchRecipes';

// ── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTY_CONFIG: Record<
  Recipe['difficulty'],
  { bg: string; text: string; icon: React.ReactNode; label: string }
> = {
  Easy: {
    bg: 'bg-green-500',
    text: 'text-white',
    icon: <Leaf size={11} strokeWidth={2.5} />,
    label: 'Easy',
  },
  Medium: {
    bg: 'bg-amber-500',
    text: 'text-white',
    icon: <Zap size={11} strokeWidth={2.5} />,
    label: 'Medium',
  },
  Hard: {
    bg: 'bg-red-600',
    text: 'text-white',
    icon: <Flame size={11} strokeWidth={2.5} />,
    label: 'Hard',
  },
};

const TAG_ICONS: Record<string, React.ReactNode> = {
  Beef: <Beef size={11} />,
  Chicken: <Drumstick size={11} />,
  Vegan: <Leaf size={11} />,
  Spicy: <FlameKindling size={11} />,
  Healthy: <Leaf size={11} />,
};

const CATEGORIES = ['All', 'Beef', 'Chicken', 'Vegan', 'Spicy', 'Gourmet'];

// ── Helpers ──────────────────────────────────────────────────────────────────

function totalTime(recipe: Recipe) {
  return recipe.prepTime + recipe.cookTime;
}

function DifficultyBadge({ difficulty }: { difficulty: Recipe['difficulty'] }) {
  const c = DIFFICULTY_CONFIG[difficulty];
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold ${c.bg} ${c.text}`}
    >
      {c.icon}
      {c.label}
    </span>
  );
}

function MetaRow({ recipe }: { recipe: Recipe }) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted">
      <span className="flex items-center gap-1">
        <Clock size={12} />
        {recipe.prepTime}m prep
      </span>
      <span className="w-px h-3 bg-current opacity-20" />
      <span className="flex items-center gap-1">
        <ChefHat size={12} />
        {recipe.cookTime}m cook
      </span>
      <span className="w-px h-3 bg-current opacity-20" />
      <span className="flex items-center gap-1">
        <Users size={12} />
        {recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}
      </span>
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 text-xs bg-surface-secondary px-2 py-0.5 rounded-full text-muted"
        >
          {TAG_ICONS[tag] ?? <UtensilsCrossed size={11} />}
          {tag}
        </span>
      ))}
    </div>
  );
}

// ── Featured hero card ────────────────────────────────────────────────────────

function HeroCard({ recipe, onOpen }: { recipe: Recipe; onOpen: (r: Recipe) => void }) {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden cursor-pointer group"
      style={{ height: 320 }}
      role="button"
      tabIndex={0}
      onClick={() => onOpen(recipe)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(recipe)}
    >
      {/* Image */}
      <img
        src={recipe.image}
        alt={recipe.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      {/* Featured pill */}
      <div className="absolute top-4 left-4">
        <span className="text-xs font-semibold bg-[var(--accent)] text-white px-3 py-1 rounded-full uppercase tracking-wide">
          Chef's Pick
        </span>
      </div>

      {/* Total time pill */}
      <div className="absolute top-4 right-4">
        <span className="text-xs font-medium bg-black/60 text-white backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5">
          <Clock size={11} />
          {totalTime(recipe)} min
        </span>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5 flex flex-col gap-2">
        <DifficultyBadge difficulty={recipe.difficulty} />
        <h2 className="text-2xl font-bold text-white leading-tight">{recipe.name}</h2>
        <p className="text-sm text-white/75 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center justify-between mt-1">
          <MetaRow recipe={recipe} />
          <button
            className="text-xs font-semibold text-white bg-[var(--accent)] hover:opacity-90 px-4 py-1.5 rounded-full transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onOpen(recipe);
            }}
          >
            View Recipe →
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Recipe card ───────────────────────────────────────────────────────────────

function RecipeCard({ recipe, onOpen }: { recipe: Recipe; onOpen: (r: Recipe) => void }) {
  return (
    <div
      data-slot="card"
      className="group flex flex-col rounded-xl overflow-hidden border border-divider bg-surface cursor-pointer hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
      role="button"
      tabIndex={0}
      onClick={() => onOpen(recipe)}
      onKeyDown={(e) => e.key === 'Enter' && onOpen(recipe)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 160 }}>
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-400"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        {/* Difficulty badge on image */}
        <div className="absolute top-2.5 right-2.5">
          <DifficultyBadge difficulty={recipe.difficulty} />
        </div>
        {/* Time pill */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="text-xs bg-black/60 text-white backdrop-blur-sm px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock size={10} />
            {totalTime(recipe)}m
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        <h3 className="font-bold text-sm leading-snug line-clamp-1">{recipe.name}</h3>
        <p className="text-xs text-muted line-clamp-2 leading-relaxed">{recipe.description}</p>
        <MetaRow recipe={recipe} />
        <TagList tags={recipe.tags} />
      </div>

      {/* Footer */}
      <div className="px-3 pb-3">
        <Button variant="ghost" size="sm" fullWidth onPress={() => onOpen(recipe)}>
          View recipe
        </Button>
      </div>
    </div>
  );
}

// ── Recipe drawer ─────────────────────────────────────────────────────────────

function RecipeDrawer({ recipe, onClose }: { recipe: Recipe | null; onClose: () => void }) {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleIngredient = (ing: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(ing)) next.delete(ing);
      else next.add(ing);
      return next;
    });
  };

  const isOpen = recipe !== null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-full max-w-[480px] bg-surface shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {recipe && (
          <>
            {/* Hero image */}
            <div className="relative shrink-0" style={{ height: 220 }}>
              <img src={recipe.image} alt={recipe.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Close button */}
              <button
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                onClick={onClose}
                aria-label="Close recipe"
              >
                <X size={16} />
              </button>

              {/* Overlaid title */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <DifficultyBadge difficulty={recipe.difficulty} />
                <h2 className="text-xl font-bold text-white mt-1.5 leading-tight">{recipe.name}</h2>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
              {/* Description + meta */}
              <div className="flex flex-col gap-3">
                <p className="text-sm text-muted leading-relaxed">{recipe.description}</p>
                <MetaRow recipe={recipe} />
                <TagList tags={recipe.tags} />
              </div>

              <hr className="border-divider" />

              {/* Ingredients */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">
                  Ingredients
                </p>
                <ul className="flex flex-col gap-2">
                  {recipe.ingredients.map((ing) => {
                    const done = checked.has(ing);
                    return (
                      <li key={ing}>
                        <button
                          className={`w-full flex items-start gap-2.5 text-left text-sm transition-opacity ${done ? 'opacity-40' : ''}`}
                          onClick={() => toggleIngredient(ing)}
                        >
                          {done ? (
                            <CheckCircle2 size={16} className="text-green-500 mt-0.5 shrink-0" />
                          ) : (
                            <Circle size={16} className="text-muted mt-0.5 shrink-0" />
                          )}
                          <span className={done ? 'line-through' : ''}>{ing}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <hr className="border-divider" />

              {/* Steps */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-3">Steps</p>
                <ol className="flex flex-col gap-4">
                  {recipe.steps.map((step, i) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={i} className="flex gap-3">
                      <div className="shrink-0 w-7 h-7 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] text-xs font-bold flex items-center justify-center mt-0.5">
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed pt-1">{step}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Bottom pad */}
              <div className="h-4" />
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── Category tabs ─────────────────────────────────────────────────────────────

function CategoryTabs({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
      {CATEGORIES.map((cat) => {
        const isActive = cat === active;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={[
              'shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-[var(--accent)] text-white shadow-sm'
                : 'bg-surface-secondary text-muted hover:text-foreground',
            ].join(' ')}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

function RecipePage() {
  const { recipes, loading } = useRecipes();
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState<Recipe | null>(null);

  const featuredRecipe = useMemo(
    () => recipes.find((r) => r.featured) ?? recipes[0] ?? null,
    [recipes],
  );

  const filteredRecipes = useMemo(() => {
    const nonFeatured = recipes.filter((r) => r.id !== featuredRecipe?.id);
    if (activeCategory === 'All') return nonFeatured;
    return nonFeatured.filter((r) => r.tags.some((t) => t === activeCategory));
  }, [recipes, activeCategory, featuredRecipe]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-muted text-sm">
        Loading recipes…
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Recipes</h1>
        <p className="text-sm text-muted mt-0.5">
          {recipes.length} recipes · find your next favourite burger
        </p>
      </div>

      {/* Featured hero */}
      {featuredRecipe && <HeroCard recipe={featuredRecipe} onOpen={setSelected} />}

      {/* Category tabs */}
      <CategoryTabs active={activeCategory} onChange={setActiveCategory} />

      {/* Grid */}
      {filteredRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted gap-2">
          <UtensilsCrossed size={32} className="opacity-30" />
          <p className="text-sm">No recipes in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onOpen={setSelected} />
          ))}
        </div>
      )}

      {/* Recipe drawer */}
      <RecipeDrawer recipe={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default RecipePage;
