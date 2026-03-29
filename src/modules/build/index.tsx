import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Button, toast } from '@heroui/react';
import { ArrowLeft, ChevronRight, RotateCcw, ShoppingBag } from 'lucide-react';

import { useBurgerStore, type CartItem, type CartExtra } from '@/state';

import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type Ingredient,
  type IngredientCategory,
} from '@/modules/build/api/ingredients';

import BurgerBoard from '@/modules/build/components/BurgerBoard';

import IngredientPicker from '@/modules/build/components/IngredientPicker';

import NameBurgerModal from '@/modules/build/components/NameBurgerModal';

import BurgerImage from '@/assets/burger.webp';

function BuildPage() {
  const navigate = useNavigate();
  const addBurger = useBurgerStore((s) => s.addBurger);
  const builderIngredients = useBurgerStore((s) => s.builderIngredients);

  // Selected ingredients: single for bun/patty, multi for the rest
  const [selected, setSelected] = useState<Ingredient[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const hasPatty = selected.some((i) => i.category === 'patty');
  const hasBun = selected.some((i) => i.category === 'bun');

  const totalPrice = useMemo(() => selected.reduce((sum, i) => sum + i.price, 0), [selected]);

  const handleToggle = (ingredient: Ingredient) => {
    const meta = CATEGORY_META[ingredient.category];
    setSelected((prev) => {
      const alreadySelected = prev.find((i) => i.id === ingredient.id);
      if (alreadySelected) {
        // Deselect
        return prev.filter((i) => i.id !== ingredient.id);
      }
      if (!meta.multi) {
        // Single-select: replace existing in category
        return [...prev.filter((i) => i.category !== ingredient.category), ingredient];
      }
      // Multi-select: add
      return [...prev, ingredient];
    });
  };

  const handleReset = () => setSelected([]);

  const handleFinish = () => {
    if (!hasPatty) {
      toast.danger('Add a patty first!', { description: 'Your burger needs a patty to continue.' });
      return;
    }
    setModalOpen(true);
  };

  const handleConfirmName = (name: string) => {
    const patty = selected.find((i) => i.category === 'patty')!;
    const extras: CartExtra[] = selected
      .filter((i) => i.category !== 'patty')
      .map((i) => ({ id: i.id, name: i.name, price: i.price }));

    const item: CartItem = {
      cartItemId: `custom-${Date.now()}`,
      burgerId: 'custom',
      name,
      category: 'Custom',
      description: selected.map((i) => i.name).join(', '),
      price: patty.price,
      image: BurgerImage,
      quantity: 1,
      extras,
      itemTotal: totalPrice,
    };

    addBurger(item);
    setModalOpen(false);
    setSelected([]);
    toast.success(`${name} added to cart! 🍔`, {
      description: `${selected.length} ingredients — $${totalPrice.toFixed(2)}`,
      timeout: 3000,
    });
    navigate('/');
  };

  // Build progress summary: which categories have been selected
  const progress = CATEGORY_ORDER.map((cat) => ({
    cat,
    meta: CATEGORY_META[cat],
    count: selected.filter((i) => i.category === cat).length,
  }));

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Page header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft size={15} />
          Back to home
        </button>
        <div className="text-center">
          <h1 className="text-base font-bold leading-tight">Build Your Burger</h1>
          <p className="text-[11px] text-muted">Select ingredients to assemble</p>
        </div>
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
          disabled={selected.length === 0}
        >
          <RotateCcw size={13} />
          Reset
        </button>
      </div>

      {/* Progress chips */}
      <div className="flex items-center gap-1.5 px-4 pb-3 overflow-x-auto scrollbar-hide shrink-0">
        {progress.map(({ cat, meta, count }) => (
          <span
            key={cat}
            className={[
              'inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full border whitespace-nowrap transition-colors',
              count > 0
                ? 'bg-[var(--accent)]/10 border-[var(--accent)]/40 text-[var(--accent)]'
                : cat === 'patty'
                  ? 'border-amber-300 text-amber-600 dark:border-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
                  : 'border-border text-muted bg-surface-secondary',
            ].join(' ')}
          >
            {meta.emoji}
            <span className="hidden sm:inline">{meta.label}</span>
            {count > 0 && <span className="font-bold">×{count}</span>}
            {count === 0 && cat === 'patty' && (
              <span className="text-[10px] opacity-70">required</span>
            )}
          </span>
        ))}
      </div>

      {/* Main content — board + picker */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-0 gap-0 lg:gap-4 px-4 pb-4">
        {/* Left: Visual burger board */}
        <div className="lg:w-[300px] lg:shrink-0 flex flex-col">
          {/* Board label */}
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 shrink-0">
            Your Burger
          </p>
          <div className="flex-1 min-h-[220px] lg:min-h-0 bg-surface-secondary rounded-2xl border border-border p-4 flex flex-col items-center justify-center">
            <BurgerBoard selected={selected} hasPatty={hasPatty} />
          </div>
        </div>

        {/* Right: Picker + price footer */}
        <div className="flex flex-col flex-1 min-h-0 mt-4 lg:mt-0">
          <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-2 shrink-0">
            Ingredients
          </p>
          <div className="flex-1 min-h-0 overflow-hidden">
            <IngredientPicker
              ingredients={builderIngredients}
              selected={selected}
              onToggle={handleToggle}
            />
          </div>
        </div>
      </div>

      {/* Sticky price + finish bar */}
      <div className="shrink-0 border-t border-border bg-background/95 backdrop-blur px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Price breakdown */}
          <div className="flex flex-col">
            <span className="text-[11px] text-muted">
              {selected.length === 0
                ? 'No ingredients yet'
                : `${selected.length} ingredient${selected.length !== 1 ? 's' : ''}`}
            </span>
            <span className="text-xl font-extrabold text-[var(--accent)]">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!hasBun && selected.length > 0 && (
              <p className="text-xs text-muted hidden sm:block">
                Add a bun for the full experience
              </p>
            )}
            <Button
              variant={hasPatty ? 'primary' : 'secondary'}
              size="md"
              className={hasPatty ? 'bg-[var(--accent)] text-white hover:opacity-90 px-6' : 'px-6'}
              onPress={handleFinish}
              isDisabled={selected.length === 0}
            >
              <ShoppingBag size={16} />
              {hasPatty ? 'Finish & Add to Cart' : 'Select a patty first'}
              {hasPatty && <ChevronRight size={14} />}
            </Button>
          </div>
        </div>
      </div>

      {/* Name modal */}
      <NameBurgerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selected={selected}
        totalPrice={totalPrice}
        onConfirm={handleConfirmName}
      />
    </div>
  );
}

export default BuildPage;
