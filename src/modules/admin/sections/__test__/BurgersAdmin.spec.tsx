import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import BurgersAdmin from '../BurgersAdmin';

const {
  addMenuBurgerMock,
  updateMenuBurgerMock,
  removeMenuBurgerMock,
  resetMenuBurgersMock,
  toastSuccessMock,
  toastDangerMock,
} = vi.hoisted(() => ({
  addMenuBurgerMock: vi.fn(),
  updateMenuBurgerMock: vi.fn(),
  removeMenuBurgerMock: vi.fn(),
  resetMenuBurgersMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastDangerMock: vi.fn(),
}));

const BURGER = {
  id: 'b1',
  name: 'Test Burger',
  description: 'Tasty',
  price: 7.99,
  category: 'Beef',
  image: '',
  toppings: [],
};

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
    toast: Object.assign(vi.fn(), { success: toastSuccessMock, danger: toastDangerMock }),
  };
});

vi.mock('@/state', () => ({
  useBurgerStore: (selector: (s: any) => any) =>
    selector({
      menuBurgers: [BURGER],
      addMenuBurger: addMenuBurgerMock,
      updateMenuBurger: updateMenuBurgerMock,
      removeMenuBurger: removeMenuBurgerMock,
      resetMenuBurgers: resetMenuBurgersMock,
    }),
  ALL_TOPPINGS: [],
}));

describe('BurgersAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // confirm dialog always returns true
    vi.stubGlobal('confirm', () => true);
  });

  const renderIt = () => render(<BurgersAdmin />);

  test('renders existing burger in table', () => {
    const { getByText } = renderIt();
    expect(getByText('Test Burger')).toBeTruthy();
    expect(getByText('$7.99')).toBeTruthy();
  });

  test('shows item count', () => {
    const { getByText } = renderIt();
    expect(getByText('1 items on the menu')).toBeTruthy();
  });

  test('opens add form on Add burger press', () => {
    const { getByText } = renderIt();
    fireEvent.click(getByText('Add burger'));
    expect(getByText('New burger')).toBeTruthy();
  });

  test('validates required fields on submit', () => {
    const { getByText } = renderIt();
    fireEvent.click(getByText('Add burger'));
    fireEvent.submit(document.querySelector('form')!);
    expect(toastDangerMock).toHaveBeenCalled();
    expect(addMenuBurgerMock).not.toHaveBeenCalled();
  });

  test('validates price must be positive', () => {
    const { getByPlaceholderText, getByText } = renderIt();
    fireEvent.click(getByText('Add burger'));
    fireEvent.change(getByPlaceholderText('e.g. Truffle Burger'), { target: { value: 'X' } });
    fireEvent.change(getByPlaceholderText('Short description of this burger...'), { target: { value: 'Y' } });
    fireEvent.change(getByPlaceholderText('7.99'), { target: { value: '-1' } });
    fireEvent.submit(document.querySelector('form')!);
    expect(toastDangerMock).toHaveBeenCalledWith('Invalid price', expect.anything());
  });

  test('adds burger with valid data', () => {
    const { getByPlaceholderText, getByText } = renderIt();
    fireEvent.click(getByText('Add burger'));
    fireEvent.change(getByPlaceholderText('e.g. Truffle Burger'), { target: { value: 'New One' } });
    fireEvent.change(getByPlaceholderText('Short description of this burger...'), { target: { value: 'Desc' } });
    fireEvent.change(getByPlaceholderText('7.99'), { target: { value: '9.99' } });
    fireEvent.submit(document.querySelector('form')!);
    expect(addMenuBurgerMock).toHaveBeenCalledWith(expect.objectContaining({ name: 'New One', price: 9.99 }));
    expect(toastSuccessMock).toHaveBeenCalled();
  });

  test('opens edit form with pre-filled data', () => {
    const { getByTitle, getByDisplayValue } = renderIt();
    // click edit button (title comes from aria or we find the Edit2 button)
    const editButtons = document.querySelectorAll('button');
    const editBtn = Array.from(editButtons).find((b) => b.innerHTML.includes('Edit2') || b.querySelector('svg'));
    // use the row's edit button — second button in action column
    const actionButtons = document.querySelectorAll('td:last-child button');
    fireEvent.click(actionButtons[0]); // edit button
    expect((getByDisplayValue('Test Burger') as HTMLInputElement).value).toBe('Test Burger');
  });

  test('resets burgers to defaults on confirm', () => {
    const { getByText } = renderIt();
    fireEvent.click(getByText('Reset defaults'));
    expect(resetMenuBurgersMock).toHaveBeenCalled();
  });

  test('first delete click enters confirm state', () => {
    const { container } = renderIt();
    const deleteButtons = container.querySelectorAll('td:last-child button');
    fireEvent.click(deleteButtons[1]); // delete button (second in action pair)
    // button should change to red confirm state — removeMenuBurger not called yet
    expect(removeMenuBurgerMock).not.toHaveBeenCalled();
  });

  test('second delete click removes burger', () => {
    const { container } = renderIt();
    const deleteButtons = container.querySelectorAll('td:last-child button');
    fireEvent.click(deleteButtons[1]);
    fireEvent.click(deleteButtons[1]);
    expect(removeMenuBurgerMock).toHaveBeenCalledWith('b1');
  });
});
