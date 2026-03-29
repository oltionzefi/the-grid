import { useBurgerStore, type ShopLocation } from '@/state';

export type { ShopLocation };

export const useLocations = () => {
  const shopLocations = useBurgerStore((s) => s.shopLocations);
  return { locations: shopLocations, loading: false };
};
