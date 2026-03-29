import { useState, useMemo } from 'react';
import { Modal, Button, Checkbox, useOverlayState } from '@heroui/react';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';

import type { Burger, Topping } from '@/modules/burger/api/fetchBurger';

import type { CartItem, CartExtra } from '@/state';

type ToppingCategory = 'topping' | 'sauce' | 'extra';

const CATEGORY_LABELS: Record<ToppingCategory, string> = {
  topping: 'Toppings',
  sauce: 'Sauces',
  extra: 'Extras',
};

interface Props {
  burger: Burger | null;
  state: ReturnType<typeof useOverlayState>;
  onAdd: (item: CartItem) => void;
}

function BurgerCustomizeModal({ burger, state, onAdd }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<ToppingCategory>('topping');

  const toppingsByCategory = useMemo<Record<ToppingCategory, Topping[]>>(() => {
    const grouped: Record<ToppingCategory, Topping[]> = { topping: [], sauce: [], extra: [] };
    burger?.toppings.forEach((t) => {
      if (t.category in grouped) grouped[t.category as ToppingCategory].push(t);
    });
    return grouped;
  }, [burger]);

  const extrasTotal = useMemo(() => {
    if (!burger) return 0;
    return burger.toppings
      .filter((t) => selectedExtras.has(t.id))
      .reduce((sum, t) => sum + t.price, 0);
  }, [burger, selectedExtras]);

  const lineTotal = burger ? (burger.price + extrasTotal) * quantity : 0;

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAdd = () => {
    if (!burger) return;
    const extras: CartExtra[] = burger.toppings
      .filter((t) => selectedExtras.has(t.id))
      .map(({ id, name, price }) => ({ id, name, price }));
    onAdd({
      cartItemId: `${burger.id}-${Date.now()}`,
      burgerId: burger.id,
      name: burger.name,
      category: burger.category,
      description: burger.description,
      price: burger.price,
      image: burger.image,
      quantity,
      extras,
      itemTotal: lineTotal,
    });
    state.close();
    setQuantity(1);
    setSelectedExtras(new Set());
  };

  if (!burger) return null;

  const activeToppings = toppingsByCategory[activeCategory];

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable>
        <Modal.Container size="md" placement="center">
          <Modal.Dialog>
            {/* Header */}
            <Modal.Header className="flex items-center justify-between px-5 pt-5 pb-3">
              <Modal.Heading className="text-lg font-bold">{burger.name}</Modal.Heading>
              <Button isIconOnly variant="ghost" size="sm" onPress={state.close} aria-label="Close">
                <X size={16} />
              </Button>
            </Modal.Header>

            <Modal.Body className="px-5 pb-2 flex flex-col gap-4">
              {/* Burger summary */}
              <div className="flex items-center gap-3">
                <img
                  src={burger.image}
                  alt={burger.name}
                  className="w-16 h-16 rounded-xl object-cover bg-surface-secondary shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted leading-snug line-clamp-2">
                    {burger.description}
                  </p>
                  <p className="text-base font-semibold mt-1">${burger.price.toFixed(2)}</p>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Quantity</span>
                <div className="flex items-center gap-2">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="secondary"
                    onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </Button>
                  <span className="w-6 text-center font-semibold text-sm">{quantity}</span>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="secondary"
                    onPress={() => setQuantity((q) => Math.min(10, q + 1))}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </Button>
                </div>
              </div>

              {/* Category tabs */}
              <div>
                <div className="flex gap-1 mb-3 border-b border-border">
                  {(Object.keys(CATEGORY_LABELS) as ToppingCategory[]).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={[
                        'px-3 py-1.5 text-sm font-medium -mb-px border-b-2 transition-colors',
                        activeCategory === cat
                          ? 'border-[var(--accent)] text-[var(--accent)]'
                          : 'border-transparent text-muted hover:text-foreground',
                      ].join(' ')}
                    >
                      {CATEGORY_LABELS[cat]}
                      {cat === 'extra' &&
                        toppingsByCategory.extra.some((t) => selectedExtras.has(t.id)) && (
                          <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-[var(--accent)] align-middle" />
                        )}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                  {activeToppings.map((t) => (
                    <Checkbox
                      key={t.id}
                      isSelected={selectedExtras.has(t.id)}
                      onChange={() => toggleExtra(t.id)}
                      className="items-center"
                    >
                      <Checkbox.Control>
                        <Checkbox.Indicator />
                      </Checkbox.Control>
                      <Checkbox.Content>
                        <span className="text-sm">{t.name}</span>
                        {t.price > 0 && (
                          <span className="text-xs text-muted ml-1">
                            +$
                            {t.price.toFixed(2)}
                          </span>
                        )}
                      </Checkbox.Content>
                    </Checkbox>
                  ))}
                </div>
              </div>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer className="px-5 py-4 flex items-center justify-between gap-3 border-t border-border">
              <div className="text-sm text-muted">
                {extrasTotal > 0 && (
                  <span className="text-foreground">+${extrasTotal.toFixed(2)} extras · </span>
                )}
                <span className="text-base font-bold text-foreground">${lineTotal.toFixed(2)}</span>
              </div>
              <Button variant="primary" onPress={handleAdd} className="flex items-center gap-2">
                <ShoppingBag size={15} />
                Add {quantity > 1 ? `${quantity}×` : ''} to Bag
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

export default BurgerCustomizeModal;
