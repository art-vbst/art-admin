import type { Artwork, Order } from '@art-vbst/art-types';
import { Link } from 'react-router';
import { usePageData } from '~/hooks/usePageData';
import { ArtEndpoint } from '~/pages/artwork/api';
import { OrderEndpoint } from '~/pages/orders/api';

export const Dashboard = () => {
  const {
    data: orders,
    loading: ordersLoading,
    error: ordersError,
  } = usePageData<Order[]>(() => OrderEndpoint.list());

  const {
    data: artworks,
    loading: artworksLoading,
  } = usePageData<Artwork[]>(() => ArtEndpoint.list());

  const loading = ordersLoading || artworksLoading;
  const totalOrders = orders?.length ?? 0;
  const totalArtworks = artworks?.length ?? 0;
  const activeOrders = totalOrders; // placeholder until backend refines

  return (
    <div>
      <div className="breadcrumb">dashboard</div>

      {ordersError && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {ordersError.message}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard title="Active Orders" value={activeOrders} linkTo="/orders" />
          <StatCard title="Total Orders" value={totalOrders} linkTo="/orders" />
          <StatCard title="Total Artworks" value={totalArtworks} linkTo="/artworks" />
        </div>
      )}
    </div>
  );
};

const StatCard = ({
  title,
  value,
  linkTo,
}: {
  title: string;
  value: number | string;
  linkTo: string;
}) => {
  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
      <Link
        to={linkTo}
        className="rounded-md border px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
      >
        View
      </Link>
    </div>
  );
};
