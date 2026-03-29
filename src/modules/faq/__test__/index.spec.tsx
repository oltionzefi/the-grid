import { test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FAQ from '../index';

test('FAQ renders heading', () => {
  render(<FAQ />);
  expect(screen.getByText(/Help & FAQ/i)).toBeDefined();
});

test('FAQ renders all questions', () => {
  render(<FAQ />);
  expect(screen.getByText(/How do I place an order\?/i)).toBeDefined();
  expect(screen.getByText(/Can I customise my burger\?/i)).toBeDefined();
  expect(screen.getByText(/Are there vegetarian or vegan options\?/i)).toBeDefined();
  expect(screen.getByText(/How do loyalty points work\?/i)).toBeDefined();
});
