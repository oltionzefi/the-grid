import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Button, Badge, Separator } from '@heroui/react';
import { ShoppingBag } from 'lucide-react';

import { useLocalStorage } from '@/composables';

import { useBurgerStore } from '@/state';

import BurgersDropdownMenu from '../dropdown-menu';

const NAV_LINKS = [
  { label: 'Burgers', path: '/', key: 'home' },
  { label: 'Locations', path: '/location', key: 'location' },
  { label: 'Recipes', path: '/recipe', key: 'recipe' },
];

interface Props {
  onCartOpen: () => void;
}

function BurgersNavigationMenu({ onCartOpen }: Props) {
  const [, setValue] = useLocalStorage('navigation', 'home');
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = useBurgerStore((state: any) =>
    state.burgers.reduce(
      (acc: number, item: any) => acc + (item.quantity > 0 ? item.quantity : 0),
      0,
    ),
  );

  const handleNav = useCallback(
    (path: string, key: string) => {
      setValue(key);
      navigate(path);
    },
    [navigate, setValue],
  );

  const onSetValue = useCallback((key: string) => setValue(key), [setValue]);

  const isActive = (path: string) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        {/* Left — brand + nav links */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleNav('/', 'home')}
            className="font-extrabold text-lg text-[var(--accent)] mr-3 hover:opacity-80 transition-opacity"
            aria-label="Go home"
          >
            🍔{' '}
            <span className="hidden sm:inline text-sm font-bold text-foreground tracking-tight">
              The Grid
            </span>
          </button>
          <nav className="flex items-center gap-1">
            {NAV_LINKS.map(({ label, path, key }) => (
              <button
                key={key}
                onClick={() => handleNav(path, key)}
                className={[
                  'px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
                  isActive(path)
                    ? 'bg-accent text-accent-foreground'
                    : 'text-foreground hover:bg-surface-secondary',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-1">
          <div className="relative">
            <Button
              variant="ghost"
              isIconOnly
              size="sm"
              aria-label="Open cart"
              onPress={onCartOpen}
            >
              <ShoppingBag size={18} />
            </Button>
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 min-w-[18px] h-[18px] text-[10px] flex items-center justify-center rounded-full bg-accent text-accent-foreground px-1 pointer-events-none">
                {cartCount}
              </Badge>
            )}
          </div>

          <Separator orientation="vertical" className="h-5 mx-1" />

          <BurgersDropdownMenu onSetValue={onSetValue} />
        </div>
      </div>
    </header>
  );
}

export default BurgersNavigationMenu;
