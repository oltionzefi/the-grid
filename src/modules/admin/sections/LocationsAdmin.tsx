import { useState } from 'react';
import { Button, Card, toast } from '@heroui/react';
import { Plus, Trash2, Edit2, Check, X, MapPin } from 'lucide-react';

import { useBurgerStore, type ShopLocation } from '@/state';

const inputCls =
  'w-full text-sm rounded-xl border border-border bg-overlay px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]/50 placeholder:text-muted';

type FormState = { name: string; street: string; city: string; state: string; hours: string };
const emptyForm: FormState = { name: '', street: '', city: '', state: '', hours: '' };

export default function LocationsAdmin() {
  const shopLocations = useBurgerStore((s) => s.shopLocations);
  const addShopLocation = useBurgerStore((s) => s.addShopLocation);
  const updateShopLocation = useBurgerStore((s) => s.updateShopLocation);
  const removeShopLocation = useBurgerStore((s) => s.removeShopLocation);

  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.city.trim()) {
      toast.danger('Required fields missing', { description: 'Name and city are required.' });
      return;
    }
    const location: ShopLocation = {
      id: editId ?? `loc-${Date.now()}`,
      name: form.name.trim(),
      address: { street: form.street.trim(), city: form.city.trim(), state: form.state.trim() },
      hours: form.hours.trim() || undefined,
    };
    if (editId) {
      updateShopLocation(location);
      toast.success('Location updated', { description: location.name });
    } else {
      addShopLocation(location);
      toast.success('Location added', { description: location.name });
    }
    setShowAdd(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const startEdit = (loc: ShopLocation) => {
    setEditId(loc.id);
    setForm({
      name: loc.name,
      street: loc.address?.street ?? '',
      city: loc.address?.city ?? '',
      state: loc.address?.state ?? '',
      hours: loc.hours ?? '',
    });
    setShowAdd(true);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      removeShopLocation(id);
      setDeleteConfirm(null);
      toast.success('Location removed');
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Shop Locations</h2>
          <p className="text-sm text-muted mt-0.5">
            {shopLocations.length} location{shopLocations.length !== 1 ? 's' : ''} configured
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          className="bg-[var(--accent)] text-white"
          onPress={() => {
            setEditId(null);
            setForm(emptyForm);
            setShowAdd((v) => !v);
          }}
        >
          <Plus size={14} />
          {showAdd && !editId ? 'Cancel' : 'Add location'}
        </Button>
      </div>

      {showAdd && (
        <Card>
          <Card.Header className="px-6 pt-4 pb-3">
            <h3 className="font-semibold text-sm">{editId ? 'Edit location' : 'New location'}</h3>
          </Card.Header>
          <Card.Content className="px-6 pb-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Location name *</label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Downtown Branch"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Street</label>
                <input
                  className={inputCls}
                  value={form.street}
                  onChange={(e) => set('street', e.target.value)}
                  placeholder="123 Main St"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">City *</label>
                <input
                  className={inputCls}
                  value={form.city}
                  onChange={(e) => set('city', e.target.value)}
                  placeholder="New York"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">State / Region</label>
                <input
                  className={inputCls}
                  value={form.state}
                  onChange={(e) => set('state', e.target.value)}
                  placeholder="NY"
                />
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Opening hours</label>
                <input
                  className={inputCls}
                  value={form.hours}
                  onChange={(e) => set('hours', e.target.value)}
                  placeholder="Mon–Fri 10am–10pm"
                />
              </div>
              <div className="sm:col-span-2 flex gap-2 justify-end pt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  type="button"
                  onPress={() => {
                    setShowAdd(false);
                    setEditId(null);
                    setForm(emptyForm);
                  }}
                >
                  <X size={14} /> Cancel
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  type="submit"
                  className="bg-[var(--accent)] text-white"
                >
                  <Check size={14} /> {editId ? 'Save changes' : 'Add location'}
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      )}

      {shopLocations.length === 0 && !showAdd ? (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <MapPin size={40} className="text-muted" />
          <p className="font-semibold text-lg">No locations yet</p>
          <p className="text-sm text-muted max-w-xs">
            Add your first shop location so customers can pick it up.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {shopLocations.map((loc) => (
            <Card key={loc.id} className="overflow-hidden">
              <Card.Content className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/30 shrink-0">
                      <MapPin size={16} className="text-orange-600 dark:text-orange-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate">{loc.name}</p>
                      {loc.address && (
                        <p className="text-xs text-muted mt-0.5 leading-relaxed">
                          {[loc.address.street, loc.address.city, loc.address.state]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                      )}
                      {loc.hours && <p className="text-xs text-muted mt-1">{loc.hours}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(loc)}
                      className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(loc.id)}
                      className={[
                        'p-1.5 rounded-lg transition-colors',
                        deleteConfirm === loc.id
                          ? 'text-red-600 bg-red-50 dark:bg-red-950/30'
                          : 'text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30',
                      ].join(' ')}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </Card.Content>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
