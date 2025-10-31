import {
  type Artwork,
  ArtworkCategory,
  ArtworkMedium,
  ArtworkStatus,
} from '@art-vbst/art-types';
import { Form, type FormRenderProps } from 'react-final-form';
import {
  Button,
  CheckboxField,
  InputField,
  Modal,
  SelectField,
} from '~/components/ui';
import { ArtEndpoint } from '../api';

type CreateArtworkModalProps = {
  onClose: () => void;
  onSuccess: (id: string) => void;
};

export const CreateArtworkModal = ({
  onClose,
  onSuccess,
}: CreateArtworkModalProps) => {
  const handleSubmit = async (values: Partial<Artwork>) => {
    console.log(values);
    const response = await ArtEndpoint.create(values);
    console.log(response);
  };

  const handleCancel = () => {
    onClose();
  };

  const initialValues: Partial<Artwork> = {
    title: '',
    painting_number: null,
    painting_year: null,
    width_inches: 0,
    height_inches: 0,
    price_cents: 0,
    paper: false,
    status: ArtworkStatus.Available,
    medium: ArtworkMedium.OilPanel,
    category: ArtworkCategory.Figure,
  };

  const formRenderer = ({
    handleSubmit,
    submitting,
  }: FormRenderProps<Partial<Artwork>>) => {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField label="Title" name="title" />
        <div className="grid grid-cols-2 gap-4">
          <InputField type="number" label="Width" name="width_inches" />
          <InputField type="number" label="Height" name="height_inches" />
        </div>
        <InputField type="number" label="Price (cents)" name="price_cents" />
        <SelectField
          label="Status"
          name="status"
          options={Object.values(ArtworkStatus).map((status) => ({
            label: status,
            value: status,
          }))}
        />
        <SelectField
          label="Medium"
          name="medium"
          options={Object.values(ArtworkMedium).map((medium) => ({
            label: medium,
            value: medium,
          }))}
        />
        <SelectField
          label="Category"
          name="category"
          options={Object.values(ArtworkCategory).map((category) => ({
            label: category,
            value: category,
          }))}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            type="number"
            label="Painting Number"
            name="painting_number"
          />
          <InputField
            type="number"
            label="Painting Year"
            name="painting_year"
          />
        </div>
        <CheckboxField label="Paper" name="paper" />
        <div className="space-x-2">
          <Button
            onClick={handleCancel}
            disabled={submitting}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={submitting}>
            Create
          </Button>
        </div>
      </form>
    );
  };

  return (
    <Modal onClose={onClose}>
      <Form<Partial<Artwork>>
        onSubmit={handleSubmit}
        initialValues={initialValues}
        render={formRenderer}
      />
    </Modal>
  );
};
