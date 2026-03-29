import { useState } from 'react';
import { Switch, RadioGroup, Radio, Button, Card, toast } from '@heroui/react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router';
import {
  Save,
  MapPin,
  Sun,
  Bell,
  ShieldCheck,
  Monitor,
  FileText,
  ChevronRight,
} from 'lucide-react';

import { useBurgerStore } from '@/state';

function Settings() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const locationEnabled = useBurgerStore((s) => s.locationEnabled);
  const setLocationEnabled = useBurgerStore((s) => s.setLocationEnabled);

  const [notifications, setNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);

  const preferredLocationId = useBurgerStore((s) => s.preferredLocationId);
  const setPreferredLocation = useBurgerStore((s) => s.setPreferredLocation);
  const shopLocations = useBurgerStore((s) => s.shopLocations);

  const handleSave = () => {
    toast.success('Settings saved', { description: 'Your preferences have been updated.' });
  };

  return (
    <div className="flex flex-col flex-1">
      {/* Page header */}
      <div className="border-b border-border bg-surface-secondary/40 shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted mt-0.5">Manage your preferences</p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="bg-[var(--accent)] text-white hover:opacity-90 shrink-0"
            onPress={handleSave}
          >
            <Save size={15} />
            Save settings
          </Button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* Two-column grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* ── LEFT COLUMN ──────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              {/* Appearance */}
              <Card>
                <Card.Header className="px-6 pt-5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                      <Sun size={15} className="text-[var(--accent)]" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm">Appearance</h2>
                      <p className="text-xs text-muted">Choose your preferred colour scheme</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content className="px-6 pb-5">
                  <RadioGroup
                    aria-label="Colour scheme"
                    value={theme ?? 'system'}
                    onChange={(val: string) => setTheme(val)}
                    className="flex flex-col gap-0 divide-y divide-border"
                  >
                    {(
                      [
                        { value: 'light', label: 'Light', sub: 'Always light interface' },
                        { value: 'dark', label: 'Dark', sub: 'Always dark interface' },
                        { value: 'system', label: 'System', sub: 'Follow OS preference' },
                      ] as const
                    ).map((t) => (
                      <Radio key={t.value} value={t.value} className="py-3" aria-label={t.label}>
                        <Radio.Control>
                          <Radio.Indicator />
                        </Radio.Control>
                        <Radio.Content>
                          <span className="font-medium text-sm">{t.label}</span>
                          <span className="block text-xs text-muted">{t.sub}</span>
                        </Radio.Content>
                      </Radio>
                    ))}
                  </RadioGroup>
                </Card.Content>
              </Card>

              {/* Notifications */}
              <Card>
                <Card.Header className="px-6 pt-5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center shrink-0">
                      <Bell size={15} className="text-sky-600 dark:text-sky-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm">Notifications</h2>
                      <p className="text-xs text-muted">
                        Choose what you want to be notified about
                      </p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content className="px-6 pb-5 flex flex-col gap-0 divide-y divide-border">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">Push notifications</p>
                      <p className="text-xs text-muted">Promotions and app news</p>
                    </div>
                    <Switch isSelected={notifications} onChange={() => setNotifications((v) => !v)}>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">Order status updates</p>
                      <p className="text-xs text-muted">Know when your order is on its way</p>
                    </div>
                    <Switch isSelected={orderUpdates} onChange={() => setOrderUpdates((v) => !v)}>
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>
                  </div>
                </Card.Content>
              </Card>
            </div>

            {/* ── RIGHT COLUMN ─────────────────────────────────── */}
            <div className="flex flex-col gap-6">
              {/* Privacy & Permissions */}
              <Card>
                <Card.Header className="px-6 pt-5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <ShieldCheck size={15} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm">Privacy &amp; Permissions</h2>
                      <p className="text-xs text-muted">Control what the app can access</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content className="px-6 pb-5 flex flex-col gap-0 divide-y divide-border">
                  {/* Location toggle — persisted, default off */}
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium">Location access</p>
                      <p className="text-xs text-muted">
                        Used to show your nearest shop on the map
                      </p>
                    </div>
                    <Switch
                      isSelected={locationEnabled}
                      onChange={() => setLocationEnabled(!locationEnabled)}
                      aria-label="Enable location access"
                    >
                      <Switch.Control>
                        <Switch.Thumb />
                      </Switch.Control>
                    </Switch>
                  </div>
                  {/* Terms & Conditions — link row, no checkbox */}
                  <button
                    type="button"
                    onClick={() => navigate('/terms')}
                    className="flex items-center justify-between py-3 w-full text-left group"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText size={14} className="text-muted shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Terms &amp; Conditions</p>
                        <p className="text-xs text-muted">
                          By using this app you have agreed to our terms
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      size={14}
                      className="text-muted group-hover:text-foreground transition-colors shrink-0"
                    />
                  </button>
                </Card.Content>
              </Card>

              {/* Preferred Pickup */}
              <Card>
                <Card.Header className="px-6 pt-5 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                      <Monitor size={15} className="text-violet-600 dark:text-violet-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-sm">Preferred Pickup</h2>
                      <p className="text-xs text-muted">Default location shown on the map</p>
                    </div>
                  </div>
                </Card.Header>
                <Card.Content className="px-6 pb-5">
                  {shopLocations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center gap-1.5">
                      <MapPin size={28} className="text-muted opacity-30" />
                      <p className="text-sm text-muted">No shop locations available</p>
                      <p className="text-xs text-muted opacity-70">
                        Shop locations are managed by an admin
                      </p>
                    </div>
                  ) : (
                    <RadioGroup
                      aria-label="Preferred pickup location"
                      value={preferredLocationId ?? ''}
                      onChange={(val: string) => setPreferredLocation(val || null)}
                      className="flex flex-col gap-0 divide-y divide-border"
                    >
                      <Radio value="" className="py-3" aria-label="No preference">
                        <Radio.Control>
                          <Radio.Indicator />
                        </Radio.Control>
                        <Radio.Content>
                          <span className="text-sm text-muted italic">No preference</span>
                        </Radio.Content>
                      </Radio>
                      {shopLocations.map((loc) => (
                        <Radio key={loc.id} value={loc.id} className="py-3" aria-label={loc.name}>
                          <Radio.Control>
                            <Radio.Indicator />
                          </Radio.Control>
                          <Radio.Content>
                            <span className="text-sm font-medium">{loc.name}</span>
                            {loc.address && (
                              <span className="block text-xs text-muted">
                                {loc.address.street},{loc.address.city}
                              </span>
                            )}
                          </Radio.Content>
                        </Radio>
                      ))}
                    </RadioGroup>
                  )}
                </Card.Content>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
