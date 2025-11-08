import type { Artwork, Order } from '@art-vbst/art-types';
import { Link } from 'react-router';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { usePageData } from '~/hooks/usePageData';
import { ArtEndpoint } from '~/pages/artwork/api';
import { OrderEndpoint } from '~/pages/orders/api';

export const Dashboard = () => {
  const { data: orders, loading: ordersLoading } = usePageData(() =>
    OrderEndpoint.list(),
  );
  const { data: activeOrders, loading: activeOrdersLoading } = usePageData(() =>
    OrderEndpoint.list({ status: 'processing' }),
  );
  const { data: artworks, loading: artworksLoading } = usePageData(() =>
    ArtEndpoint.list(),
  );

  const loading = ordersLoading || activeOrdersLoading || artworksLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'dashboard' }]} />
      <h1 className="mb-8 font-bold text-3xl text-gray-900">Dashboard</h1>
      <DashboardContent
        orders={orders}
        activeOrders={activeOrders}
        artworks={artworks}
        loading={loading}
      />
    </div>
  );
};

const DashboardContent = ({
  orders,
  activeOrders,
  artworks,
  loading,
}: {
  orders: Order[] | null;
  activeOrders: Order[] | null;
  artworks: Artwork[] | null;
  loading: boolean;
}) => {
  const activeOrderCount = activeOrders?.length ?? 0;
  const hasActiveOrders = activeOrderCount > 0;

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-16 animate-pulse rounded-lg bg-gray-200" />
        <div className="grid grid-cols-2 gap-6">
          <div className="h-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Active Orders Section */}
      {hasActiveOrders ? (
        <div className="rounded-lg border border-blue-400 bg-blue-50/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="mb-2 font-semibold text-base text-gray-700">
                Active Orders
              </h2>
              <p className="font-bold text-4xl text-blue-600">
                {activeOrderCount}
              </p>
              <p className="mt-2 text-gray-600 text-sm">
                {activeOrderCount === 1
                  ? '1 order needs attention'
                  : `${activeOrderCount} orders need attention`}
              </p>
            </div>
            <Link
              to="/orders/active"
              className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-sm text-white transition-colors hover:bg-blue-700"
            >
              View Active Orders →
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 p-2">
              <svg
                className="h-5 w-5 text-green-600"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-sm">
              No active orders at the moment
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-6">
        <DashboardCard
          title="Total Orders"
          value={orders?.length ?? 0}
          link="/orders"
          linkText="View Orders"
        />
        <DashboardCard
          title="Total Artworks"
          value={artworks?.length ?? 0}
          link="/artworks"
          linkText="View Artworks"
        />
      </div>
    </div>
  );
};

const DashboardCard = ({
  title,
  value,
  link,
  linkText,
}: {
  title: string;
  value: number;
  link: string;
  linkText: string;
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-2 font-medium text-gray-600 text-sm">{title}</h3>
      <p className="mb-4 font-bold text-3xl text-gray-900">{value}</p>
      <Link
        to={link}
        className="inline-block font-medium text-gray-900 text-sm hover:text-gray-600"
      >
        {linkText} →
      </Link>
    </div>
  );
};
