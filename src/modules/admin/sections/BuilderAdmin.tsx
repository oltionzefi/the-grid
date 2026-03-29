import { useState } from 'react';
import { Button, Card, toast } from '@heroui/react';
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react';

import { useBurgerStore } from '@/state';

import {
  CATEGORY_META,
  CATEGORY_ORDER,
  type Ingredient,
  type IngredientCategory,
} from '@/modules/build/api/ingredients';

const inputCls =
  'w-full text-sm rounded-xl border border-border bg-overlay px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]/50 placeholder:text-muted';

type FormState = {
  name: string;
  category: IngredientCategory;
  emoji: string;
  price: string;
  description: string;
};
const emptyForm: FormState = {
  name: '',
  category: 'veggie',
  emoji: '',
  price: '',
  description: '',
};

export default function BuilderAdmin() {
  const builderIngredients = useBurgerStore((s) => s.builderIngredients);
  const addBuilderIngredient = useBurgerStore((s) => s.addBuilderIngredient);
  const updateBuilderIngredient = useBurgerStore((s) => s.updateBuilderIngredient);
  const removeBuilderIngredient = useBurgerStore((s) => s.removeBuilderIngredient);
  const resetBuilderIngredients = useBurgerStore((s) => s.resetBuilderIngredients);

  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<IngredientCategory>('veggie');

  const set = (k: keyof FormState, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.emoji.trim()) {
      toast.danger('Required fields missing', { description: 'Name and emoji are required.' });
      return;
    }
    const price = parseFloat(form.price);
    if (Number.isNaN(price) || price < 0) {
      toast.danger('Invalid price', { description: 'Enter a valid price (0 or more).' });
      return;
    }
    const ingredient: Ingredient = {
      id: editId ?? `${form.category}-${Date.now()}`,
      name: form.name.trim(),
      category: form.category,
      emoji: form.emoji.trim(),
      price,
      description: form.description.trim() || undefined,
    };
    if (editId) {
      updateBuilderIngredient(ingredient);
      toast.success('Ingredient updated', { description: ingredient.name });
    } else {
      addBuilderIngredient(ingredient);
      toast.success('Ingredient added', { description: ingredient.name });
    }
    setShowAdd(false);
    setEditId(null);
    setForm(emptyForm);
  };

  const startEdit = (ing: Ingredient) => {
    setEditId(ing.id);
    setForm({
      name: ing.name,
      category: ing.category,
      emoji: ing.emoji,
      price: String(ing.price),
      description: ing.description ?? '',
    });
    setActiveCategory(ing.category);
    setShowAdd(true);
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      removeBuilderIngredient(id);
      setDeleteConfirm(null);
      toast.success('Ingredient removed');
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const filtered = builderIngredients.filter((i) => i.category === activeCategory);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Builder Ingredients</h2>
          <p className="text-sm text-muted mt-0.5">
            {builderIngredients.length} ingredients available
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onPress={() => {
              if (window.confirm('Reset all ingredients to defaults?')) {
                resetBuilderIngredients();
                toast.success('Ingredients reset to defaults');
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
              setForm({ ...emptyForm, category: activeCategory });
              setShowAdd((v) => !v);
            }}
          >
            <Plus size={14} />
            {showAdd && !editId ? 'Cancel' : 'Add ingredient'}
          </Button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORY_ORDER.map((cat) => {
          const meta = CATEGORY_META[cat];
          const count = builderIngredients.filter((i) => i.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                activeCategory === cat
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-surface-secondary text-muted hover:text-foreground',
              ].join(' ')}
            >
              {meta.emoji} {meta.label}
              <span
                className={[
                  'text-xs px-1.5 py-0.5 rounded-full',
                  activeCategory === cat ? 'bg-white/20 text-white' : 'bg-border',
                ].join(' ')}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {showAdd && (
        <Card>
          <Card.Header className="px-6 pt-4 pb-3">
            <h3 className="font-semibold text-sm">
              {editId ? 'Edit ingredient' : 'New ingredient'}
            </h3>
          </Card.Header>
          <Card.Content className="px-6 pb-5">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Name *</label>
                <input
                  className={inputCls}
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Pickled Onions"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-xs font-medium text-muted">Category</label>
                  <select
                    className={inputCls}
                    value={form.category}
                    onChange={(e) => set('category', e.target.value as IngredientCategory)}
                  >
                    {CATEGORY_ORDER.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_META[c].label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1 w-24">
                  <label className="text-xs font-medium text-muted">Emoji *</label>
                  <input
                    className={inputCls}
                    value={form.emoji}
                    onChange={(e) => set('emoji', e.target.value)}
                    placeholder="🥕"
                    maxLength={4}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className={inputCls}
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  placeholder="0.50"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted">Description</label>
                <input
                  className={inputCls}
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  placeholder="Optional short description"
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
                  <Check size={14} /> {editId ? 'Save changes' : 'Add ingredient'}
                </Button>
              </div>
            </form>
          </Card.Content>
        </Card>
      )}

      {/* Ingredient grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {filtered.map((ing) => (
          <Card key={ing.id} className="overflow-hidden">
            <Card.Content className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{ing.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{ing.name}</p>
                    {ing.description && (
                      <p className="text-xs text-muted mt-0.5">{ing.description}</p>
                    )}
                    <p className="text-xs font-bold text-[var(--accent)] mt-1">
                      ${ing.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    onClick={() => startEdit(ing)}
                    className="p-1.5 rounded-lg text-muted hover:text-foreground hover:bg-surface-secondary transition-colors"
                  >
                    <Edit2 size={13} />
                  </button>
                  <button
                    onClick={() => handleDelete(ing.id)}
                    className={[
                      'p-1.5 rounded-lg transition-colors',
                      deleteConfirm === ing.id
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
        {filtered.length === 0 && (
          <div className="sm:col-span-2 xl:col-span-3 text-center py-10 text-muted text-sm">
            No {CATEGORY_META[activeCategory].label.toLowerCase()} ingredients yet.
          </div>
        )}
      </div>
    </div>
  );
}
