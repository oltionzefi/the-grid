import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';

import AdminPage from '../index';

// ── heroui mock ────────────────────────────────────────────────────────────
vi.mock('@heroui/react', async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return {
    ...actual,
    Button: ({ onPress, children, type, ...props }: any) => (
      <button type={type ?? 'button'} onClick={() => onPress?.()} {...props}>
        {children}
      </button>
    ),
    Card: Object.assign(({ children }: any) => <div>{children}</div>, {
      Header: ({ children }: any) => <div>{children}</div>,
      Content: ({ children }: any) => <div>{children}</div>,
    }),
    toast: Object.assign(vi.fn(), { success: vi.fn(), danger: vi.fn(), error: vi.fn() }),
  };
});

// ── store mock ────────────────────────────────────────────────────────────
vi.mock('@/state', () => ({
  useBurgerStore: (selector: (s: any) => any) =>
    selector({
      storeConfig: { name: 'Test Grid', emoji: '🍔' },
      menuBurgers: [],
      shopLocations: [],
      builderIngredients: [],
      burgers: [],
      addMenuBurger: vi.fn(),
      updateMenuBurger: vi.fn(),
      removeMenuBurger: vi.fn(),
      resetMenuBurgers: vi.fn(),
      addShopLocation: vi.fn(),
      updateShopLocation: vi.fn(),
      removeShopLocation: vi.fn(),
      addBuilderIngredient: vi.fn(),
      updateBuilderIngredient: vi.fn(),
      removeBuilderIngredient: vi.fn(),
      resetBuilderIngredients: vi.fn(),
      setStoreConfig: vi.fn(),
    }),
  ALL_TOPPINGS: [],
}));

// ── section mocks (keep simple to focus on AdminPage behaviour) ───────────
vi.mock('../sections/Dashboard', () => ({ default: ({ onNavigate }: any) => <button onClick={() => onNavigate('burgers')}>Dashboard</button> }));
vi.mock('../sections/BurgersAdmin', () => ({ default: () => <div>BurgersAdmin</div> }));
vi.mock('../sections/LocationsAdmin', () => ({ default: () => <div>LocationsAdmin</div> }));
vi.mock('../sections/BuilderAdmin', () => ({ default: () => <div>BuilderAdmin</div> }));
vi.mock('../sections/StoreAdmin', () => ({ default: () => <div>StoreAdmin</div> }));

const renderAdmin = () => render(<AdminPage />);

describe('AdminPage — PIN gate', () => {
  test('shows PIN form before authentication', () => {
    const { getByPlaceholderText, getByText } = renderAdmin();
    expect(getByPlaceholderText('Enter PIN')).toBeTruthy();
    expect(getByText('Unlock Admin Panel')).toBeTruthy();
  });

  test('shows error on wrong PIN', () => {
    const { getByPlaceholderText, getByText } = renderAdmin();
    const input = getByPlaceholderText('Enter PIN');
    fireEvent.change(input, { target: { value: '9999' } });
    fireEvent.submit(input.closest('form')!);
    expect(getByText('Incorrect PIN. Try again.')).toBeTruthy();
  });

  test('clears PIN field after wrong attempt', () => {
    const { getByPlaceholderText } = renderAdmin();
    const input = getByPlaceholderText('Enter PIN') as HTMLInputElement;
    fireEvent.change(input, { target: { value: '9999' } });
    fireEvent.submit(input.closest('form')!);
    expect(input.value).toBe('');
  });

  test('grants access with correct PIN 1234', () => {
    const { getByPlaceholderText, getAllByText } = renderAdmin();
    const input = getByPlaceholderText('Enter PIN');
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.submit(input.closest('form')!);
    // "Dashboard" appears in sidebar nav AND the mocked section
    expect(getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1);
  });
});

describe('AdminPage — navigation', () => {
  const login = () => {
    const utils = renderAdmin();
    const input = utils.getByPlaceholderText('Enter PIN');
    fireEvent.change(input, { target: { value: '1234' } });
    fireEvent.submit(input.closest('form')!);
    return utils;
  };

  test('shows dashboard section by default after login', () => {
    const { getAllByText } = login();
    expect(getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1);
  });

  test('switches to Burgers section via sidebar', () => {
    const { getByText } = login();
    fireEvent.click(getByText('Burgers'));
    expect(getByText('BurgersAdmin')).toBeTruthy();
  });

  test('switches to Locations section via sidebar', () => {
    const { getByText } = login();
    fireEvent.click(getByText('Locations'));
    expect(getByText('LocationsAdmin')).toBeTruthy();
  });

  test('switches to Builder section via sidebar', () => {
    const { getByText } = login();
    fireEvent.click(getByText('Builder'));
    expect(getByText('BuilderAdmin')).toBeTruthy();
  });

  test('switches to Store section via sidebar', () => {
    const { getByText } = login();
    fireEvent.click(getByText('Store'));
    expect(getByText('StoreAdmin')).toBeTruthy();
  });

  test('navigates via Dashboard onNavigate callback', () => {
    const { getAllByText, getByText } = login();
    // getAllByText('Dashboard')[1] is the section stub (not the sidebar nav link)
    fireEvent.click(getAllByText('Dashboard')[1]);
    expect(getByText('BurgersAdmin')).toBeTruthy();
  });

  test('exits admin panel via Exit admin button', () => {
    const { getByText, getByPlaceholderText } = login();
    fireEvent.click(getByText('Exit admin'));
    expect(getByPlaceholderText('Enter PIN')).toBeTruthy();
  });

  test('displays store name and emoji in sidebar', () => {
    const { getByText } = login();
    expect(getByText('Test Grid')).toBeTruthy();
  });
});
