import { Drawer, Button, toast, useOverlayState } from '@heroui/react';
import { Minus, Plus, Trash2, ShoppingBag, MapPin, X } from 'lucide-react';

import { useBurgerStore, type CartItem } from '@/state';

import { useLocations } from '@/modules/location/api/fetchLocations';

import { BeefIcon, ChickenIcon, VeggieIcon } from '@/components/icons/BurgerTypeIcons';

type IconComponent = React.ComponentType<{
  size?: number;
  className?: string;
  strokeWidth?: number;
}>;

const CATEGORY_CHIP: Record<string, { Icon: IconComponent; cls: string }> = {
  Beef: {
    Icon: BeefIcon,
    cls: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
  },
  Chicken: {
    Icon: ChickenIcon,
    cls: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
  },
  Veggie: {
    Icon: VeggieIcon,
    cls: 'bg-green-50 text-green-600 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800',
  },
};

interface Props {
  state: ReturnType<typeof useOverlayState>;
}

function CartDrawer({ state }: Props) {
  const burgers = useBurgerStore((s: any) => s.burgers as CartItem[]);
  const removeBurger = useBurgerStore((s: any) => s.removeBurger);
  const updateQuantity = useBurgerStore((s: any) => s.updateQuantity);
  const removeAllBurgers = useBurgerStore((s: any) => s.removeAllBurgers);
  const preferredLocationId = useBurgerStore((s: any) => s.preferredLocationId as string | null);
  const setPreferredLocation = useBurgerStore((s: any) => s.setPreferredLocation);

  const { locations } = useLocations();

  const orderTotal = burgers.reduce((sum: number, item: CartItem) => sum + item.itemTotal, 0);
  const itemCount = burgers.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);

  const handlePlaceOrder = () => {
    removeAllBurgers();
    state.close();
    toast.success('Order placed!', {
      description: preferredLocationId
        ? `Your order is confirmed for ${locations.find((l) => l.id === preferredLocationId)?.name ?? 'your location'}.`
        : 'Your order is on its way!',
      timeout: 3000,
    });
  };

  return (
    <Drawer state={state}>
      <Drawer.Backdrop isDismissable>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            {/* Header */}
            <Drawer.Header className="px-5 pt-4 pb-3 border-b border-border">
              <div className="flex items-center justify-between w-full">
                <Drawer.Heading className="flex items-center gap-2 font-bold text-lg">
                  <ShoppingBag size={18} className="text-[var(--accent)]" />
                  Your Order
                  {itemCount > 0 && (
                    <span className="text-sm font-normal text-muted">
                      ({itemCount} item
                      {itemCount !== 1 ? 's' : ''})
                    </span>
                  )}
                </Drawer.Heading>
                <Button
                  isIconOnly
                  variant="ghost"
                  size="sm"
                  onPress={state.close}
                  aria-label="Close cart"
                >
                  <X size={16} />
                </Button>
              </div>
            </Drawer.Header>

            <Drawer.Body className="px-5 py-4 flex flex-col gap-6 overflow-y-auto flex-1">
              {burgers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
                  <ShoppingBag size={40} className="text-muted opacity-40" />
                  <p className="font-medium">Your bag is empty</p>
                  <p className="text-sm text-muted">Add some burgers to get started!</p>
                </div>
              ) : (
                <>
                  {/* Cart items */}
                  <div className="flex flex-col divide-y divide-border">
                    {burgers.map((item: CartItem) => (
                      <div key={item.cartItemId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 rounded-xl object-cover shrink-0 bg-surface-secondary"
                        />
                        <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                          {/* Name + remove */}
                          <div className="flex items-start justify-between gap-2">
                            <p className="font-semibold text-sm leading-snug">{item.name}</p>
                            <button
                              onClick={() => removeBurger(item.cartItemId)}
                              className="text-muted hover:text-red-500 transition-colors shrink-0 mt-0.5"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>

                          {/* Main ingredients from description */}
                          <p className="text-xs text-muted leading-snug line-clamp-2">
                            {item.description}
                          </p>

                          {/* Selected extras */}
                          {item.extras.length > 0 && (
                            <p className="text-xs text-[var(--accent)] truncate">
                              +{item.extras.map((e) => e.name).join(', ')}
                            </p>
                          )}

                          {/* Price + category + qty controls */}
                          <div className="flex items-center justify-between mt-auto pt-1">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                                className="w-6 h-6 rounded-full flex items-center justify-center bg-surface-secondary border border-border hover:bg-border transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={11} />
                              </button>
                              <span className="text-sm font-semibold w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                                className="w-6 h-6 rounded-full flex items-center justify-center bg-surface-secondary border border-border hover:bg-border transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus size={11} />
                              </button>
                            </div>
                            <div className="flex flex-col items-end gap-0.5">
                              <span className="text-sm font-bold">
                                ${item.itemTotal.toFixed(2)}
                              </span>
                              {(() => {
                                const chip = CATEGORY_CHIP[item.category];
                                return chip ? (
                                  <span
                                    className={[
                                      'inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full border',
                                      chip.cls,
                                    ].join(' ')}
                                  >
                                    <chip.Icon size={8} strokeWidth={2.5} className="shrink-0" />
                                    {item.category}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-muted uppercase tracking-wide">
                                    {item.category}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={removeAllBurgers}
                      className="text-xs text-muted hover:text-red-500 transition-colors text-right"
                    >
                      Clear all
                    </button>
                  </div>

                  {/* Pickup location */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-3">
                      <MapPin size={14} className="text-[var(--accent)]" />
                      <h3 className="text-sm font-semibold">Pickup Location</h3>
                    </div>
                    {locations.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {locations.map((loc) => (
                          <button
                            key={loc.id}
                            type="button"
                            onClick={() => setPreferredLocation(loc.id)}
                            className={[
                              'flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors text-left w-full',
                              preferredLocationId === loc.id
                                ? 'border-[var(--accent)] bg-orange-500/5'
                                : 'border-border hover:bg-surface-secondary',
                            ].join(' ')}
                          >
                            <span
                              className={[
                                'mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0',
                                preferredLocationId === loc.id
                                  ? 'border-[var(--accent)]'
                                  : 'border-border',
                              ].join(' ')}
                            >
                              {preferredLocationId === loc.id && (
                                <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                              )}
                            </span>
                            <span className="flex-1 min-w-0">
                              <p className="text-sm font-medium">{loc.name}</p>
                              {loc.address && (
                                <p className="text-xs text-muted">
                                  {loc.address.street}
                                  {', '}
                                  {loc.address.city}
                                </p>
                              )}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted">Loading locations…</p>
                    )}
                  </div>
                </>
              )}
            </Drawer.Body>

            {/* Footer */}
            {burgers.length > 0 && (
              <Drawer.Footer className="px-5 py-4 border-t border-border flex flex-col gap-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-bold text-base">${orderTotal.toFixed(2)}</span>
                </div>
                {!preferredLocationId && (
                  <p className="text-xs text-amber-600 dark:text-amber-400">
                    ⚠ Select a pickup location to continue
                  </p>
                )}
                <Button
                  variant="primary"
                  isDisabled={!preferredLocationId}
                  onPress={handlePlaceOrder}
                  className="w-full"
                >
                  Place Order · ${orderTotal.toFixed(2)}
                </Button>
              </Drawer.Footer>
            )}
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}

export default CartDrawer;
