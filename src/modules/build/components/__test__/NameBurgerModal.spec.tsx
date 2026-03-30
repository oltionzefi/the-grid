import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/react';

import NameBurgerModal from '../NameBurgerModal';

const { toastDangerMock } = vi.hoisted(() => ({
  toastDangerMock: vi.fn(),
}));

vi.mock('@heroui/react', async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return {
    ...actual,
    Modal: Object.assign(({ children }: any) => <div>{children}</div>, {
      Backdrop: ({ children }: any) => <div>{children}</div>,
      Container: ({ children }: any) => <div>{children}</div>,
      Dialog: ({ children }: any) => <div>{children}</div>,
      Header: ({ children }: any) => <div>{children}</div>,
      Heading: ({ children }: any) => <h2>{children}</h2>,
      Body: ({ children }: any) => <div>{children}</div>,
      Footer: ({ children }: any) => <div>{children}</div>,
    }),
    Button: ({ onPress, children, isDisabled, ...props }: any) => (
      <button onClick={() => onPress?.()} disabled={isDisabled} {...props}>
        {children}
      </button>
    ),
    useOverlayState: () => ({ isOpen: false, open: vi.fn(), close: vi.fn() }),
    toast: Object.assign(vi.fn(), { danger: toastDangerMock }),
  };
});

const SELECTED = [
  { id: 'bun-1', category: 'bun', name: 'Sesame Bun', emoji: '🫓', price: 0.5 },
  { id: 'patty-1', category: 'patty', name: 'Beef Patty', emoji: '🥩', price: 2.5 },
];

const renderModal = (isOpen = true, overrides = {}) => {
  const onConfirm = vi.fn();
  const onClose = vi.fn();
  const result = render(
    <NameBurgerModal
      isOpen={isOpen}
      selected={SELECTED}
      totalPrice={3.0}
      onConfirm={onConfirm}
      onClose={onClose}
      {...overrides}
    />,
  );
  return { ...result, onConfirm, onClose };
};

describe('NameBurgerModal', () => {
  beforeEach(() => vi.clearAllMocks());

  test('renders nothing when isOpen is false', () => {
    const { container } = renderModal(false);
    expect(container.textContent).toBe('');
  });

  test('renders modal content when isOpen is true', () => {
    const { getByText } = renderModal();
    expect(getByText('Name Your Creation')).toBeTruthy();
  });

  test('shows total price', () => {
    const { getByText } = renderModal();
    expect(getByText('$3.00')).toBeTruthy();
  });

  test('shows selected ingredients', () => {
    const { getByText } = renderModal();
    expect(getByText(/Sesame Bun/)).toBeTruthy();
    expect(getByText(/Beef Patty/)).toBeTruthy();
  });

  test('updates name input on change', () => {
    const { getByPlaceholderText } = renderModal();
    const input = getByPlaceholderText(/"The Midnight Stack"/);
    fireEvent.change(input, { target: { value: 'Monster Stack' } });
    expect((input as HTMLInputElement).value).toBe('Monster Stack');
  });

  test('shows char counter', () => {
    const { getByPlaceholderText, getByText } = renderModal();
    const input = getByPlaceholderText(/"The Midnight Stack"/);
    fireEvent.change(input, { target: { value: 'Hi' } });
    expect(getByText('2/40')).toBeTruthy();
  });

  test('shows danger toast when confirming with empty name via Enter key', () => {
    const { getByPlaceholderText } = renderModal();
    const input = getByPlaceholderText(/"The Midnight Stack"/);
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(toastDangerMock).toHaveBeenCalledWith('Please give your burger a name!');
  });

  test('calls onConfirm with trimmed name on valid submit', () => {
    const { getByPlaceholderText, getByText, onConfirm } = renderModal();
    fireEvent.change(getByPlaceholderText(/"The Midnight Stack"/), {
      target: { value: '  My Burger  ' },
    });
    fireEvent.click(getByText('Add to Cart'));
    expect(onConfirm).toHaveBeenCalledWith('My Burger');
  });

  test('calls onConfirm when Enter key is pressed in input', () => {
    const { getByPlaceholderText, onConfirm } = renderModal();
    const input = getByPlaceholderText(/"The Midnight Stack"/);
    fireEvent.change(input, { target: { value: 'Enter Burger' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onConfirm).toHaveBeenCalledWith('Enter Burger');
  });

  test('calls onClose when Cancel is clicked', () => {
    const { getByText, onClose } = renderModal();
    fireEvent.click(getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  test('Add to Cart button is disabled when name is empty', () => {
    const { getByText } = renderModal();
    const btn = getByText('Add to Cart') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
