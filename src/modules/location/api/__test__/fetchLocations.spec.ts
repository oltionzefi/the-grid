import { test, expect, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useLocations } from '../fetchLocations';

vi.mock('@/state', () => ({
  useBurgerStore: (selector: any) =>
    selector({
      shopLocations: [
        { id: '1', name: 'Location A', latitude: 48.1351, longitude: 11.582 },
        { id: '2', name: 'Location B', latitude: 48.14, longitude: 11.57 },
      ],
    }),
}));

test('useLocations returns locations from store', () => {
  const { result } = renderHook(() => useLocations());
  expect(result.current.loading).toBe(false);
  expect(result.current.locations.length).toBe(2);
  expect(result.current.locations[0].name).toBe('Location A');
});

test('useLocations always has loading=false', () => {
  const { result } = renderHook(() => useLocations());
  expect(result.current.loading).toBe(false);
});
