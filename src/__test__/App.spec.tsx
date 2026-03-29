import { test, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import App from '../App';

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((q: string) => ({
      matches: false,
      media: q,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div>{children}</div>,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
}));

vi.mock('react-router-dom', async (orig) => ({
  ...((await orig()) as any),
  useNavigate: () => vi.fn(),
  useLocation: () => ({ pathname: '/' }),
}));

test('App renders navigation', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByText('Burgers')).toBeDefined();
});

test('App renders footer with copyright', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(screen.getByText(/All rights reserved/i)).toBeDefined();
});

test('App renders main content area', () => {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  expect(document.querySelector('main')).toBeDefined();
});
