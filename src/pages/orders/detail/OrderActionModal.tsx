import { useState } from 'react';
import { Button, Input, Modal } from '~/components/ui';

type OrderActionModalProps = {
  title: string;
  description: string;
  open: boolean;
  onConfirm: (trackingLink?: string) => Promise<void>;
  onClose: () => void;
  showTrackingInput?: boolean;
  error?: string | null;
};

export const OrderActionModal = ({
  title,
  description,
  onConfirm,
  onClose,
  open,
  showTrackingInput = false,
  error,
}: OrderActionModalProps) => {
  const [disabled, setDisabled] = useState(false);
  const [trackingLink, setTrackingLink] = useState('');

  const handleClose = () => {
    setDisabled(false);
    setTrackingLink('');
    onClose();
  };

  const handleConfirm = async () => {
    setDisabled(true);
    try {
      await onConfirm(showTrackingInput ? trackingLink : undefined);
      handleClose();
    } catch (err) {
      setDisabled(false);
    }
  };

  return (
    <Modal isOpen={open} onClose={handleClose}>
      <h3 className="mb-4 font-bold text-gray-900 text-lg">{title}</h3>
      <p className="mb-6 text-gray-600 text-sm">{description}</p>

      {showTrackingInput && (
        <div className="mb-6">
          <Input
            label="Tracking Link (optional)"
            value={trackingLink}
            onChange={(e) => setTrackingLink(e.target.value)}
            placeholder="https://..."
            disabled={disabled}
          />
        </div>
      )}

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={handleClose} disabled={disabled}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleConfirm} disabled={disabled}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
};
