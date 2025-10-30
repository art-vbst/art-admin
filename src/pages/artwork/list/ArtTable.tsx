import type { Artwork } from '@art-vbst/art-types';
import { processColumns, Table } from '~/components/ui';
import { formatUSD } from '~/utils/format';

export const ArtTable = ({
  artworks,
  onRowClick,
}: {
  artworks: Artwork[];
  onRowClick: (artwork: Artwork) => void;
}) => {
  const { headers, render } = processColumns<Artwork>([
    {
      header: 'Title',
      cell: (artwork) => ({
        children: artwork.title,
        className: 'font-medium',
      }),
    },
    {
      header: 'ID',
      cell: (artwork) => ({
        children: `${artwork.id.slice(0, 8)}...`,
        className: 'text-gray-600',
      }),
    },
    {
      header: 'Number',
      cell: (artwork) => ({ children: artwork.painting_number ?? '—' }),
    },
    {
      header: 'Year',
      cell: (artwork) => ({ children: artwork.painting_year ?? '—' }),
    },
    {
      header: 'Size (W×H)',
      cell: (artwork) => ({
        children: `${artwork.width_inches}×${artwork.height_inches}"`,
      }),
    },
    {
      header: 'Price',
      cell: (artwork) => ({ children: formatUSD(artwork.price_cents) }),
    },
    { header: 'Status', cell: (artwork) => ({ children: artwork.status }) },
    { header: 'Medium', cell: (artwork) => ({ children: artwork.medium }) },
    { header: 'Category', cell: (artwork) => ({ children: artwork.category }) },
    {
      header: 'Sold At',
      cell: (artwork) => ({
        children: artwork.sold_at
          ? new Date(artwork.sold_at).toLocaleString()
          : '—',
      }),
    },
    {
      header: 'Created',
      cell: (artwork) => ({
        children: new Date(artwork.created_at).toLocaleString(),
      }),
    },
  ]);

  return (
    <Table
      data={artworks}
      headers={headers}
      render={render}
      onRowClick={onRowClick}
    />
  );
};
