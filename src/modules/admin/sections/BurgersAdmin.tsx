import { useState } from 'react';
import { Button, Card, toast } from '@heroui/react';
import { Plus, Trash2, Edit2, Check, X, Tag } from 'lucide-react';

import { useBurgerStore, type Burger, ALL_TOPPINGS } from '@/state';

const CATEGORIES = ['Beef', 'Chicken', 'Veggie', 'Special'];
const BADGE_COLORS = ['green', 'blue', 'orange', 'red', 'purple'];

const inputCls =
  'w-full text-sm rounded-xl border border-border bg-overlay px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]/50 placeholder:text-muted';

type FormState = {
  name: string;
  description: string;
  price: string;
  category: string;
  badgeText: string;
  badgeColor: string;
  imageUrl: string;
};
const emptyForm: FormState = {
  name: '',
  description: '',
  price: '',
  category: 'Beef',
  badgeText: '',
  badgeColor: 'green',
  imageUrl: '',
};

export default function BurgersAdmin() {
  const menuBurgers = useBurgerStore((s) => s.menuBurgers);
  const addMenuBurger = useBurgerStore((s) => s.addMenuBurger);
  const updateMenuBurger = useBurgerStore((s) => s.updateMenuBurger);
  const removeMenuBurger = useBurgerStore((s) => s.removeMenuBurger);
  const resetMenuBurgers = useBurgerStore((s) => s.resetMenuBurgers);

  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.description.trim() || !form.price.trim()) {
      toast.danger('Fill in required fields', {
        description: 'Name, description and price are required.',
      });
      return;
    }
    const price = parseFloat(form.price);
    if (Number.isNaN(price) || price <= 0) {
      toast.danger('Invalid price', { description: 'Enter a positive number.' });
      return;
    }
    const burger: Burger = {
      id: editId ?? `burger-${Date.now()}`,
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      category: form.category,
      image: form.imageUrl.trim() || '',
      imageUrl: form.imageUrl.trim() || undefined,
      badge: form.badgeText.trim()
        ? { text: form.badgeText.trim(), color: form.badgeColor }
        : undefined,
      toppings: ALL_TOPPINGS,
    };
    if (editId) {
      updateMenuBurger(burger);
      toast.success('Burger updated', { description: burger.name });
    } else {
      addMenuBurger(burger);
      toast.success('Burger added', { description: burger.name });
    }
    setShowAdd(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const startEdit = (b: Burger) => {
    setEditId(b.id);
    setForm({
      name: b.name,
      description: b.description,
      price: String(b.price),
      category: b.category,
      badgeText: b.badge?.text ?? '',
      badgeColor: b.badge?.color ?? 'green',
      imageUrl: b.imageUrl ?? '',
    });
    setShowAdd(true);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      removeMenuBurger(id);
      setDeleteConfirm(null);
      toast.success('Burger removed');
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Menu Burgers</h2>
          <p className="text-sm text-muted mt-0.5">{menuBurgers.length} items on the menu</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onPress={() => {
              if (window.confirm('Reset all burgers to defaults?')) {
                resetMenuBurgers();
                toast.success('Menu reset to defaults');
              }
            }}
          >
            Reset defaults
          </Button>
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
            {showAdd && !editId ? 'Cancel' : 'Add burger'}
          </Button>
        </div>
      </div>

      {/* Add / Edit form */}
      {showAdd && (
        <Card>
          <Card.Header className="px-6 pt-4 pb-3">
            <h3 className="font-semibold text-sm">{editId ? 'Edit burger' : 'New burger'}</h3>
          </Card.Header>
          <Card.Content className="px-6 pb-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Name *</label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Truffle Burger"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Category *</label>
                <select
                  className={inputCls}
                  value={form.category}
                  onChange={(e) => set('category', e.target.value)}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Description *</label>
                <textarea
                  className={`${inputCls} resize-none`}
                  rows={2}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Short description of this burger..."
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={inputCls}
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="7.99"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Image URL (optional)</label>
                <input
                  className={inputCls}
                  value={form.imageUrl}
                  onChange={(e) => set('imageUrl', e.target.value)}
                  placeholder="https://... (leave blank for default)"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-medium text-muted">Badge label (optional)</label>
                  <input
                    className={inputCls}
                    value={form.badgeText}
                    onChange={(e) => set('badgeText', e.target.value)}
                    placeholder="e.g. New, Hot, Vegan"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted">Color</label>
                  <select
                    className={`${inputCls} w-auto`}
                    value={form.badgeColor}
                    onChange={(e) => set('badgeColor', e.target.value)}
                  >
                    {BADGE_COLORS.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
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
                  <Check size={14} /> {editId ? 'Save changes' : 'Add burger'}
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      )}

      {/* Burger table */}
      <Card>
        <Card.Content className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                    Name
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                    Category
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                    Price
                  </th>
                  <th className="text-left px-3 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                    Badge
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {menuBurgers.map((b) => (
                  <tr key={b.id} className="hover:bg-surface-secondary/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-medium">{b.name}</p>
                      <p className="text-xs text-muted mt-0.5 line-clamp-1">{b.description}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-secondary border border-border">
                        {b.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-bold">${b.price.toFixed(2)}</td>
                    <td className="px-3 py-3">
                      {b.badge?.text ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-surface-secondary border border-border">
                          <Tag size={9} />
                          {b.badge.text}
                        </span>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => startEdit(b)}
                          className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className={[
                            'p-1.5 rounded-lg transition-colors',
                            deleteConfirm === b.id
                              ? 'text-red-600 bg-red-50 dark:bg-red-950/30'
                              : 'text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30',
                          ].join(' ')}
                          title={deleteConfirm === b.id ? 'Click again to confirm' : 'Delete'}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}
