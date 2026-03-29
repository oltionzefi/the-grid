import { useState } from 'react';

import { Check } from 'lucide-react';
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type Ingredient,
  type IngredientCategory,
} from '@/modules/build/api/ingredients';

interface Props {
  ingredients: Ingredient[];
  selected: Ingredient[];
  onToggle: (ingredient: Ingredient) => void;
}

export default function IngredientPicker({ ingredients, selected, onToggle }: Props) {
  const [activeTab, setActiveTab] = useState<IngredientCategory>('bun');
  const selectedIds = new Set(selected.map((i) => i.id));

  const itemsForTab = ingredients.filter((i) => i.category === activeTab);
  const meta = CATEGORY_META[activeTab];

  return (
    <div className="flex flex-col h-full">
      {/* Tab bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-hide shrink-0">
        {CATEGORY_ORDER.map((cat) => {
          const m = CATEGORY_META[cat];
          const countInCat = selected.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={[
                'flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors relative shrink-0',
                activeTab === cat
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'bg-surface-secondary text-muted hover:text-foreground',
              ].join(' ')}
            >
              <span>{m.emoji}</span>
              <span className="hidden sm:inline">{m.label}</span>
              {countInCat > 0 && (
                <span
                  className={[
                    'min-w-[16px] h-4 rounded-full text-[10px] font-bold flex items-center justify-center px-1',
                    activeTab === cat ? 'bg-white/30 text-white' : 'bg-[var(--accent)] text-white',
                  ].join(' ')}
                >
                  {countInCat}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Category hint */}
      <p className="text-xs text-muted mt-2 mb-3 shrink-0">
        {meta.label} —{meta.multi ? 'Pick as many as you like' : 'Pick one'}
        {activeTab === 'patty' && (
          <span className="ml-1 text-amber-500 font-medium">✦ Required</span>
        )}
      </p>

      {/* Ingredient cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 overflow-y-auto flex-1 pr-0.5 pb-2">
        {itemsForTab.map((ing) => {
          const isSelected = selectedIds.has(ing.id);
          return (
            <button
              key={ing.id}
              onClick={() => onToggle(ing)}
              className={[
                'flex flex-col items-start gap-1 p-3 rounded-xl border text-left transition-all active:scale-95',
                isSelected
                  ? 'border-[var(--accent)] bg-[var(--accent)]/8 ring-1 ring-[var(--accent)]/30'
                  : 'border-border bg-overlay hover:border-[var(--accent)]/40 hover:bg-surface-secondary',
              ].join(' ')}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-2xl">{ing.emoji}</span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold leading-tight mt-0.5">{ing.name}</p>
              {ing.description && (
                <p className="text-[10px] text-muted leading-tight line-clamp-1">
                  {ing.description}
                </p>
              )}
              <p
                className={[
                  'text-xs font-bold mt-auto pt-1',
                  isSelected ? 'text-[var(--accent)]' : 'text-foreground',
                ].join(' ')}
              >
                +$
                {ing.price.toFixed(2)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
