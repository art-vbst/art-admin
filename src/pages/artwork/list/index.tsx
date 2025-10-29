import type {
  Artwork,
  ArtworkCategory,
  ArtworkMedium,
  ArtworkStatus,
} from '@art-vbst/art-types';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { usePageData } from '~/hooks/usePageData';
import { formatUSD } from '~/utils/format';
import { ArtEndpoint } from '../api';

type SortField = 'title' | 'created_at';
type SortDirection = 'asc' | 'desc';

export const ArtworkList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    data: artworks,
    loading,
    error,
  } = usePageData(() => ArtEndpoint.list());

  const filteredAndSortedArtworks = useMemo(() => {
    if (!artworks) return [];

    let filtered = artworks;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = artworks.filter((art) =>
        art.title.toLowerCase().includes(term),
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortField === 'title') {
        const comparison = a.title.localeCompare(b.title);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      const aDate = new Date(a.created_at).getTime();
      const bDate = new Date(b.created_at).getTime();
      return sortDirection === 'desc' ? bDate - aDate : aDate - bDate;
    });
  }, [artworks, searchTerm, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'created_at' ? 'desc' : 'asc');
    }
  };

  const artworkColumns = (artwork: Artwork) => [
    { header: 'Title', value: artwork.title },
    { header: 'ID', value: artwork.id.slice(0, 8) },
    { header: 'Number', value: artwork.painting_number ?? '—' },
    { header: 'Year', value: artwork.painting_year ?? '—' },
    {
      header: 'Size (W×H)',
      value: `${artwork.width_inches}×${artwork.height_inches}"`,
    },
    { header: 'Price', value: formatUSD(artwork.price_cents) },
    { header: 'Status', value: artwork.status },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'artworks' }]} />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl text-gray-900">Artworks</h1>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="rounded bg-gray-900 px-4 py-2 font-medium text-sm text-white hover:bg-gray-700"
        >
          Create Artwork
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
          Error loading artworks: {error.message}
        </div>
      )}

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toggleSort('title')}
            className="rounded border border-gray-300 px-3 py-2 font-medium text-sm hover:bg-gray-50"
          >
            Title{' '}
            {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            type="button"
            onClick={() => toggleSort('created_at')}
            className="rounded border border-gray-300 px-3 py-2 font-medium text-sm hover:bg-gray-50"
          >
            Created{' '}
            {sortField === 'created_at' &&
              (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      ) : filteredAndSortedArtworks.length === 0 ? (
        <div className="rounded border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="mb-4 text-gray-600">No artworks found</p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="rounded bg-gray-900 px-4 py-2 font-medium text-sm text-white hover:bg-gray-700"
          >
            Create Artwork
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-gray-200 border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-900">Title</th>
                <th className="px-4 py-3 font-medium text-gray-900">ID</th>
                <th className="px-4 py-3 font-medium text-gray-900">Number</th>
                <th className="px-4 py-3 font-medium text-gray-900">Year</th>
                <th className="px-4 py-3 font-medium text-gray-900">
                  Size (W×H)
                </th>
                <th className="px-4 py-3 font-medium text-gray-900">Price</th>
                <th className="px-4 py-3 font-medium text-gray-900">Status</th>
                <th className="px-4 py-3 font-medium text-gray-900">Medium</th>
                <th className="px-4 py-3 font-medium text-gray-900">
                  Category
                </th>
                <th className="px-4 py-3 font-medium text-gray-900">Sold At</th>
                <th className="px-4 py-3 font-medium text-gray-900">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedArtworks.map((artwork) => (
                <tr
                  key={artwork.id}
                  onClick={() => navigate(`/artworks/${artwork.id}`)}
                  className="cursor-pointer border-gray-200 border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">{artwork.title}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {artwork.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3">
                    {artwork.painting_number ?? '—'}
                  </td>
                  <td className="px-4 py-3">{artwork.painting_year ?? '—'}</td>
                  <td className="px-4 py-3">
                    {artwork.width_inches}×{artwork.height_inches}"
                  </td>
                  <td className="px-4 py-3">
                    {formatUSD(artwork.price_cents)}
                  </td>
                  <td className="px-4 py-3">{artwork.status}</td>
                  <td className="px-4 py-3">{artwork.medium}</td>
                  <td className="px-4 py-3">{artwork.category}</td>
                  <td className="px-4 py-3">
                    {artwork.sold_at
                      ? new Date(artwork.sold_at).toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(artwork.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreateModal && (
        <CreateArtworkModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(id) => {
            setShowCreateModal(false);
            navigate(`/artworks/${id}`);
          }}
        />
      )}
    </div>
  );
};

type CreateArtworkModalProps = {
  onClose: () => void;
  onSuccess: (id: string) => void;
};

const CreateArtworkModal = ({
  onClose,
  onSuccess,
}: CreateArtworkModalProps) => {
  const [title, setTitle] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [priceUSD, setPriceUSD] = useState('');
  const [status, setStatus] = useState<ArtworkStatus>(
    'available' as ArtworkStatus,
  );
  const [medium, setMedium] = useState<ArtworkMedium>(
    'oil_panel' as ArtworkMedium,
  );
  const [category, setCategory] = useState<ArtworkCategory>(
    'figure' as ArtworkCategory,
  );
  const [paintingNumber, setPaintingNumber] = useState('');
  const [paintingYear, setPaintingYear] = useState('');
  const [paper, setPaper] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setSubmitting(true);

      const payload: Partial<Artwork> = {
        title: title.trim(),
        width_inches: width ? Number(width) : 0,
        height_inches: height ? Number(height) : 0,
        price_cents: priceUSD ? Math.round(Number(priceUSD) * 100) : 0,
        status,
        medium,
        category,
        painting_number: paintingNumber ? Number(paintingNumber) : null,
        painting_year: paintingYear ? Number(paintingYear) : null,
        paper: paper || null,
      };

      const response = await ArtEndpoint.create(payload as Artwork);
      onSuccess(response.data.id);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create artwork');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6">
        <h2 className="mb-4 font-bold text-gray-900 text-xl">Create Artwork</h2>

        {error && (
          <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block font-medium text-gray-900 text-sm">
              Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-medium text-gray-900 text-sm">
                Width (inches)
              </label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min="0"
                step="0.01"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-900 text-sm">
                Height (inches)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="0"
                step="0.01"
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-900 text-sm">
              Price (USD)
            </label>
            <input
              type="number"
              value={priceUSD}
              onChange={(e) => setPriceUSD(e.target.value)}
              min="0"
              step="0.01"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium text-gray-900 text-sm">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ArtworkStatus)}
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
            <label className="mb-1 block font-medium text-gray-900 text-sm">
              Medium
            </label>
            <select
              value={medium}
              onChange={(e) => setMedium(e.target.value as ArtworkMedium)}
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
            <label className="mb-1 block font-medium text-gray-900 text-sm">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as ArtworkCategory)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="figure">Figure</option>
              <option value="landscape">Landscape</option>
              <option value="multi_figure">Multi Figure</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block font-medium text-gray-900 text-sm">
                Painting Number
              </label>
              <input
                type="number"
                value={paintingNumber}
                onChange={(e) => setPaintingNumber(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block font-medium text-gray-900 text-sm">
                Painting Year
              </label>
              <input
                type="number"
                value={paintingYear}
                onChange={(e) => setPaintingYear(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 font-medium text-gray-900 text-sm">
              <input
                type="checkbox"
                checked={paper}
                onChange={(e) => setPaper(e.target.checked)}
                className="rounded border-gray-300"
              />
              Paper
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
              {submitting ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
