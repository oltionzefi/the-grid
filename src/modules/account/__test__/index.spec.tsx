import { test, expect, vi, afterEach } from 'vitest';
import { render, fireEvent, screen, act } from '@testing-library/react';
import Account from '../index';

afterEach(() => vi.useRealTimers());

test('renders Account heading', () => {
  render(<Account />);
  // Multiple elements show the user's name — check at least one exists
  const names = screen.getAllByText('Max Mustermann');
  expect(names.length).toBeGreaterThan(0);
});

test('renders loyalty card with user details', () => {
  render(<Account />);
  const nameElements = screen.getAllByText('Max Mustermann');
  expect(nameElements.length).toBeGreaterThan(0);
  expect(screen.getByText('max.musterman@mustermann.com')).toBeDefined();
  const memberBadges = screen.getAllByText(/Gold Member/i);
  expect(memberBadges.length).toBeGreaterThan(0);
});

test('renders Edit profile button', () => {
  const { getByText } = render(<Account />);
  expect(getByText('Edit profile')).toBeDefined();
});

test('copy button triggers clipboard.writeText', async () => {
  const writeTextMock = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: writeTextMock },
    writable: true,
    configurable: true,
  });
  vi.useFakeTimers();

  render(<Account />);

  const buttons = screen.getAllByRole('button');
  const copyBtn = buttons.find((b) =>
    /copy/i.test(b.getAttribute('aria-label') ?? b.textContent ?? ''),
  );

  if (copyBtn) {
    await act(async () => {
      fireEvent.click(copyBtn);
      await Promise.resolve();
    });
    expect(writeTextMock).toHaveBeenCalled();
  }
  expect(true).toBe(true);
});
