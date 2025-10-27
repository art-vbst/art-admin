import { Link } from 'react-router';
import { ArtEndpoint } from '~/pages/artwork/api';
import { OrderEndpoint } from '~/pages/orders/api';
import { usePageData } from '~/hooks/usePageData';

export const Dashboard = () => {
  const {
    data: orders,
    loading: loadingOrders,
    error: ordersError,
  } = usePageData(OrderEndpoint.list.bind(OrderEndpoint));
  const {
    data: artworks,
    loading: loadingArtworks,
    error: artworksError,
  } = usePageData(ArtEndpoint.list.bind(ArtEndpoint));

  const isLoading = loadingOrders || loadingArtworks;
  const cards = [
    {
      label: 'Active Orders',
      value: orders?.length ?? 0,
      to: '/orders',
    },
    {
      label: 'Total Orders',
      value: orders?.length ?? 0,
      to: '/orders',
    },
    {
      label: 'Total Artworks',
      value: artworks?.length ?? 0,
      to: '/artworks',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">dashboard</div>

      {(ordersError || artworksError) && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-red-700">
          {(ordersError || artworksError)?.message ?? 'Failed to load data'}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div
              key={idx}
              className="h-28 animate-pulse rounded border bg-gray-50"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <div key={card.label} className="rounded border p-4">
              <div className="text-gray-500">{card.label}</div>
              <div className="mb-4 text-3xl font-semibold">{card.value}</div>
              <Link
                to={card.to}
                className="inline-block rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-black"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
