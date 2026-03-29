import { UtensilsCrossed, MapPin, Layers, ShoppingBag, ArrowRight } from 'lucide-react';
import { Card } from '@heroui/react';

import { useBurgerStore } from '@/state';

interface Props {
  onNavigate: (section: string) => void;
}

export default function Dashboard({ onNavigate }: Props) {
  const menuBurgers = useBurgerStore((s) => s.menuBurgers);
  const shopLocations = useBurgerStore((s) => s.shopLocations);
  const builderIngredients = useBurgerStore((s) => s.builderIngredients);
  const storeConfig = useBurgerStore((s) => s.storeConfig);

  const stats = [
    {
      label: 'Menu items',
      value: menuBurgers.length,
      icon: UtensilsCrossed,
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
      section: 'burgers',
    },
    {
      label: 'Locations',
      value: shopLocations.length,
      icon: MapPin,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      section: 'locations',
    },
    {
      label: 'Builder items',
      value: builderIngredients.length,
      icon: Layers,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
      section: 'builder',
    },
    {
      label: 'Cart orders',
      value: useBurgerStore((s) => s.burgers.length),
      icon: ShoppingBag,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-950/30',
      section: 'burgers',
    },
  ];

  const categories = [...new Set(menuBurgers.map((b) => b.category))];

  return (
    <div className="flex flex-col gap-6">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-bold">Welcome back, Admin</h2>
        <p className="text-sm text-muted mt-0.5">
          Managing{' '}
          <span className="font-semibold text-foreground">
            {storeConfig.emoji} {storeConfig.name}
          </span>
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, bg, section }) => (
          <button key={label} onClick={() => onNavigate(section)} className="text-left">
            <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <div className={['p-2 rounded-xl', bg].join(' ')}>
                  <Icon size={18} className={color} />
                </div>
                <ArrowRight size={14} className="text-muted mt-1" />
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-xs text-muted mt-0.5">{label}</p>
            </Card>
          </button>
        ))}
      </div>

      {/* Quick overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Menu summary */}
        <Card>
          <Card.Header className="px-5 pt-4 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Menu Overview</h3>
              <button
                onClick={() => onNavigate('burgers')}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Manage →
              </button>
            </div>
          </Card.Header>
          <Card.Content className="px-5 pb-4 flex flex-col gap-2">
            {categories.map((cat) => {
              const count = menuBurgers.filter((b) => b.category === cat).length;
              return (
                <div
                  key={cat}
                  className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
                >
                  <span className="text-sm font-medium">{cat}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-surface-secondary border border-border">
                    {count} items
                  </span>
                </div>
              );
            })}
          </Card.Content>
        </Card>

        {/* Locations summary */}
        <Card>
          <Card.Header className="px-5 pt-4 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Shop Locations</h3>
              <button
                onClick={() => onNavigate('locations')}
                className="text-xs text-[var(--accent)] hover:underline"
              >
                Manage →
              </button>
            </div>
          </Card.Header>
          <Card.Content className="px-5 pb-4 flex flex-col gap-2">
            {shopLocations.length === 0 ? (
              <p className="text-sm text-muted py-2">No locations configured.</p>
            ) : (
              shopLocations.slice(0, 4).map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center gap-2 py-1.5 border-b border-border last:border-0"
                >
                  <MapPin size={13} className="text-[var(--accent)] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{loc.name}</p>
                    {loc.address && (
                      <p className="text-xs text-muted truncate">
                        {loc.address.street},{loc.address.city}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
