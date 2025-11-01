import type { Artwork } from '@art-vbst/art-types';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { Button, ErrorText } from '~/components/ui';
import { usePageData } from '~/hooks/usePageData';
import { ArtEndpoint } from '../api';
import { ArtFilters } from './ArtFilters';
import { ArtTable } from './ArtTable';
import { CreateArtworkModal } from './CreateArtworkModal';
import { useSortedArtworks } from './useSortedArtworks';

export const ArtworkList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ArtFilters>({ searchTerm: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);

  const { data, loading, error, refetch } = usePageData(() =>
    ArtEndpoint.list(),
  );
  const artworks = useSortedArtworks(data, filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'artworks' }]} />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl text-gray-900">Artworks</h1>
        <Button onClick={() => setShowCreateModal(true)}>Create Artwork</Button>
      </div>

      {error && (
        <ErrorText
          className="mb-4"
          message={`Error loading artworks: ${error.message}`}
        />
      )}

      <ArtFilters className="mb-4" onFilterChange={setFilters} />

      <ArtBody
        loading={loading}
        artworks={artworks}
        emptyActionNode={
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="rounded bg-gray-900 px-4 py-2 font-medium text-sm text-white hover:bg-gray-700"
          >
            Create Artwork
          </button>
        }
        onTableRowClick={(artwork) => navigate(`/artworks/${artwork.id}`)}
      />

      {showCreateModal && (
        <CreateArtworkModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={refetch}
        />
      )}
    </div>
  );
};

const ArtBody = ({
  loading,
  artworks,
  emptyActionNode,
  onTableRowClick,
}: {
  loading: boolean;
  artworks: Artwork[];
  emptyActionNode?: React.ReactNode;
  onTableRowClick: (artwork: Artwork) => void;
}) => {
  if (loading) {
    return (
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
        ))}
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className="rounded border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="mb-4 text-gray-600">No artworks found</p>
        {emptyActionNode && emptyActionNode}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-gray-200">
      <ArtTable artworks={artworks} onRowClick={onTableRowClick} />
    </div>
  );
};
