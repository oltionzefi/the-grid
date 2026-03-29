import { useState } from 'react';
import { Button } from '@heroui/react';
import {
  LayoutDashboard,
  UtensilsCrossed,
  MapPin,
  Layers,
  Store,
  LogOut,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';

import { useBurgerStore } from '@/state';
import Dashboard from './sections/Dashboard';
import BurgersAdmin from './sections/BurgersAdmin';
import LocationsAdmin from './sections/LocationsAdmin';
import BuilderAdmin from './sections/BuilderAdmin';
import StoreAdmin from './sections/StoreAdmin';

const ADMIN_PIN = '1234';

type Section = 'dashboard' | 'burgers' | 'locations' | 'builder' | 'store';

const NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { id: 'burgers', label: 'Burgers', icon: <UtensilsCrossed size={16} /> },
  { id: 'locations', label: 'Locations', icon: <MapPin size={16} /> },
  { id: 'builder', label: 'Builder', icon: <Layers size={16} /> },
  { id: 'store', label: 'Store', icon: <Store size={16} /> },
];

export default function AdminPage() {
  const storeConfig = useBurgerStore((s) => s.storeConfig);
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [section, setSection] = useState<Section>('dashboard');

  // ── PIN gate ─────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm flex flex-col items-center gap-6">
          <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30">
            <KeyRound size={32} className="text-[var(--accent)]" />
          </div>
          <div className="text-center">
            <h1 className="text-xl font-bold">Admin Access</h1>
            <p className="text-sm text-muted mt-1">Enter your admin PIN to continue.</p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (pin === ADMIN_PIN) {
                setAuthenticated(true);
                setError('');
              } else {
                setError('Incorrect PIN. Try again.');
                setPin('');
              }
            }}
            className="w-full flex flex-col gap-3"
          >
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              autoFocus
              className="w-full text-center text-2xl tracking-widest rounded-2xl border border-border bg-overlay px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent)]/50 placeholder:text-muted placeholder:text-base placeholder:tracking-normal"
            />
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-950/30 rounded-xl px-3 py-2">
                <ShieldAlert size={14} />
                {error}
              </div>
            )}
            <Button
              type="submit"
              variant="primary"
              className="bg-[var(--accent)] text-white w-full"
            >
              Unlock Admin Panel
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ── Authenticated admin layout ────────────────────────────────────────────
  return (
    <div className="flex flex-1 min-h-0 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 flex flex-col border-r border-border bg-surface-secondary/50 overflow-y-auto">
        {/* Store header */}
        <div className="px-4 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-xl">{storeConfig.emoji}</span>
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{storeConfig.name}</p>
              <p className="text-xs text-muted">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex flex-col gap-0.5 p-2 flex-1">
          {NAV.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setSection(id)}
              className={[
                'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left',
                section === id
                  ? 'bg-[var(--accent)] text-white shadow-sm'
                  : 'text-muted hover:text-foreground hover:bg-surface-secondary',
              ].join(' ')}
            >
              {icon}
              {label}
            </button>
          ))}
        </nav>

        {/* Exit */}
        <div className="p-2 border-t border-border">
          <button
            onClick={() => setAuthenticated(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors w-full"
          >
            <LogOut size={15} />
            Exit admin
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6 min-w-0">
        {section === 'dashboard' && <Dashboard onNavigate={(s) => setSection(s as Section)} />}
        {section === 'burgers' && <BurgersAdmin />}
        {section === 'locations' && <LocationsAdmin />}
        {section === 'builder' && <BuilderAdmin />}
        {section === 'store' && <StoreAdmin />}
      </main>
    </div>
  );
}
