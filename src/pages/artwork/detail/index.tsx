import type {
  Artwork,
  ArtworkCategory,
  ArtworkMedium,
  ArtworkStatus,
  Image,
} from '@art-vbst/art-types';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { usePageData } from '~/hooks/usePageData';
import { isUuid } from '~/utils/format';
import { ArtEndpoint } from '../api';
import { ImageEndpoint } from '../api/images';

export const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id || !isUuid(id)) {
    navigate('/404');
    return null;
  }

  const {
    data: artwork,
    loading,
    error,
    refetch,
  } = usePageData(() => ArtEndpoint.get(id), [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-6 w-48 animate-pulse rounded bg-gray-200" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
            ))}
          </div>
          <div className="h-96 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded border border-red-200 bg-red-50 p-4 text-red-800">
          Error loading artwork: {error?.message || 'Not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'artworks', href: '/artworks' },
          { label: artwork.title || id },
        ]}
      />

      <h1 className="mb-8 text-3xl font-bold text-gray-900">{artwork.title}</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <ArtworkForm
          artwork={artwork}
          onUpdate={refetch}
          onDelete={() => navigate('/artworks')}
        />
        <ImagesPanel artwork={artwork} onUpdate={refetch} />
      </div>
    </div>
  );
};

type ArtworkFormProps = {
  artwork: Artwork;
  onUpdate: () => void;
  onDelete: () => void;
};

const ArtworkForm = ({ artwork, onUpdate, onDelete }: ArtworkFormProps) => {
  const [formData, setFormData] = useState({
    title: artwork.title,
    painting_number: artwork.painting_number?.toString() || '',
    painting_year: artwork.painting_year?.toString() || '',
    width_inches: artwork.width_inches.toString(),
    height_inches: artwork.height_inches.toString(),
    price_usd: (artwork.price_cents / 100).toString(),
    paper: artwork.paper || false,
    sort_order: artwork.sort_order?.toString() || '',
    sold_at: artwork.sold_at || '',
    status: artwork.status,
    medium: artwork.medium,
    category: artwork.category,
    order_id: artwork.order_id || '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setSubmitting(true);

      const payload: Partial<Artwork> = {
        title: formData.title.trim(),
        painting_number: formData.painting_number
          ? Number(formData.painting_number)
          : null,
        painting_year: formData.painting_year
          ? Number(formData.painting_year)
          : null,
        width_inches: Number(formData.width_inches),
        height_inches: Number(formData.height_inches),
        price_cents: Math.round(Number(formData.price_usd) * 100),
        paper: formData.paper || null,
        sort_order: formData.sort_order ? Number(formData.sort_order) : null,
        sold_at: formData.sold_at || null,
        status: formData.status,
        medium: formData.medium,
        category: formData.category,
        order_id: formData.order_id || null,
      };

      await ArtEndpoint.update(artwork.id, payload, {}, true);
      setSuccess('Artwork updated successfully');
      onUpdate();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update artwork');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await ArtEndpoint.delete(artwork.id);
      onDelete();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete artwork');
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 text-xl font-bold text-gray-900">Artwork Details</h2>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            ID
          </label>
          <input
            type="text"
            value={artwork.id}
            className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            disabled
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Painting Number
            </label>
            <input
              type="number"
              value={formData.painting_number}
              onChange={(e) =>
                setFormData({ ...formData, painting_number: e.target.value })
              }
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Painting Year
            </label>
            <input
              type="number"
              value={formData.painting_year}
              onChange={(e) =>
                setFormData({ ...formData, painting_year: e.target.value })
              }
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Width (inches)
            </label>
            <input
              type="number"
              value={formData.width_inches}
              onChange={(e) =>
                setFormData({ ...formData, width_inches: e.target.value })
              }
              step="0.01"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Height (inches)
            </label>
            <input
              type="number"
              value={formData.height_inches}
              onChange={(e) =>
                setFormData({ ...formData, height_inches: e.target.value })
              }
              step="0.01"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Price (USD)
          </label>
          <input
            type="number"
            value={formData.price_usd}
            onChange={(e) =>
              setFormData({ ...formData, price_usd: e.target.value })
            }
            step="0.01"
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            required
          />
        </div>

        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              checked={formData.paper}
              onChange={(e) =>
                setFormData({ ...formData, paper: e.target.checked })
              }
              className="rounded border-gray-300"
            />
            Paper
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Sort Order
          </label>
          <input
            type="number"
            value={formData.sort_order}
            onChange={(e) =>
              setFormData({ ...formData, sort_order: e.target.value })
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Sold At
          </label>
          <input
            type="datetime-local"
            value={formData.sold_at ? formData.sold_at.slice(0, 16) : ''}
            onChange={(e) =>
              setFormData({ ...formData, sold_at: e.target.value })
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as ArtworkStatus,
              })
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="not_for_sale">Not For Sale</option>
            <option value="unavailable">Unavailable</option>
            <option value="coming_soon">Coming Soon</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Medium
          </label>
          <select
            value={formData.medium}
            onChange={(e) =>
              setFormData({
                ...formData,
                medium: e.target.value as ArtworkMedium,
              })
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="oil_panel">Oil Panel</option>
            <option value="acrylic_panel">Acrylic Panel</option>
            <option value="oil_mdf">Oil MDF</option>
            <option value="oil_paper">Oil Paper</option>
            <option value="unknown">Unknown</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({
                ...formData,
                category: e.target.value as ArtworkCategory,
              })
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="figure">Figure</option>
            <option value="landscape">Landscape</option>
            <option value="multi_figure">Multi Figure</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Created At
          </label>
          <input
            type="text"
            value={new Date(artwork.created_at).toLocaleString()}
            className="w-full rounded border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            disabled
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Order ID
          </label>
          <input
            type="text"
            value={formData.order_id}
            onChange={(e) =>
              setFormData({ ...formData, order_id: e.target.value })
            }
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </form>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-w-md rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              Delete Artwork?
            </h3>
            <p className="mb-6 text-sm text-gray-600">
              Are you sure you want to delete this artwork? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

type ImagesPanelProps = {
  artwork: Artwork;
  onUpdate: () => void;
};

const ImagesPanel = ({ artwork, onUpdate }: ImagesPanelProps) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Images</h2>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          Add Image
        </button>
      </div>

      {artwork.images.length === 0 ? (
        <div className="rounded border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm text-gray-600">No images yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {artwork.images.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group cursor-pointer overflow-hidden rounded border border-gray-200 hover:border-gray-400"
            >
              <div className="aspect-square bg-gray-100">
                <img
                  src={image.image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-2 text-xs text-gray-600">
                {image.is_main_image && (
                  <span className="mr-2 rounded bg-gray-900 px-2 py-1 text-white">
                    Primary
                  </span>
                )}
                {new Date(image.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddImageModal
          artworkId={artwork.id}
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            onUpdate();
          }}
        />
      )}

      {selectedImage && (
        <ImageDetailModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onUpdate={() => {
            setSelectedImage(null);
            onUpdate();
          }}
        />
      )}
    </div>
  );
};

type AddImageModalProps = {
  artworkId: string;
  onClose: () => void;
  onSuccess: () => void;
};

const AddImageModal = ({
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
        <h3 className="mb-4 text-lg font-bold text-gray-900">Add Image</h3>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
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
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
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
              className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
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

type ImageDetailModalProps = {
  image: Image;
  onClose: () => void;
  onUpdate: () => void;
};

const ImageDetailModal = ({
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
        <h3 className="mb-4 text-lg font-bold text-gray-900">Image Details</h3>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
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

        <div className="mb-4 space-y-2 text-sm text-gray-600">
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
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            disabled={submitting}
          >
            {image.is_main_image ? 'Unset Primary' : 'Set as Primary'}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded border border-red-600 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="max-w-md rounded-lg bg-white p-6">
              <h4 className="mb-4 text-lg font-bold text-gray-900">
                Delete Image?
              </h4>
              <p className="mb-6 text-sm text-gray-600">
                Are you sure you want to delete this image? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
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
