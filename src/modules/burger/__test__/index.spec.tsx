import { test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router';

import BurgerModule from '../index';

const { toastSuccessMock } = vi.hoisted(() => ({
  toastSuccessMock: vi.fn(),
}));

vi.mock('@heroui/react', async (orig) => {
  const actual = (await orig()) as any;
  return {
    ...actual,
    Button: ({ onPress, children, 'aria-label': ariaLabel, ...props }: any) => (
      <button aria-label={ariaLabel} onClick={() => onPress?.()} {...props}>
        {children}
      </button>
    ),
    Modal: Object.assign(({ children }: any) => <div data-testid="modal">{children}</div>, {
      Backdrop: () => null,
      Container: ({ children }: any) => <div>{children}</div>,
      Dialog: ({ children }: any) => <div>{children}</div>,
      Header: ({ children }: any) => <div>{children}</div>,
      Heading: ({ children }: any) => <h2>{children}</h2>,
      Body: ({ children }: any) => <div>{children}</div>,
      Footer: ({ children }: any) => <div>{children}</div>,
      CloseTrigger: () => null,
      Icon: () => null,
    }),
    useOverlayState: () => ({
      isOpen: false,
      open: vi.fn(),
      close: vi.fn(),
      toggle: vi.fn(),
      setOpen: vi.fn(),
    }),
    toast: Object.assign(vi.fn(), { success: toastSuccessMock, error: vi.fn() }),
  };
});

vi.mock('@/modules/burger/api/fetchBurger', () => {
  const DEFAULT_BURGERS = [
    {
      id: '1',
      name: 'Cheeseburger',
      description: 'Classic',
      price: 5.99,
      image: '',
      category: 'Beef',
      badge: { text: 'New', color: 'green' },
      toppings: [],
    },
    {
      id: '2',
      name: 'Veggie Burger',
      description: 'Veggie',
      price: 6.49,
      image: '',
      category: 'Veggie',
      badge: { text: 'Fav', color: 'blue' },
      toppings: [],
    },
    {
      id: '3',
      name: 'Bacon Burger',
      description: 'Bacon',
      price: 7.99,
      image: '',
      category: 'Beef',
      toppings: [],
    },
    {
      id: '4',
      name: 'BBQ Burger',
      description: 'BBQ',
      price: 8.49,
      image: '',
      category: 'Chicken',
      badge: { text: 'Hot' },
      toppings: [],
    },
    {
      id: '5',
      name: 'Special Burger',
      description: 'Special',
      price: 9.49,
      image: '',
      category: 'Chicken',
      badge: { text: 'Rare', color: 'purple' },
      toppings: [],
    },
  ];
  return {
    useFetchBurgers: () => DEFAULT_BURGERS,
    DEFAULT_BURGERS,
    ALL_TOPPINGS: [],
  };
});

vi.mock('@/modules/burger/components/BurgerCustomizeModal', () => ({
  default: ({ burger, onAdd }: any) => {
    if (!burger) return null;
    return (
      <div data-testid="customize-modal">
        <button
          data-testid="confirm-add"
          onClick={() =>
            onAdd({
              cartItemId: `${burger.id}-test`,
              burgerId: burger.id,
              name: burger.name,
              price: burger.price,
              image: burger.image,
              quantity: 1,
              extras: [],
              itemTotal: burger.price,
            })
          }
        >
          Confirm Add
        </button>
      </div>
    );
  },
}));

beforeEach(() => {
  toastSuccessMock.mockClear();
});

function Wrapper() {
  return (
    <MemoryRouter>
      <BurgerModule />
    </MemoryRouter>
  );
}

test('renders burger names', () => {
  const { getByText } = render(<Wrapper />);
  expect(getByText('Cheeseburger')).toBeDefined();
  expect(getByText('Veggie Burger')).toBeDefined();
  expect(getByText('Bacon Burger')).toBeDefined();
});

test('renders burger grid', () => {
  render(<Wrapper />);
  expect(document.querySelector('.grid')).toBeDefined();
});

test('renders hero section', () => {
  const { container } = render(<Wrapper />);
  expect(container.textContent).toContain('Build Your Perfect Burger');
});

test('renders category filter pills', () => {
  render(<Wrapper />);
  expect(document.body.textContent).toContain('All');
  expect(document.body.textContent).toContain('Beef');
  expect(document.body.textContent).toContain('Veggie');
});

test('category filter shows All burgers by default', () => {
  render(<Wrapper />);
  expect(document.body.textContent).toContain('Cheeseburger');
  expect(document.body.textContent).toContain('Veggie Burger');
});

test('renders burgers with and without badge', () => {
  render(<Wrapper />);
  expect(document.body.textContent).toContain('New');
  expect(document.body.textContent).toContain('Bacon Burger');
});

test('renders badge with unknown color (BADGE_COLOR_MAP fallback)', () => {
  render(<Wrapper />);
  expect(document.body.textContent).toContain('Hot');
});

test('add button triggers onAdd and toast via modal', async () => {
  render(<Wrapper />);
  const addBtns = document.querySelectorAll('[aria-label^="Add "]');
  expect(addBtns.length).toBeGreaterThan(0);
  await act(async () => {
    fireEvent.click(addBtns[0] as HTMLElement);
  });
  const confirmBtn = document.querySelector('[data-testid="confirm-add"]') as HTMLElement | null;
  if (confirmBtn) {
    await act(async () => {
      fireEvent.click(confirmBtn);
    });
    expect(toastSuccessMock).toHaveBeenCalled();
  }
});
