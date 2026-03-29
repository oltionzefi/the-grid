import { test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Location from '../index';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map">{children}</div>,
  TileLayer: () => null,
  Marker: ({ children, position }: any) => (
    <div data-testid="marker" data-pos={JSON.stringify(position)}>
      {children}
    </div>
  ),
  Popup: ({ children }: any) => <div>{children}</div>,
  // useMap is used by the MapFlyTo internal component
  useMap: () => ({ flyTo: vi.fn() }),
}));

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

test('Location renders callout with location access message', () => {
  render(
    <MemoryRouter>
      <Location />
    </MemoryRouter>,
  );
  // The button to trigger geolocation
  expect(screen.getByLabelText(/Use my location/i)).toBeDefined();
});

test('Location renders map container', () => {
  render(
    <MemoryRouter>
      <Location />
    </MemoryRouter>,
  );
  expect(document.querySelector('[data-testid="map"]')).toBeDefined();
});

test('Location renders markers after loading', async () => {
  render(
    <MemoryRouter>
      <Location />
    </MemoryRouter>,
  );

  await act(async () => {
    vi.advanceTimersByTime(1100);
    await Promise.resolve();
  });

  const markers = document.querySelectorAll('[data-testid="marker"]');
  expect(markers.length).toBeGreaterThan(0);
});

test('Location renders location names in popups after load', async () => {
  render(
    <MemoryRouter>
      <Location />
    </MemoryRouter>,
  );

  await act(async () => {
    vi.advanceTimersByTime(1100);
    await Promise.resolve();
  });

  // Default store locations
  expect(screen.getByText('The Grid — Munich Central')).toBeDefined();
  expect(screen.getByText('The Grid — Munich East')).toBeDefined();
});
