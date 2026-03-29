import { useState } from 'react';
import { Card, Button, Tooltip } from '@heroui/react';
import {
  Copy,
  Check,
  Star,
  ShoppingBag,
  MapPin,
  ChevronRight,
  Trophy,
  Flame,
  Edit2,
} from 'lucide-react';

const USER = {
  name: 'Max Mustermann',
  email: 'max.musterman@mustermann.com',
  id: 'u_2J89JSA4GJ',
  since: '23 Dec 2025',
  tier: 'Gold Member',
  points: 1240,
  nextTierPoints: 2000,
  totalOrders: 34,
  favoriteBurger: 'Bacon Burger',
  favoriteLocation: 'The Grid — Munich Central',
};

const RECENT_ORDERS = [
  {
    id: '#3241',
    date: '28 Mar 2026',
    items: ['Bacon Burger ×2', 'BBQ Chicken ×1'],
    total: 24.97,
    status: 'Delivered',
  },
  {
    id: '#3198',
    date: '21 Mar 2026',
    items: ['Cheeseburger ×1', 'Veggie Burger ×1'],
    total: 12.48,
    status: 'Delivered',
  },
  {
    id: '#3102',
    date: '14 Mar 2026',
    items: ['Spicy Crispy Chicken ×2'],
    total: 17.98,
    status: 'Delivered',
  },
];

const TIER_STEPS = [
  { label: 'Bronze', min: 0 },
  { label: 'Silver', min: 500 },
  { label: 'Gold', min: 1000 },
  { label: 'Platinum', min: 2000 },
];

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Tooltip>
      <Tooltip.Trigger>
        <Button
          isIconOnly
          size="sm"
          variant="ghost"
          onPress={() => {
            navigator.clipboard.writeText(value).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            });
          }}
          aria-label="Copy"
          className="text-white/70 hover:text-white"
        >
          {copied ? <Check size={13} className="text-green-300" /> : <Copy size={13} />}
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content>{copied ? 'Copied!' : 'Copy'}</Tooltip.Content>
    </Tooltip>
  );
}

function Account() {
  const progress = Math.min((USER.points / USER.nextTierPoints) * 100, 100);
  const initials = USER.name
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <div className="flex flex-col flex-1">
      {/* Page header */}
      <div className="border-b border-border bg-surface-secondary/40 shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <div>
              <h1 className="text-xl font-bold leading-tight">{USER.name}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                  <Trophy size={10} />
                  {USER.tier}
                </span>
                <span className="text-xs text-muted">
                  Member since
                  {USER.since}
                </span>
              </div>
            </div>
          </div>
          <Button variant="secondary" size="sm" className="shrink-0 gap-1.5">
            <Edit2 size={13} />
            Edit profile
          </Button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6 items-start">
            {/* ── LEFT COLUMN ──────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              {/* Loyalty card */}
              <div
                className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #1e3a8a 0%, #7c3aed 60%, #c026d3 100%)',
                }}
              >
                <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/5 pointer-events-none" />
                <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

                <div className="relative flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="font-bold text-base leading-tight">{USER.name}</p>
                      <span className="inline-flex items-center gap-1 text-xs bg-amber-400/25 text-amber-200 border border-amber-300/30 rounded-full px-2 py-0.5 mt-0.5">
                        <Trophy size={10} />
                        {USER.tier}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{USER.points.toLocaleString()}</p>
                    <p className="text-xs text-white/60">points</p>
                  </div>
                </div>

                {/* Tier steps */}
                <div className="relative mb-3">
                  <div className="flex justify-between mb-1">
                    {TIER_STEPS.map((t) => (
                      <span
                        key={t.label}
                        className={[
                          'text-[10px] font-medium',
                          USER.points >= t.min ? 'text-amber-300' : 'text-white/40',
                        ].join(' ')}
                      >
                        {t.label}
                      </span>
                    ))}
                  </div>
                  <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-300 to-amber-500 transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="text-xs text-white/50 mt-1.5 text-right">
                    {(USER.nextTierPoints - USER.points).toLocaleString()} pts to Platinum
                  </p>
                </div>

                {/* ID row */}
                <div className="flex items-center gap-1.5 pt-4 border-t border-white/15">
                  <span className="text-white/50 text-xs font-mono flex-1 truncate">{USER.id}</span>
                  <CopyButton value={USER.id} />
                  <span className="text-white/30 text-xs">·</span>
                  <a
                    href={`mailto:${USER.email}`}
                    className="text-white/60 text-xs hover:text-white truncate max-w-[140px]"
                  >
                    {USER.email}
                  </a>
                  <CopyButton value={USER.email} />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  {
                    icon: ShoppingBag,
                    label: 'Orders',
                    value: String(USER.totalOrders),
                    cls: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30',
                  },
                  {
                    icon: Flame,
                    label: 'Favourite',
                    value: 'Bacon',
                    cls: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30',
                  },
                  {
                    icon: Star,
                    label: 'Since',
                    value: 'Dec 25',
                    cls: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30',
                  },
                ].map(({ icon: Icon, label, value, cls }) => (
                  <Card key={label} className="p-4 flex flex-col items-center gap-1.5 text-center">
                    <span className={['p-2 rounded-full', cls].join(' ')}>
                      <Icon size={15} />
                    </span>
                    <p className="font-bold text-sm leading-tight">{value}</p>
                    <p className="text-xs text-muted">{label}</p>
                  </Card>
                ))}
              </div>

              {/* Favourite location */}
              <Card>
                <Card.Content className="px-5 py-4">
                  <p className="text-xs text-muted font-medium uppercase tracking-wide mb-3">
                    Favourite pickup
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-[var(--accent)]/10 text-[var(--accent)] shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{USER.favoriteLocation}</p>
                      <p className="text-xs text-muted">Preferred pickup location</p>
                    </div>
                    <ChevronRight size={15} className="text-muted shrink-0" />
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* ── RIGHT COLUMN ─────────────────────────────────── */}
            <div className="flex flex-col gap-4">
              {/* Recent orders */}
              <Card>
                <Card.Header className="px-6 pt-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-sm">Recent Orders</h2>
                      <p className="text-xs text-muted mt-0.5">{USER.totalOrders} orders total</p>
                    </div>
                    <button className="text-xs font-medium text-[var(--accent)] hover:underline underline-offset-2">
                      View all
                    </button>
                  </div>
                </Card.Header>
                <Card.Content className="px-6 pb-2 flex flex-col divide-y divide-border">
                  {RECENT_ORDERS.map((order) => (
                    <div
                      key={order.id}
                      className="py-4 first:pt-0 flex items-start justify-between gap-3"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-sm">{order.id}</span>
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400">
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted">{order.date}</p>
                        <p className="text-xs text-muted mt-1 truncate">
                          {order.items.join(' · ')}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold">${order.total.toFixed(2)}</p>
                        <button className="text-xs text-[var(--accent)] hover:underline underline-offset-2 mt-0.5">
                          Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </Card.Content>
              </Card>

              {/* Perks / tier benefits */}
              <Card>
                <Card.Header className="px-6 pt-5 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                      <Trophy size={14} className="text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm">Gold Member Perks</h2>
                      <p className="text-xs text-muted">Active benefits on your account</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content className="px-6 pb-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      {
                        emoji: '🎉',
                        label: 'Birthday bonus',
                        desc: '2× points in your birth month',
                      },
                      {
                        emoji: '🚀',
                        label: 'Priority pickup',
                        desc: 'Skip the queue at any location',
                      },
                      {
                        emoji: '🍔',
                        label: 'Free monthly burger',
                        desc: 'One free classic every month',
                      },
                      {
                        emoji: '💰',
                        label: 'Gold discounts',
                        desc: '10% off every order above $15',
                      },
                    ].map((perk) => (
                      <div
                        key={perk.label}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-surface-secondary border border-border"
                      >
                        <span className="text-xl shrink-0">{perk.emoji}</span>
                        <div>
                          <p className="text-xs font-semibold">{perk.label}</p>
                          <p className="text-[11px] text-muted mt-0.5">{perk.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
