/**
 * useBootstrap — loads remote data into Zustand on first mount.
 *
 * On successful API responses, Zustand store is updated with real data.
 * On failure (no auth, network error) the existing default/persisted data
 * remains in place — the app degrades gracefully.
 *
 * Call this once at the top of the component tree (e.g. in App.tsx).
 */
import { useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import BurgerImage from '@/assets/burger.webp';
import { useBurgerStore } from '@/state';
import { useApi } from './useApi';
import type { ApiBurger, ApiLocation, ApiIngredient } from './api';

function mapApiBurger(burger: ApiBurger) {
  return {
    id: burger.id,
    name: burger.name,
    description: burger.description ?? '',
    price: burger.price_cents / 100,
    image: BurgerImage,
    imageUrl: undefined,
    category: 'Beef',
    toppings: [],
  };
}

function mapApiLocation(location: ApiLocation) {
  return {
    id: location.id,
    name: location.name,
    address: location.address ? { street: location.address, city: '', state: '' } : undefined,
    phoneNumber: location.phone,
  };
}

function mapApiIngredient(ingredient: ApiIngredient) {
  const categoryMap: Record<string, string> = {
    bread: 'bun',
    protein: 'patty',
    dairy: 'cheese',
    vegetable: 'veggie',
    condiment: 'sauce',
  };
  return {
    id: ingredient.id,
    name: ingredient.name,
    category: (categoryMap[ingredient.category] ?? 'sauce') as 'bun' | 'patty' | 'cheese' | 'veggie' | 'sauce',
    emoji: '🧅',
    price: 0,
  };
}

export function useBootstrap() {
  const { isAuthenticated, isLoading } = useAuth0();
  const api = useApi();
  const store = useBurgerStore();

  // Stable refs so effects don't re-run when store actions change identity.
  const storeRef = useRef(store);
  storeRef.current = store;
  const apiRef = useRef(api);
  apiRef.current = api;

  // Burgers — each resource gets its own effect + cancel flag so a slow
  // response for one resource cannot block or interleave with another.
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    let cancelled = false;

    apiRef.current.burgers
      .list()
      .then((list) => {
        if (cancelled || list.length === 0) return;
        list.forEach((burger) => {
          const mapped = mapApiBurger(burger);
          const exists = storeRef.current.menuBurgers.find((existing) => existing.id === mapped.id);
          if (exists) storeRef.current.updateMenuBurger(mapped);
          else storeRef.current.addMenuBurger(mapped);
        });
      })
      .catch(() => {
        // Graceful degradation: keep defaults
      });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading]);

  // Locations
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    let cancelled = false;

    apiRef.current.locations
      .list()
      .then((list) => {
        if (cancelled || list.length === 0) return;
        list.forEach((location) => {
          const mapped = mapApiLocation(location);
          const exists = storeRef.current.shopLocations.find(
            (existing) => existing.id === mapped.id,
          );
          if (exists) storeRef.current.updateShopLocation(mapped);
          else storeRef.current.addShopLocation(mapped);
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading]);

  // Ingredients
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;

    let cancelled = false;

    apiRef.current.ingredients
      .list()
      .then((list) => {
        if (cancelled || list.length === 0) return;
        list.forEach((ingredient) => {
          const mapped = mapApiIngredient(ingredient);
          const exists = storeRef.current.builderIngredients.find(
            (existing) => existing.id === mapped.id,
          );
          if (exists) storeRef.current.updateBuilderIngredient(mapped);
          else storeRef.current.addBuilderIngredient(mapped);
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isLoading]);
}
