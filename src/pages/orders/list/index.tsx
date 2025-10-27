import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { usePageData } from '~/hooks/usePageData';
import { formatUSD } from '~/utils/format';
import { OrderEndpoint } from '../api';

type SortField = 'created_at' | 'status';
type SortDirection = 'asc' | 'desc';

export const OrderList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const {
    data: orders,
    loading,
    error,
  } = usePageData(() => OrderEndpoint.list());

  const filteredAndSortedOrders = useMemo(() => {
    if (!orders) return [];

    let filtered = orders;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = orders.filter((order) =>
        order.shippingDetail.email.toLowerCase().includes(term),
      );
    }

    return [...filtered].sort((a, b) => {
      if (sortField === 'status') {
        const comparison = a.status.localeCompare(b.status);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      return sortDirection === 'desc' ? bDate - aDate : aDate - bDate;
    });
  }, [orders, searchTerm, sortField, sortDirection]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'created_at' ? 'desc' : 'asc');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: 'orders' }]} />

      <h1 className="mb-8 font-bold text-3xl text-gray-900">Orders</h1>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-800 text-sm">
          Error loading orders: {error.message}
        </div>
      )}

      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Search by customer email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => toggleSort('created_at')}
            className="rounded border border-gray-300 px-3 py-2 font-medium text-sm hover:bg-gray-50"
          >
            Created{' '}
            {sortField === 'created_at' &&
              (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
          <button
            type="button"
            onClick={() => toggleSort('status')}
            className="rounded border border-gray-300 px-3 py-2 font-medium text-sm hover:bg-gray-50"
          >
            Status{' '}
            {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      ) : filteredAndSortedOrders.length === 0 ? (
        <div className="rounded border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">No orders found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-gray-200 border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-900">ID</th>
                <th className="px-4 py-3 font-medium text-gray-900">Status</th>
                <th className="px-4 py-3 font-medium text-gray-900">
                  Customer Name
                </th>
                <th className="px-4 py-3 font-medium text-gray-900">Email</th>
                <th className="px-4 py-3 font-medium text-gray-900">Total</th>
                <th className="px-4 py-3 font-medium text-gray-900">
                  Payments
                </th>
                <th className="px-4 py-3 font-medium text-gray-900">Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedOrders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/orders/${order.id}`)}
                  className="cursor-pointer border-gray-200 border-b hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-gray-100 px-2 py-1 font-medium text-xs">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{order.shippingDetail.name}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {order.shippingDetail.email}
                  </td>
                  <td className="px-4 py-3">
                    {formatUSD(order.paymentRequirement.totalCents)}
                  </td>
                  <td className="px-4 py-3">{order.payments.length}</td>
                  <td className="px-4 py-3">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
