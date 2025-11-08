import type { Order } from '@art-vbst/art-types';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { ErrorText } from '~/components/ui';
import { usePageData } from '~/hooks/usePageData';
import { OrderEndpoint } from '../api';
import { OrdersTable } from '../list/OrdersTable';

export const ActiveOrdersList = () => {
  const navigate = useNavigate();

  const { data, loading, error } = usePageData(() =>
    OrderEndpoint.list({ status: 'processing' }),
  );

  const sortedOrders = useMemo(() => {
    if (!data) return [];
    return [...data].sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
    );
  }, [data]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[
          { label: 'orders', href: '/orders' },
          { label: 'active orders' },
        ]}
      />

      <h1 className="mb-8 font-bold text-3xl text-gray-900">Active Orders</h1>

      {error && (
        <ErrorText
          className="mb-4"
          message={`Error loading active orders: ${error.message}`}
        />
      )}

      <ActiveOrdersContent
        orders={sortedOrders}
        loading={loading}
        onTableRowClick={(order) => navigate(`/orders/${order.id}`)}
      />
    </div>
  );
};

const ActiveOrdersContent = ({
  orders,
  loading,
  onTableRowClick,
}: {
  orders: Order[];
  loading: boolean;
  onTableRowClick: (order: Order) => void;
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

  if (orders.length === 0) {
    return (
      <div className="rounded border border-gray-200 bg-gray-50 p-8 text-center">
        <p className="text-gray-600">No active orders</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded border border-gray-200">
      <OrdersTable orders={orders} onRowClick={onTableRowClick} />
    </div>
  );
};
