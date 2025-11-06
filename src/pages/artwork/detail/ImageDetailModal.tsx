import type { Image } from '@art-vbst/art-types';
import { useState } from 'react';
import { ConfirmModal } from '~/components/DeleteModal';
import { errorToast, successToast } from '~/components/toast';
import { Button, Modal } from '~/components/ui';
import { useAction } from '~/hooks/useAction';
import { getImageEndpoint } from '../api/images';

type ImageDetailModalProps = {
  image: Image;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
};

export const ImageDetailModal = ({
  image,
  isOpen,
  onClose,
  onUpdate,
}: ImageDetailModalProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    execute: updateImage,
    error: updateError,
    loading: updateLoading,
  } = useAction((values: { is_main_image: string }) =>
    getImageEndpoint(image.artwork_id).update(image.id, values),
  );

  const {
    execute: deleteImage,
    error: deleteError,
    loading: deleteLoading,
  } = useAction(() => getImageEndpoint(image.artwork_id).delete(image.id));

  const error = updateError || deleteError;
  const loading = updateLoading || deleteLoading;

  const togglePrimary = async () => {
    try {
      await updateImage({ is_main_image: (!image.is_main_image).toString() });
      successToast('Image updated');
      onUpdate();
    } catch {
      errorToast('Failed to update image');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteImage();
      successToast('Image deleted');
      onUpdate();
    } catch {
      errorToast('Failed to delete image');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="mb-4 font-bold text-gray-900 text-lg">Image Details</h3>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
          {error?.message}
        </div>
      )}

      <div className="mb-4 overflow-hidden rounded border border-gray-200">
        <img
          src={image.image_url}
          alt=""
          className="max-h-96 w-full object-contain"
        />
      </div>

      <div className="mb-4 space-y-2 text-gray-600 text-sm">
        <p>
          <strong>Created:</strong>{' '}
          {new Date(image.created_at).toLocaleString()}
        </p>
        {image.image_width && image.image_height && (
          <p>
            <strong>Dimensions:</strong> {image.image_width} ×{' '}
            {image.image_height}
          </p>
        )}
        <p>
          <strong>Primary:</strong> {image.is_main_image ? 'Yes' : 'No'}
        </p>
      </div>

      <div className="flex justify-between">
        <Button onClick={onClose} disabled={loading} variant="secondary">
          Close
        </Button>
        <div className="flex gap-3">
          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={loading}
          >
            Delete
          </Button>
          <Button onClick={togglePrimary} disabled={loading}>
            {image.is_main_image ? 'Unset Primary' : 'Set as Primary'}
          </Button>
        </div>
      </div>

      <ConfirmModal
        danger
        title="Delete Image?"
        description="Are you sure you want to delete this image? This action cannot be undone."
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />
    </Modal>
  );
};
