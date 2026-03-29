import { useState } from 'react';
import { Modal, Button, useOverlayState, toast } from '@heroui/react';
import { ShoppingBag, Pencil } from 'lucide-react';

import type { Ingredient } from '@/modules/build/api/ingredients';

interface Props {
  selected: Ingredient[];
  totalPrice: number;
  onConfirm: (name: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export default function NameBurgerModal({
  selected,
  totalPrice,
  onConfirm,
  onClose,
  isOpen,
}: Props) {
  const [name, setName] = useState('');
  const state = useOverlayState({ defaultOpen: false });

  // Sync external isOpen with internal state
  const effectiveOpen = isOpen;

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      toast.danger('Please give your burger a name!');
      return;
    }
    onConfirm(trimmed);
    setName('');
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  if (!effectiveOpen) return null;

  return (
    <Modal
      state={
        { ...state, isOpen: effectiveOpen, close: handleClose } as ReturnType<
          typeof useOverlayState
        >
      }
    >
      <Modal.Backdrop isDismissable>
        <Modal.Container size="sm" placement="center">
          <Modal.Dialog>
            <Modal.Header className="flex flex-col items-center gap-2 pt-6 pb-2 text-center px-6">
              <span className="text-4xl">🍔</span>
              <Modal.Heading className="text-lg font-bold">Name Your Creation</Modal.Heading>
              <p className="text-sm text-muted font-normal">Give your burger a legendary name!</p>
            </Modal.Header>

            <Modal.Body className="px-6 pb-2 flex flex-col gap-3">
              {/* Name input */}
              <div className="relative">
                <Pencil
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleConfirm();
                  }}
                  placeholder='e.g. "The Midnight Stack"'
                  maxLength={40}
                  autoFocus
                  className="w-full pl-9 pr-12 py-2.5 text-sm rounded-xl border border-border bg-overlay focus:outline-none focus:ring-2 focus:ring-[var(--accent)] placeholder:text-muted"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted">
                  {name.length}
                  /40
                </span>
              </div>

              {/* Ingredients summary */}
              <div className="bg-surface-secondary rounded-xl p-3">
                <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-2">
                  Your ingredients
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selected.map((ing) => (
                    <span
                      key={ing.id}
                      className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-background border border-border"
                    >
                      {ing.emoji} {ing.name}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                  <span className="text-xs text-muted">Total</span>
                  <span className="text-base font-bold text-[var(--accent)]">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer className="px-6 py-4 flex items-center gap-2">
              <Button variant="ghost" size="sm" className="flex-1" onPress={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="flex-1 bg-[var(--accent)] text-white hover:opacity-90"
                onPress={handleConfirm}
                isDisabled={!name.trim()}
              >
                <ShoppingBag size={14} />
                Add to Cart
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
