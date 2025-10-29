import type { Image } from '@art-vbst/art-types';
import { useState } from 'react';
import { ImageEndpoint } from '../api/images';

type ImageDetailModalProps = {
  image: Image;
  onClose: () => void;
  onUpdate: () => void;
};

export const ImageDetailModal = ({
  image,
  onClose,
  onUpdate,
}: ImageDetailModalProps) => {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const togglePrimary = async () => {
    try {
      setSubmitting(true);
      setError('');

      await ImageEndpoint.update(image.id, {
        is_main_image: !image.is_main_image,
      } as Partial<Image>);

      onUpdate();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update image');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await ImageEndpoint.delete(image.id);
      onUpdate();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-2xl rounded-lg bg-white p-6">
        <h3 className="mb-4 font-bold text-gray-900 text-lg">Image Details</h3>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
            {error}
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

        <div className="flex gap-3">
          <button
            type="button"
            onClick={togglePrimary}
            className="rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50"
            disabled={submitting}
          >
            {image.is_main_image ? 'Unset Primary' : 'Set as Primary'}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded border border-red-600 px-4 py-2 font-medium text-red-600 text-sm hover:bg-red-50"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-w-md rounded-lg bg-white p-6">
              <h4 className="mb-4 font-bold text-gray-900 text-lg">
                Delete Image?
              </h4>
              <p className="mb-6 text-gray-600 text-sm">
                Are you sure you want to delete this image? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded bg-red-600 px-4 py-2 font-medium text-sm text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
