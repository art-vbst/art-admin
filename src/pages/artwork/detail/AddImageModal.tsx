import type { Image } from '@art-vbst/art-types';
import { useState } from 'react';
import { ImageEndpoint } from '../api/images';

type AddImageModalProps = {
  artworkId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export const AddImageModal = ({
  artworkId,
  onClose,
  onSuccess,
}: AddImageModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isMainImage, setIsMainImage] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('artwork_id', artworkId);
      formData.append('is_main_image', isMainImage.toString());

      await ImageEndpoint.create(formData as unknown as Image, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-w-md rounded-lg bg-white p-6">
        <h3 className="mb-4 font-bold text-gray-900 text-lg">Add Image</h3>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-medium text-gray-700 text-sm">
              Image File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 font-medium text-gray-700 text-sm">
              <input
                type="checkbox"
                checked={isMainImage}
                onChange={(e) => setIsMainImage(e.target.checked)}
                className="rounded border-gray-300"
              />
              Set as primary image
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border border-gray-300 px-4 py-2 font-medium text-gray-700 text-sm hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-gray-900 px-4 py-2 font-medium text-sm text-white hover:bg-gray-700 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
