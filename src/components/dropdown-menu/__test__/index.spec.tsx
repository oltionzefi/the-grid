import { test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import BurgersDropdownMenu from '../index';

const mockNavigate = vi.fn();
const mockOnSetValue = vi.fn();

// The component imports from 'react-router' (v7), mock that
vi.mock('react-router', async (orig) => ({
  ...((await orig()) as any),
  useNavigate: () => mockNavigate,
}));

vi.mock('@heroui/react', async (orig) => {
  const actual = (await orig()) as any;
  return {
    ...actual,
    Dropdown: Object.assign(({ children }: any) => <div>{children}</div>, {
      Trigger: ({ children }: any) => <div>{children}</div>,
      Popover: ({ children }: any) => <div>{children}</div>,
      Menu: ({ children }: any) => <div>{children}</div>,
      Item: ({ children, onAction }: any) => (
        <button data-testid={`item-${String(children).toLowerCase()}`} onClick={onAction}>
          {children}
        </button>
      ),
    }),
  };
});

beforeEach(() => {
  mockNavigate.mockClear();
  mockOnSetValue.mockClear();
});

test('BurgersDropdownMenu renders trigger', () => {
  render(
    <MemoryRouter>
      <BurgersDropdownMenu onSetValue={mockOnSetValue} />
    </MemoryRouter>,
  );
  expect(document.body).toBeDefined();
});

test('clicking Settings item calls navigate and onSetValue', () => {
  render(
    <MemoryRouter>
      <BurgersDropdownMenu onSetValue={mockOnSetValue} />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByText('Settings'));
  expect(mockNavigate).toHaveBeenCalledWith('/settings');
  expect(mockOnSetValue).toHaveBeenCalledWith('settings');
});

test('clicking FAQ item navigates to /faq', () => {
  render(
    <MemoryRouter>
      <BurgersDropdownMenu onSetValue={mockOnSetValue} />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByText('FAQ'));
  expect(mockNavigate).toHaveBeenCalledWith('/faq');
  expect(mockOnSetValue).toHaveBeenCalledWith('faq');
});

test('clicking Account item navigates to /account', () => {
  render(
    <MemoryRouter>
      <BurgersDropdownMenu onSetValue={mockOnSetValue} />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByText('Account'));
  expect(mockNavigate).toHaveBeenCalledWith('/account');
  expect(mockOnSetValue).toHaveBeenCalledWith('account');
});
