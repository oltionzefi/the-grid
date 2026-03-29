import { useState, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Button, useOverlayState, toast } from '@heroui/react';
import {
  Plus,
  ChevronRight,
  Sparkles,
  Heart,
  TrendingUp,
  Flame,
  Leaf,
  Search,
  X,
  type LucideIcon,
} from 'lucide-react';

import { BeefIcon, ChickenIcon, VeggieIcon } from '@/components/icons/BurgerTypeIcons';

import { useBurgerStore, type CartItem, type Burger } from '@/state';

import BurgerCustomizeModal from '@/modules/burger/components/BurgerCustomizeModal';

const BADGE_STYLE_MAP: Record<string, string> = {
  green: 'bg-green-600 text-white',
  blue: 'bg-blue-600 text-white',
  orange: 'bg-orange-500 text-white',
  red: 'bg-red-600 text-white',
  amber: 'bg-amber-500 text-white',
};

const BADGE_ICON_MAP: Record<string, LucideIcon> = {
  New: Sparkles,
  Favorite: Heart,
  Popular: TrendingUp,
  Hot: Flame,
  Vegan: Leaf,
};

type IconComponent = React.ComponentType<{
  size?: number;
  className?: string;
  strokeWidth?: number;
}>;

const CATEGORY_CHIP_MAP: Record<string, { Icon: IconComponent; label: string; cls: string }> = {
  Beef: {
    Icon: BeefIcon,
    label: 'Beef',
    cls: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  },
  Chicken: {
    Icon: ChickenIcon,
    label: 'Chicken',
    cls: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  },
  Veggie: {
    Icon: VeggieIcon,
    label: 'Veggie',
    cls: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  },
};

/** Inline text highlighter */
function Highlight({ text, term }: { text: string; term: string }) {
  if (!term) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-amber-200 dark:bg-amber-700/50 text-foreground not-italic rounded-sm px-0.5">
        {text.slice(idx, idx + term.length)}
      </mark>
      {text.slice(idx + term.length)}
    </>
  );
}

function BurgerModule() {
  const addBurger = useBurgerStore((state) => state.addBurger);
  const burgers = useBurgerStore((s) => s.menuBurgers);
  const navigate = useNavigate();
  const modalState = useOverlayState();
  const [selectedBurger, setSelectedBurger] = useState<Burger | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(burgers.map((b) => b.category)));
    return ['All', ...cats];
  }, [burgers]);

  const q = searchQuery.trim().toLowerCase();

  // Filter by name OR category (plain match — no colon syntax)
  const displayed = useMemo(() => {
    if (q) {
      return burgers.filter(
        (b) => b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q),
      );
    }
    if (activeCategory === 'All') return burgers;
    return burgers.filter((b) => b.category === activeCategory);
  }, [burgers, q, activeCategory]);

  const handleOpenCustomize = (b: Burger) => {
    setSelectedBurger(b);
    modalState.open();
  };

  const handleAddToCart = (item: CartItem) => {
    addBurger(item);
    toast.success(`${item.name} added!`, {
      description: `$${item.itemTotal.toFixed(2)} — ${item.quantity}× with ${item.extras.length} extra${item.extras.length !== 1 ? 's' : ''}`,
      timeout: 2000,
    });
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-orange-800 via-orange-700 to-orange-500 dark:from-zinc-900 dark:via-zinc-800 dark:to-orange-950">
        <div className="max-w-7xl mx-auto px-6 py-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-orange-200 dark:text-orange-400 text-xs font-semibold uppercase tracking-widest mb-1">
              The Grid
            </p>
            <h1 className="text-3xl font-extrabold text-white leading-tight">
              Build Your Perfect Burger
            </h1>
            <p className="text-orange-100 dark:text-orange-300 mt-2 text-sm max-w-xs">
              Fresh ingredients, made-to-order. Customize every bite.
            </p>
            <button
              onClick={() => navigate('/build')}
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white bg-white/20 hover:bg-white/30 active:bg-white/40 rounded-full px-4 py-1.5 transition-colors"
            >
              Build your burger <ChevronRight size={14} />
            </button>
          </div>
          <span className="text-7xl select-none shrink-0 hidden sm:block" aria-hidden="true">
            🍔
          </span>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 py-5 flex flex-col flex-1">
        {/* Search bar — always visible */}
        <div className="mb-4">
          <div className="relative flex items-center">
            <Search size={15} className="absolute left-3 text-muted pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setActiveCategory('All');
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') setSearchQuery('');
              }}
              placeholder="Search by name or type…"
              className="w-full pl-9 pr-8 py-2.5 text-sm rounded-xl border border-border bg-overlay focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)]/50 placeholder:text-muted transition-shadow"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 p-1 text-muted hover:text-foreground transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {/* Fixed-height row — always rendered to prevent CLS */}
          <div className="flex items-center h-6 mt-1.5">
            {q ? (
              <span className="text-xs text-muted ml-auto">
                {displayed.length} result
                {displayed.length !== 1 ? 's' : ''}
              </span>
            ) : null}
          </div>
        </div>

        {/* Category filter chips — hidden while searching */}
        {!searchQuery.trim() && categories.length > 2 && (
          <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={[
                  'px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0',
                  activeCategory === cat
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-surface-secondary text-muted hover:text-foreground',
                ].join(' ')}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid or empty state — as flex siblings so empty state can fill remaining height */}
        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayed.map((b) => (
              <div
                key={b.id}
                className="group flex gap-3 p-3 rounded-2xl border border-border bg-overlay hover:shadow-sm hover:border-[var(--accent)]/30 cursor-pointer transition-all"
                onClick={() => handleOpenCustomize(b)}
              >
                {/* Thumbnail */}
                <div className="relative shrink-0">
                  <img
                    src={b.image}
                    alt={b.name}
                    className="w-24 h-24 rounded-xl object-cover bg-surface-secondary group-hover:scale-105 transition-transform duration-300"
                  />
                  {b.badge &&
                    (() => {
                      const BadgeIcon = BADGE_ICON_MAP[b.badge.text ?? ''];
                      const style =
                        BADGE_STYLE_MAP[b.badge.color ?? 'green'] ?? BADGE_STYLE_MAP.green;
                      return (
                        <span
                          className={[
                            'absolute top-1.5 left-1.5 flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-md',
                            style,
                          ].join(' ')}
                        >
                          {BadgeIcon && (
                            <BadgeIcon size={9} strokeWidth={2.5} className="shrink-0" />
                          )}
                          {b.badge.text}
                        </span>
                      );
                    })()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <p className="font-semibold text-sm leading-snug">
                      <Highlight text={b.name} term={q} />
                    </p>
                    <p className="text-xs text-muted mt-0.5 line-clamp-2 leading-snug">
                      {b.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-bold">${b.price.toFixed(2)}</span>
                      {(() => {
                        const chip = CATEGORY_CHIP_MAP[b.category];
                        return chip ? (
                          <span
                            className={[
                              'inline-flex items-center gap-0.5 self-start text-[9px] font-semibold px-1.5 py-0.5 rounded-full border',
                              chip.cls,
                            ].join(' ')}
                          >
                            <chip.Icon size={8} strokeWidth={2.5} className="shrink-0" />
                            {chip.label}
                          </span>
                        ) : null;
                      })()}
                    </div>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="secondary"
                      onPress={(e) => {
                        e?.continuePropagation?.();
                        handleOpenCustomize(b);
                      }}
                      aria-label={`Add ${b.name} to bag`}
                      className="shrink-0 self-end w-7 h-7 rounded-lg"
                    >
                      <Plus size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state as a flex-1 sibling — fills remaining space and centers content */
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center min-h-[240px]">
            <Search size={36} className="text-muted opacity-25" />
            {searchQuery.trim() ? (
              <>
                <p className="font-medium text-sm">No burgers match "{searchQuery}"</p>
                <p className="text-xs text-muted max-w-xs">
                  Try a different name or type (e.g. "beef", "veggie", "chicken").
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-1 text-xs text-[var(--accent)] hover:underline underline-offset-2"
                >
                  Clear search
                </button>
              </>
            ) : (
              <p className="text-muted text-sm">No burgers available</p>
            )}
          </div>
        )}
      </div>

      <BurgerCustomizeModal burger={selectedBurger} state={modalState} onAdd={handleAddToCart} />
    </div>
  );
}

export default BurgerModule;
