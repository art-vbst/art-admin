import { Form, type FormRenderProps } from 'react-final-form';
import { errorToast } from '~/components/toast';
import { Button, CheckboxField, FileInput, Modal } from '~/components/ui';
import { useAction } from '~/hooks/useAction';
import { getImageEndpoint } from '../api/images';

type AddImageModalProps = {
  artworkId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type ImageForm = {
  image: File | null;
  is_main_image: boolean;
};

const initialFormValues: ImageForm = {
  image: null,
  is_main_image: false,
};

export const AddImageModal = ({
  artworkId,
  isOpen,
  onClose,
  onSuccess,
}: AddImageModalProps) => {
  const { execute, error } = useAction((formData: FormData) =>
    getImageEndpoint(artworkId).create(formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  );

  const handleSubmit = async (values: ImageForm) => {
    if (!values.image) {
      errorToast('Image is required');
      return;
    }

    const formData = new FormData();
    formData.append('image', values.image);
    formData.append('is_main_image', values.is_main_image.toString());

    return await execute(formData)
      .then(onSuccess)
      .catch(() => errorToast('Failed to create image'));
  };

  const formRenderer = ({
    handleSubmit,
    submitting,
    form,
  }: FormRenderProps<ImageForm>) => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FileInput name="image" label="Image File" required />
      <CheckboxField label="Set as primary image" name="is_main_image" />
      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="secondary"
          onClick={() => {
            form.restart();
            onClose();
          }}
          disabled={submitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </form>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="mb-4 font-bold text-gray-900 text-lg">Add Image</h3>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
          {error?.message}
        </div>
      )}

      <Form<ImageForm>
        onSubmit={handleSubmit}
        initialValues={initialFormValues}
        render={formRenderer}
      />
    </Modal>
  );
};
