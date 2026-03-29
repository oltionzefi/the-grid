import { useMemo } from 'react';

import type { Ingredient } from '@/modules/build/api/ingredients';

interface Props {
  selected: Ingredient[];
  hasPatty: boolean;
}

interface LayerData {
  id: string;
  label: string;
  emoji: string;
  bg: string;
  height: string;
  rounded: string;
  shadow: string;
  width: string;
}

// Per-ingredient visual definitions — gradients + individual proportions
const LAYER_VISUALS: Record<string, Omit<LayerData, 'id' | 'label' | 'emoji'>> = {
  'bun-bottom': {
    bg: 'bg-gradient-to-b from-amber-300 to-amber-500',
    height: 'h-9',
    rounded: 'rounded-b-3xl rounded-t-md',
    shadow: 'shadow-lg',
    width: 'w-full',
  },
  'bun-top': {
    bg: 'bg-gradient-to-b from-amber-200 to-amber-500',
    height: 'h-16',
    rounded: 'rounded-t-[60%] rounded-b-md',
    shadow: 'shadow-lg',
    width: 'w-full',
  },
  'patty-smash': {
    bg: 'bg-gradient-to-b from-amber-800 to-amber-950',
    height: 'h-9',
    rounded: 'rounded-lg',
    shadow: 'shadow-md',
    width: 'w-full',
  },
  'patty-double': {
    bg: 'bg-gradient-to-b from-amber-800 to-amber-950',
    height: 'h-14',
    rounded: 'rounded-lg',
    shadow: 'shadow-md',
    width: 'w-full',
  },
  'patty-chicken': {
    bg: 'bg-gradient-to-b from-amber-400 to-amber-600',
    height: 'h-10',
    rounded: 'rounded-xl',
    shadow: 'shadow-md',
    width: 'w-full',
  },
  'patty-veggie': {
    bg: 'bg-gradient-to-b from-amber-600 to-amber-800',
    height: 'h-9',
    rounded: 'rounded-lg',
    shadow: 'shadow-md',
    width: 'w-full',
  },
  'patty-beyond': {
    bg: 'bg-gradient-to-b from-teal-600 to-teal-900',
    height: 'h-9',
    rounded: 'rounded-lg',
    shadow: 'shadow-md',
    width: 'w-full',
  },
  'cheese-cheddar': {
    bg: 'bg-gradient-to-b from-yellow-300 to-yellow-500',
    height: 'h-3',
    rounded: 'rounded-sm',
    shadow: '',
    width: 'w-[114%]',
  },
  'cheese-swiss': {
    bg: 'bg-gradient-to-b from-yellow-100 to-yellow-300',
    height: 'h-3',
    rounded: 'rounded-sm',
    shadow: '',
    width: 'w-[114%]',
  },
  'cheese-american': {
    bg: 'bg-gradient-to-b from-orange-300 to-orange-500',
    height: 'h-3',
    rounded: 'rounded-sm',
    shadow: '',
    width: 'w-[114%]',
  },
  'cheese-blue': {
    bg: 'bg-gradient-to-b from-blue-200 to-blue-400',
    height: 'h-3',
    rounded: 'rounded-sm',
    shadow: '',
    width: 'w-[114%]',
  },
  'veg-lettuce': {
    bg: 'bg-gradient-to-b from-green-400 to-green-600',
    height: 'h-5',
    rounded: 'rounded-md',
    shadow: '',
    width: 'w-full',
  },
  'veg-tomato': {
    bg: 'bg-gradient-to-b from-red-400 to-red-600',
    height: 'h-4',
    rounded: 'rounded-md',
    shadow: '',
    width: 'w-[94%]',
  },
  'veg-onion': {
    bg: 'bg-gradient-to-b from-purple-300 to-purple-500',
    height: 'h-3',
    rounded: 'rounded-full',
    shadow: '',
    width: 'w-[78%]',
  },
  'veg-pickles': {
    bg: 'bg-gradient-to-b from-lime-400 to-lime-600',
    height: 'h-3',
    rounded: 'rounded-md',
    shadow: '',
    width: 'w-[90%]',
  },
  'veg-jalapeno': {
    bg: 'bg-gradient-to-b from-green-500 to-green-700',
    height: 'h-3',
    rounded: 'rounded-full',
    shadow: '',
    width: 'w-[68%]',
  },
  'veg-avocado': {
    bg: 'bg-gradient-to-b from-emerald-400 to-emerald-600',
    height: 'h-4',
    rounded: 'rounded-md',
    shadow: '',
    width: 'w-[88%]',
  },
  'veg-mushroom': {
    bg: 'bg-gradient-to-b from-stone-400 to-stone-700',
    height: 'h-4',
    rounded: 'rounded-lg',
    shadow: '',
    width: 'w-[82%]',
  },
  'sauce-house': {
    bg: 'bg-gradient-to-r from-orange-500 via-orange-300 to-orange-500',
    height: 'h-[7px]',
    rounded: 'rounded-full',
    shadow: '',
    width: 'w-[76%]',
  },
  'sauce-bbq': {
    bg: 'bg-gradient-to-r from-red-900 via-red-700 to-red-900',
    height: 'h-[7px]',
    rounded: 'rounded-full',
    shadow: '',
    width: 'w-[70%]',
  },
  'sauce-spicymayo': {
    bg: 'bg-gradient-to-r from-orange-200 via-orange-100 to-orange-200',
    height: 'h-[7px]',
    rounded: 'rounded-full',
    shadow: '',
    width: 'w-[82%]',
  },
  'sauce-aioli': {
    bg: 'bg-gradient-to-r from-yellow-200 via-yellow-50 to-yellow-200',
    height: 'h-[7px]',
    rounded: 'rounded-full',
    shadow: '',
    width: 'w-[70%]',
  },
  'sauce-mustard': {
    bg: 'bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500',
    height: 'h-[7px]',
    rounded: 'rounded-full',
    shadow: '',
    width: 'w-[65%]',
  },
  'sauce-ketchup': {
    bg: 'bg-gradient-to-r from-red-500 via-red-400 to-red-500',
    height: 'h-[7px]',
    rounded: 'rounded-full',
    shadow: '',
    width: 'w-[76%]',
  },
};

const DEFAULT_VISUALS: Omit<LayerData, 'id' | 'label' | 'emoji'> = {
  bg: 'bg-gradient-to-b from-gray-400 to-gray-600',
  height: 'h-4',
  rounded: 'rounded-md',
  shadow: '',
  width: 'w-full',
};

export default function BurgerBoard({ selected, hasPatty }: Props) {
  const bun = selected.find((i) => i.category === 'bun');
  const isEmpty = selected.length === 0;

  // Layers in SELECTION ORDER — bun anchors bottom/top, everything else stacks as added
  // flex-col-reverse means last item in this array = top of visual stack (just under bun-top)
  const layers = useMemo((): LayerData[] => {
    const l: LayerData[] = [];
    if (bun) {
      l.push({
        id: 'bun-bottom',
        label: bun.name,
        emoji: bun.emoji,
        ...(LAYER_VISUALS['bun-bottom'] ?? DEFAULT_VISUALS),
      });
    }
    // Non-bun ingredients in the order user selected them → newest ends up on top
    selected
      .filter((i) => i.category !== 'bun')
      .forEach((ing) =>
        l.push({
          id: ing.id,
          label: ing.name,
          emoji: ing.emoji,
          ...(LAYER_VISUALS[ing.id] ?? DEFAULT_VISUALS),
        }),
      );
    if (bun) {
      l.push({
        id: 'bun-top',
        label: 'Top bun',
        emoji: bun.emoji,
        ...(LAYER_VISUALS['bun-top'] ?? DEFAULT_VISUALS),
      });
    }
    return l;
  }, [selected, bun]);

  return (
    <div className="flex flex-col items-center justify-end w-full h-full select-none">
      <div className="relative flex flex-col items-center w-full max-w-[260px]">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div
              className="text-7xl"
              style={{ animation: 'float-idle 2.6s ease-in-out infinite', opacity: 0.22 }}
            >
              🍔
            </div>
            <p className="text-sm font-bold text-muted">Let's build!</p>
            <p className="text-xs text-muted opacity-60">Start with a bun &amp; patty</p>
          </div>
        ) : (
          /* flex-col-reverse: last DOM child = bottom bun visually */
          <div className="flex flex-col-reverse w-full items-center gap-[3px]">
            {layers.map((layer) => (
              <div
                key={layer.id}
                className={[
                  layer.bg,
                  layer.height,
                  layer.rounded,
                  layer.shadow,
                  layer.width,
                  'relative group overflow-hidden',
                ].join(' ')}
                style={{ animation: 'layer-drop 0.42s cubic-bezier(0.34, 1.56, 0.64, 1) both' }}
                title={layer.label}
              >
                {/* Top-surface highlight sheen */}
                <div
                  className="absolute inset-x-0 top-0 h-[38%] bg-white/15 pointer-events-none"
                  style={{ borderRadius: 'inherit' }}
                />
                {/* Hover ingredient label */}
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-foreground bg-background/90 border border-border rounded px-1.5 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-sm">
                  {layer.emoji} {layer.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Plate */}
        {!isEmpty && <div className="mt-2 w-[96%] h-3 bg-border/50 rounded-full shadow-inner" />}
      </div>

      {/* Ingredient chips */}
      {!isEmpty && (
        <div className="mt-4 flex flex-wrap justify-center gap-1.5 max-w-[280px]">
          {selected.map((ing) => (
            <span
              key={ing.id}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-surface-secondary border border-border"
            >
              <span>{ing.emoji}</span>
              {ing.name}
            </span>
          ))}
        </div>
      )}

      {!hasPatty && selected.length > 0 && (
        <p className="mt-3 text-[11px] text-amber-600 dark:text-amber-400 font-medium animate-pulse">
          ← Pick a patty to continue
        </p>
      )}
    </div>
  );
}
