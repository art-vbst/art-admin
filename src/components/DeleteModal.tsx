import { useState } from 'react';

type DeleteModalProps = {
  title: string;
  description: string;
  open: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
};

export const DeleteModal = ({
  title,
  description,
  onConfirm,
  onClose,
  open,
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

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={handleClose}
    >
      <div
        className="max-w-md rounded-lg bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 font-bold text-gray-900 text-lg">{title}</h3>
        <p className="mb-6 text-gray-600 text-sm">{description}</p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={disabled}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="rounded bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700 disabled:opacity-50"
            disabled={disabled}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
