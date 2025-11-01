import {
  type Artwork,
  ArtworkCategory,
  ArtworkMedium,
  ArtworkStatus,
} from '@art-vbst/art-types';
import { Form, type FormRenderProps } from 'react-final-form';
import { errorToast, successToast } from '~/components/toast';
import {
  Button,
  CheckboxField,
  InputField,
  Modal,
  SelectField,
} from '~/components/ui';
import { useAction } from '~/hooks/useAction';
import { ArtEndpoint } from '../api';

type CreateArtworkModalProps = {
  onClose: () => void;
  onSuccess: () => void;
};

const initialFormValues: Partial<Artwork> = {
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

export const CreateArtworkModal = ({
  onClose,
  onSuccess,
}: CreateArtworkModalProps) => {
  const { execute: create } = useAction((values: Partial<Artwork>) =>
    ArtEndpoint.create(values),
  );

  const handleSubmit = async (values: Partial<Artwork>) => {
    const response = await create(values);

    if (!response) {
      errorToast('Failed to create artwork');
      return;
    }

    successToast('Artwork created', `/artworks/${response.id}`);
    onSuccess();
    onClose();
  };

  const formRenderer = ({
    handleSubmit,
    submitting,
    form,
  }: FormRenderProps<Partial<Artwork>>) => (
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
        <InputField type="number" label="Painting Year" name="painting_year" />
      </div>
      <CheckboxField label="Paper" name="paper" />
      <div className="space-x-2">
        <Button
          onClick={() => {
            form.restart();
            onClose();
          }}
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

  return (
    <Modal onClose={onClose}>
      <Form<Partial<Artwork>>
        onSubmit={handleSubmit}
        initialValues={initialFormValues}
        render={formRenderer}
      />
    </Modal>
  );
};
