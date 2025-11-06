import { useState } from 'react';
import { Button, Modal } from './ui';

type DeleteModalProps = {
  title: string;
  description: string;
  open: boolean;
  danger?: boolean;
  onConfirm: () => unknown | Promise<unknown>;
  onClose: () => void;
};

export const ConfirmModal = ({
  title,
  description,
  onConfirm,
  onClose,
  open,
  danger = false,
}: DeleteModalProps) => {
  const [disabled, setDisabled] = useState(false);

  const handleClose = () => {
    setDisabled(false);
    onClose();
  };

  const handleConfirm = async () => {
    setDisabled(true);
    await onConfirm();
    handleClose();
  };

  return (
    <Modal isOpen={open} onClose={handleClose}>
      <h3 className="mb-4 font-bold text-gray-900 text-lg">{title}</h3>
      <p className="mb-6 text-gray-600 text-sm">{description}</p>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={handleClose} disabled={disabled}>
          Cancel
        </Button>
        <Button
          variant={danger ? 'danger' : 'primary'}
          onClick={handleConfirm}
          disabled={disabled}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
