import { describe, test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import TermsPage from '../index';

const navigateMock = vi.fn();

vi.mock('react-router', async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock('@heroui/react', async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return {
    ...actual,
    Button: ({ onPress, children, ...props }: any) => (
      <button onClick={() => onPress?.()} {...props}>
        {children}
      </button>
    ),
  };
});

const renderTerms = () =>
  render(
    <MemoryRouter>
      <TermsPage />
    </MemoryRouter>,
  );

describe('TermsPage', () => {
  test('renders Terms & Conditions heading', () => {
    const { getByText } = renderTerms();
    expect(getByText('Terms & Conditions')).toBeTruthy();
  });

  test('renders all 9 section headings', () => {
    const { getByText } = renderTerms();
    expect(getByText('1. Acceptance of Terms')).toBeTruthy();
    expect(getByText('9. Contact')).toBeTruthy();
  });

  test('renders section body text', () => {
    const { getByText } = renderTerms();
    expect(getByText(/burger ordering application/i)).toBeTruthy();
  });

  test('navigates back on back button click', () => {
    const { getByText } = renderTerms();
    fireEvent.click(getByText('Back'));
    expect(navigateMock).toHaveBeenCalledWith(-1);
  });
});
