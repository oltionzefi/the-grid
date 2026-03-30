import { useBurgerStore } from '@/state';

export const useLocations = () => {
  const shopLocations = useBurgerStore((s) => s.shopLocations);
  return { locations: shopLocations, loading: false };
};
