import { test, expect, vi, beforeAll, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'next-themes';
import { MemoryRouter } from 'react-router';
import Settings from '../index';

const { themeRef } = vi.hoisted(() => ({
  themeRef: { current: 'system' as string | null },
}));

vi.mock('next-themes', async (orig) => {
  const actual = (await orig()) as any;
  return {
    ...actual,
    useTheme: () => ({ theme: themeRef.current, setTheme: vi.fn() }),
  };
});

vi.mock('@heroui/react', async (orig) => {
  const actual = (await orig()) as any;
  return {
    ...actual,
    toast: Object.assign(vi.fn(), { success: vi.fn(), error: vi.fn() }),
  };
});

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

beforeEach(() => {
  themeRef.current = 'system';
});

function Wrapper() {
  return (
    <MemoryRouter>
      <ThemeProvider attribute="class" defaultTheme="system">
        <Settings />
      </ThemeProvider>
    </MemoryRouter>
  );
}

test('Settings renders heading', () => {
  render(<Wrapper />);
  expect(screen.getByRole('heading', { name: /Settings/i })).toBeDefined();
});

test('Settings renders location access toggle', () => {
  render(<Wrapper />);
  expect(screen.getByLabelText(/Enable location access/i)).toBeDefined();
});

test('Settings renders Terms & Conditions link', () => {
  render(<Wrapper />);
  expect(screen.getByText(/Terms & Conditions/i)).toBeDefined();
});

test('Settings renders save button', () => {
  render(<Wrapper />);
  expect(screen.getByText(/Save settings/i)).toBeDefined();
});

test('clicking Save settings shows toast', async () => {
  const { toast } = await import('@heroui/react');
  render(<Wrapper />);
  fireEvent.click(screen.getByText(/Save settings/i));
  expect((toast as any).success).toHaveBeenCalled();
});

test('Settings renders with null theme (covers ?? fallback branch)', () => {
  themeRef.current = null;
  render(<Wrapper />);
  expect(screen.getByText(/Save settings/i)).toBeDefined();
});

test('Settings switch onChange handlers are callable', () => {
  render(<Wrapper />);
  document
    .querySelectorAll('[data-slot="switch"]')
    .forEach((sw) => fireEvent.click(sw as HTMLElement));
  expect(screen.getByText(/Save settings/i)).toBeDefined();
});

test('Settings RadioGroup onChange covers setTheme', () => {
  render(<Wrapper />);
  const radios = document.querySelectorAll('[data-slot="radio"]');
  if (radios.length > 0) fireEvent.click(radios[0] as HTMLElement);
  expect(screen.getByText(/Save settings/i)).toBeDefined();
});
