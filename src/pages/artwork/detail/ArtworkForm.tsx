import type {
  Artwork,
  ArtworkCategory,
  ArtworkMedium,
  ArtworkStatus,
} from '@art-vbst/art-types';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { DeleteModal } from '~/components/DeleteModal';
import { Checkbox, Input, Select } from '~/components/ui';
import { useAction } from '~/hooks/useAction';
import { ArtEndpoint } from '../api';

type ArtworkFormData = {
  title: string;
  painting_number: number;
  painting_year: number;
  width_inches: number;
  height_inches: number;
  price_usd: number;
  paper: boolean;
  sort_order: number;
  sold_at: string;
  status: ArtworkStatus;
  medium: ArtworkMedium;
  category: ArtworkCategory;
};

const getInitialFormData = (artwork: Artwork): ArtworkFormData => {
  return {
    title: artwork.title,
    painting_number: artwork.painting_number || 0,
    painting_year: artwork.painting_year || 0,
    width_inches: artwork.width_inches,
    height_inches: artwork.height_inches,
    price_usd: artwork.price_cents / 100,
    paper: artwork.paper || false,
    sort_order: artwork.sort_order || 0,
    sold_at: artwork.sold_at || '',
    status: artwork.status,
    medium: artwork.medium,
    category: artwork.category,
  };
};

type ArtworkFormProps = {
  artwork: Artwork;
  onUpdate: () => void;
  onDelete: () => void;
};

export const ArtworkForm = ({
  artwork,
  onUpdate,
  onDelete,
}: ArtworkFormProps) => {
  const [formData, setFormData] = useState(getInitialFormData(artwork));

  useEffect(() => {
    setFormData(getInitialFormData(artwork));
  }, [artwork]);

  const {
    execute: updateArtwork,
    loading: updateLoading,
    error: updateError,
  } = useAction(() => {
    return ArtEndpoint.update(artwork.id, formData satisfies Partial<Artwork>);
  });

  const { execute: deleteArtwork, error: deleteError } = useAction(() => {
    return ArtEndpoint.delete(artwork.id);
  });

  const error = updateError || deleteError;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateArtwork();
    onUpdate();
  };

  const handleDelete = async () => {
    await deleteArtwork();
    onDelete();
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 font-bold text-gray-900 text-xl">Artwork Details</h2>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
          {error.message}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4">
        <Input
          required
          label="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />

        <Input
          label="Painting Number"
          value={formData.painting_number}
          onChange={(e) => {
            setFormData({
              ...formData,
              painting_number: Number(e.target.value),
            });
          }}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            required
            label="Painting Number"
            value={formData.painting_number}
            onChange={(e) =>
              setFormData({
                ...formData,
                painting_number: Number(e.target.value),
              })
            }
          />
          <Input
            required
            label="Painting Year"
            value={formData.painting_year}
            onChange={(e) =>
              setFormData({
                ...formData,
                painting_year: Number(e.target.value),
              })
            }
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            required
            label="Width (inches)"
            value={formData.width_inches}
            onChange={(e) =>
              setFormData({ ...formData, width_inches: Number(e.target.value) })
            }
          />
          <Input
            required
            label="Height (inches)"
            value={formData.height_inches}
            onChange={(e) =>
              setFormData({
                ...formData,
                height_inches: Number(e.target.value),
              })
            }
          />
        </div>

        <Input
          required
          label="Price (USD)"
          value={formData.price_usd}
          onChange={(e) =>
            setFormData({ ...formData, price_usd: Number(e.target.value) })
          }
        />

        <Checkbox
          label="Paper"
          checked={formData.paper}
          onChange={(e) =>
            setFormData({ ...formData, paper: e.target.checked })
          }
        />

        <Input
          label="Sort Order"
          value={formData.sort_order}
          onChange={(e) =>
            setFormData({ ...formData, sort_order: Number(e.target.value) })
          }
        />

        <Input readOnly label="Sold At" value={formData.sold_at} />

        <Select
          label="Status"
          value={formData.status}
          onChange={(e) =>
            setFormData({
              ...formData,
              status: e.target.value as ArtworkStatus,
            })
          }
          options={[
            { label: 'Available', value: 'available' },
            { label: 'Pending', value: 'pending' },
            { label: 'Sold', value: 'sold' },
            { label: 'Not For Sale', value: 'not_for_sale' },
            { label: 'Unavailable', value: 'unavailable' },
            { label: 'Coming Soon', value: 'coming_soon' },
          ]}
        />

        <Select
          label="Medium"
          value={formData.medium}
          onChange={(e) =>
            setFormData({
              ...formData,
              medium: e.target.value as ArtworkMedium,
            })
          }
          options={[
            { label: 'Oil Panel', value: 'oil_panel' },
            { label: 'Acrylic Panel', value: 'acrylic_panel' },
            { label: 'Oil MDF', value: 'oil_mdf' },
            { label: 'Oil Paper', value: 'oil_paper' },
            { label: 'Unknown', value: 'unknown' },
          ]}
        />

        <Select
          label="Category"
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target.value as ArtworkCategory,
            })
          }
          options={[
            { label: 'Figure', value: 'figure' },
            { label: 'Landscape', value: 'landscape' },
            { label: 'Multi Figure', value: 'multi_figure' },
            { label: 'Other', value: 'other' },
          ]}
        />

        <Input
          label="Created At"
          value={new Date(artwork.created_at).toLocaleString()}
          readOnly
        />

        <Input label="Order ID" value={artwork.order_id ?? ''} readOnly />

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="rounded bg-gray-900 px-4 py-2 font-medium text-sm text-white hover:bg-gray-700 disabled:opacity-50"
            disabled={updateLoading}
          >
            {updateLoading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="rounded border border-red-600 px-4 py-2 font-medium text-red-600 text-sm hover:bg-red-50"
          >
            Delete
          </button>
        </div>
      </form>

      {showDeleteConfirm && (
        <DeleteModal
          title="Delete Artwork?"
          description="Are you sure you want to delete this artwork? This action cannot be undone."
          open={showDeleteConfirm}
          onConfirm={handleDelete}
          onClose={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};
