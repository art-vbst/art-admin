import { Link } from 'react-router';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { usePageData } from '~/hooks/usePageData';
import { ArtEndpoint } from '~/pages/artwork/api';
import { OrderEndpoint } from '~/pages/orders/api';

export const Dashboard = () => {
  const { data: orders, loading: ordersLoading } = usePageData(() =>
    OrderEndpoint.list(),
  );
  const { data: artworks, loading: artworksLoading } = usePageData(() =>
    ArtEndpoint.list(),
  );

  const loading = ordersLoading || artworksLoading;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'dashboard' }]} />

      <h1 className="mb-8 font-bold text-3xl text-gray-900">Dashboard</h1>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Active Orders"
            value={orders?.length ?? 0}
            link="/orders"
            linkText="View Orders"
          />
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
      )}
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
