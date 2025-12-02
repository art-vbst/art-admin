import type { Artwork } from '@art-vbst/art-types';
import { useState } from 'react';
import { Form, type FormRenderProps } from 'react-final-form';
import { ConfirmModal } from '~/components/DeleteModal';
import { errorToast, successToast } from '~/components/toast';
import {
  Button,
  CheckboxField,
  InputField,
  SelectField,
  TextareaField,
} from '~/components/ui';
import { useAction } from '~/hooks/useAction';
import { ArtEndpoint } from '../api';

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { execute: updateArtwork, error: updateError } = useAction(
    (values: Partial<Artwork>) => ArtEndpoint.update(artwork.id, values),
  );

  const { execute: deleteArtwork, error: deleteError } = useAction(() =>
    ArtEndpoint.delete(artwork.id),
  );

  const error = updateError || deleteError;

  const handleSubmit = async (values: Partial<Artwork>) => {
    try {
      await updateArtwork(values);
      successToast('Artwork updated');
      onUpdate();
    } catch {
      errorToast('Failed to update artwork');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteArtwork();
      successToast('Artwork deleted');
      onDelete();
    } catch {
      errorToast('Failed to delete artwork');
    }
  };

  const formRenderer = ({
    handleSubmit,
    submitting,
  }: FormRenderProps<Partial<Artwork>>) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField label="Title" name="title" />
      <TextareaField label="Description" name="description" rows={4} />
      <div className="grid grid-cols-2 gap-4">
        <InputField
          type="number"
          label="Painting Number"
          name="painting_number"
        />
        <InputField type="number" label="Painting Year" name="painting_year" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <InputField type="number" label="Width (inches)" name="width_inches" />
        <InputField
          type="number"
          label="Height (inches)"
          name="height_inches"
        />
      </div>
      <InputField type="number" label="Price (cents)" name="price_cents" />
      <CheckboxField label="Paper" name="paper" />
      <InputField type="number" label="Sort Order" name="sort_order" />
      <InputField disabled label="Sold At" name="sold_at" />
      <SelectField
        label="Status"
        name="status"
        options={[
          { label: 'Available', value: 'available' },
          { label: 'Pending', value: 'pending' },
          { label: 'Sold', value: 'sold' },
          { label: 'Not For Sale', value: 'not_for_sale' },
          { label: 'Unavailable', value: 'unavailable' },
          { label: 'Coming Soon', value: 'coming_soon' },
        ]}
      />
      <SelectField
        label="Medium"
        name="medium"
        options={[
          { label: 'Oil on Panel', value: 'oil_on_panel' },
          { label: 'Acrylic on Panel', value: 'acrylic_on_panel' },
          { label: 'Oil on MDF', value: 'oil_on_mdf' },
          { label: 'Oil on Oil Paper', value: 'oil_on_oil_paper' },
          { label: 'Clay Sculpture', value: 'clay_sculpture' },
          { label: 'Plaster Sculpture', value: 'plaster_sculpture' },
          { label: 'Ink on Paper', value: 'ink_on_paper' },
          { label: 'Mixed Media on Paper', value: 'mixed_media_on_paper' },
          { label: 'Unknown', value: 'unknown' },
        ]}
      />
      <SelectField
        label="Category"
        name="category"
        options={[
          { label: 'Figure', value: 'figure' },
          { label: 'Landscape', value: 'landscape' },
          { label: 'Multi Figure', value: 'multi_figure' },
          { label: 'Other', value: 'other' },
        ]}
      />
      <InputField disabled label="Created At" name="created_at" />
      <InputField disabled label="Order ID" name="order_id" />
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save'}
        </Button>
        <Button variant="danger" onClick={() => setShowDeleteConfirm(true)}>
          Delete
        </Button>
      </div>
    </form>
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 font-bold text-gray-900 text-xl">Artwork Details</h2>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
          {error.message}
        </div>
      )}

      <Form<Partial<Artwork>>
        onSubmit={handleSubmit}
        initialValues={artwork}
        render={formRenderer}
      />

      {showDeleteConfirm && (
        <ConfirmModal
          danger
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
