import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { type Burger, DEFAULT_BURGERS, ALL_TOPPINGS } from '@/modules/burger/api/fetchBurger';

import { type Ingredient, INGREDIENTS } from '@/modules/build/api/ingredients';

export type { Burger };

export interface CartExtra {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  cartItemId: string;
  burgerId: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
  extras: CartExtra[];
  itemTotal: number;
}

export interface ShopLocation {
  id: string;
  name: string;
  latitude?: number;
  longitude?: number;
  address?: {
    street: string;
    city: string;
    state?: string;
    zipCode?: string;
  };
  hours?: string;
  phoneNumber?: string;
}

export interface StoreConfig {
  name: string;
  emoji: string;
}

const DEFAULT_LOCATIONS: ShopLocation[] = [
  {
    id: '1',
    name: 'The Grid — Munich Central',
    latitude: 48.1351,
    longitude: 11.582,
    address: { street: '123 Main St', city: 'Munich', state: 'Bavaria', zipCode: '80331' },
    phoneNumber: '123-456-7890',
  },
  {
    id: '2',
    name: 'The Grid — Munich East',
    latitude: 48.1351,
    longitude: 11.682,
    address: { street: '456 Elm St', city: 'Munich', state: 'Bavaria', zipCode: '80333' },
    phoneNumber: '987-654-3210',
  },
];

interface BurgerState {
  // Cart
  burgers: CartItem[];
  // User preferences
  locationEnabled: boolean;
  // Shop locations
  preferredLocationId: string | null;
  shopLocations: ShopLocation[];
  // Admin-managed menu burgers
  menuBurgers: Burger[];
  // Admin-managed builder ingredients
  builderIngredients: Ingredient[];
  // Store branding
  storeConfig: StoreConfig;

  // Cart actions
  addBurger: (item: CartItem) => void;
  removeAllBurgers: () => void;
  removeBurger: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  // User preference actions
  setLocationEnabled: (enabled: boolean) => void;
  // Location actions
  setPreferredLocation: (id: string | null) => void;
  addShopLocation: (loc: ShopLocation) => void;
  updateShopLocation: (loc: ShopLocation) => void;
  removeShopLocation: (id: string) => void;
  // Menu burger actions
  addMenuBurger: (b: Burger) => void;
  updateMenuBurger: (b: Burger) => void;
  removeMenuBurger: (id: string) => void;
  resetMenuBurgers: () => void;
  // Builder ingredient actions
  addBuilderIngredient: (i: Ingredient) => void;
  updateBuilderIngredient: (i: Ingredient) => void;
  removeBuilderIngredient: (id: string) => void;
  resetBuilderIngredients: () => void;
  // Store config actions
  setStoreConfig: (cfg: Partial<StoreConfig>) => void;
}

const computeItemTotal = (price: number, extras: CartExtra[], quantity: number): number =>
  (price + extras.reduce((sum, e) => sum + e.price, 0)) * quantity;

const burgerStore = (set: (fn: (s: BurgerState) => Partial<BurgerState>) => void): BurgerState => ({
  burgers: [],
  locationEnabled: false,
  preferredLocationId: null,
  shopLocations: DEFAULT_LOCATIONS,
  menuBurgers: DEFAULT_BURGERS,
  builderIngredients: INGREDIENTS,
  storeConfig: { name: 'The Grid', emoji: '🍔' },

  addBurger: (item) => set((state) => ({ burgers: [...state.burgers, item] })),
  removeAllBurgers: () => set(() => ({ burgers: [] })),
  removeBurger: (cartItemId) =>
    set((state) => ({ burgers: state.burgers.filter((b) => b.cartItemId !== cartItemId) })),
  updateQuantity: (cartItemId, quantity) =>
    set((state) => ({
      burgers:
        quantity <= 0
          ? state.burgers.filter((b) => b.cartItemId !== cartItemId)
          : state.burgers.map((b) => {
              if (b.cartItemId !== cartItemId) return b;
              return { ...b, quantity, itemTotal: computeItemTotal(b.price, b.extras, quantity) };
            }),
    })),
  setLocationEnabled: (enabled) => set(() => ({ locationEnabled: enabled })),
  setPreferredLocation: (id) => set(() => ({ preferredLocationId: id })),
  addShopLocation: (loc) => set((state) => ({ shopLocations: [...state.shopLocations, loc] })),
  updateShopLocation: (loc) =>
    set((state) => ({
      shopLocations: state.shopLocations.map((l) => (l.id === loc.id ? loc : l)),
    })),
  removeShopLocation: (id) =>
    set((state) => ({ shopLocations: state.shopLocations.filter((l) => l.id !== id) })),

  addMenuBurger: (b) => set((s) => ({ menuBurgers: [...s.menuBurgers, b] })),
  updateMenuBurger: (b) =>
    set((s) => ({ menuBurgers: s.menuBurgers.map((m) => (m.id === b.id ? b : m)) })),
  removeMenuBurger: (id) => set((s) => ({ menuBurgers: s.menuBurgers.filter((m) => m.id !== id) })),
  resetMenuBurgers: () => set(() => ({ menuBurgers: DEFAULT_BURGERS })),

  addBuilderIngredient: (i) => set((s) => ({ builderIngredients: [...s.builderIngredients, i] })),
  updateBuilderIngredient: (i) =>
    set((s) => ({ builderIngredients: s.builderIngredients.map((x) => (x.id === i.id ? i : x)) })),
  removeBuilderIngredient: (id) =>
    set((s) => ({ builderIngredients: s.builderIngredients.filter((x) => x.id !== id) })),
  resetBuilderIngredients: () => set(() => ({ builderIngredients: INGREDIENTS })),

  setStoreConfig: (cfg) => set((s) => ({ storeConfig: { ...s.storeConfig, ...cfg } })),
});

export { ALL_TOPPINGS };

export const useBurgerStore = create(
  persist(burgerStore, {
    name: 'burgers',
    version: 3,
    storage: createJSONStorage(() => sessionStorage),
    migrate: (persisted: unknown) => {
      const s = (persisted ?? {}) as Record<string, unknown>;
      return {
        burgers: Array.isArray(s.burgers) ? s.burgers : [],
        locationEnabled: typeof s.locationEnabled === 'boolean' ? s.locationEnabled : false,
        preferredLocationId: (s.preferredLocationId as string | null) ?? null,
        shopLocations: Array.isArray(s.shopLocations) ? s.shopLocations : DEFAULT_LOCATIONS,
        menuBurgers: Array.isArray(s.menuBurgers) ? s.menuBurgers : DEFAULT_BURGERS,
        builderIngredients: Array.isArray(s.builderIngredients)
          ? s.builderIngredients
          : INGREDIENTS,
        storeConfig: (s.storeConfig as StoreConfig) ?? { name: 'The Grid', emoji: '🍔' },
      };
    },
  }),
);
