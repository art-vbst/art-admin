import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { usePageData } from '~/hooks/usePageData';
import { ArtEndpoint } from '../api';
import { ArtworkForm } from './ArtworkForm';
import { ImagesPanel } from './ImagesPanel';

const DetailParams = z.object({
  id: z.uuid(),
});

type DetailParams = z.infer<typeof DetailParams>;

export const ArtworkDetail = () => {
  const params = useParams<DetailParams>();
  const navigate = useNavigate();

  const { success, data } = DetailParams.safeParse(params);

  if (!success) {
    navigate('/404');
    return null;
  }

  return <ArtworkDetailContent id={data.id} />;
};

const ArtworkDetailContent = ({ id }: { id: string }) => {
  const navigate = useNavigate();

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
              <div
                key={i.toString()}
                className="h-12 animate-pulse rounded bg-gray-200"
              />
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

      <h1 className="mb-8 font-bold text-3xl text-gray-900">{artwork.title}</h1>

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
