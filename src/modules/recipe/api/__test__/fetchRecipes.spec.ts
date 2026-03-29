import { test, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useRecipes } from '../fetchRecipes';

afterEach(() => vi.useRealTimers());

test('useRecipes starts with empty recipes and loading=true', () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useRecipes());
  expect(result.current.loading).toBe(true);
  expect(result.current.recipes).toEqual([]);
});

test('useRecipes resolves recipes after timeout', async () => {
  vi.useFakeTimers();
  const { result } = renderHook(() => useRecipes());

  await act(async () => {
    vi.advanceTimersByTime(400);
    await Promise.resolve();
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.recipes.length).toBeGreaterThan(0);
});
