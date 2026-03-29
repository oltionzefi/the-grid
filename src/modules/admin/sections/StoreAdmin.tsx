import { useState } from 'react';
import { Button, Card, toast } from '@heroui/react';
import { Check, Store } from 'lucide-react';

import { useBurgerStore } from '@/state';

const inputCls =
  'w-full text-sm rounded-xl border border-border bg-overlay px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]/50 placeholder:text-muted';

export default function StoreAdmin() {
  const storeConfig = useBurgerStore((s) => s.storeConfig);
  const setStoreConfig = useBurgerStore((s) => s.setStoreConfig);

  const [name, setName] = useState(storeConfig.name);
  const [emoji, setEmoji] = useState(storeConfig.emoji);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.danger('Name required');
      return;
    }
    setStoreConfig({ name: name.trim(), emoji: emoji.trim() || '🍔' });
    toast.success('Store settings saved', {
      description: `${emoji.trim() || '🍔'} ${name.trim()}`,
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold">Store Configuration</h2>
        <p className="text-sm text-muted mt-0.5">
          Configure your store branding shown in the app navigation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config form */}
        <Card>
          <Card.Header className="px-6 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <Store size={16} className="text-[var(--accent)]" />
              <h3 className="font-semibold text-sm">Store Identity</h3>
            </div>
          </Card.Header>
          <Card.Content className="px-6 pb-5">
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Store name *</label>
                <input
                  className={inputCls}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="The Burger Shop"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Store emoji</label>
                <input
                  className={inputCls}
                  value={emoji}
                  onChange={(e) => setEmoji(e.target.value)}
                  placeholder="🍔"
                  maxLength={4}
                />
                <p className="text-xs text-muted">
                  Shown in the navigation bar beside the store name.
                </p>
              </div>
              <Button
                type="submit"
                variant="primary"
                className="bg-[var(--accent)] text-white w-full"
              >
                <Check size={14} /> Save changes
              </Button>
            </form>
          </Card.Content>
        </Card>

        {/* Live preview */}
        <Card>
          <Card.Header className="px-6 pt-4 pb-3">
            <h3 className="font-semibold text-sm">Live Preview</h3>
          </Card.Header>
          <Card.Content className="px-6 pb-5 flex flex-col gap-4">
            <p className="text-xs text-muted">
              This is how your store appears in the navigation bar:
            </p>
            <div className="rounded-2xl border border-border bg-surface-secondary p-4 flex items-center gap-2.5">
              <span className="text-2xl">{emoji || '🍔'}</span>
              <span className="font-bold text-base">{name || 'Store Name'}</span>
            </div>
            <p className="text-xs text-muted mt-1">
              Changes are reflected immediately after saving.
            </p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
