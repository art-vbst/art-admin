import type { Order } from '@art-vbst/art-types';
import { useCallback, useMemo } from 'react';
import type { SortDirection } from '~/hooks/useSort';
import type { OrdersFilters, OrdersSortField } from './OrdersFilters';

export const useSortedOrders = (
  orders: Order[] | null,
  filters: OrdersFilters,
) => {
  const filterOrders = useCallback((orders: Order[], searchTerm: string) => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((order) =>
      order.shipping_detail.email.toLowerCase().includes(term),
    );
  }, []);

  const sortOrders = useCallback(
    (orders: Order[], field?: OrdersSortField, direction?: SortDirection) => {
      switch (field) {
        case 'status':
          return orders.sort((a, b) => {
            const comparison = a.status.localeCompare(b.status);
            return direction === 'asc' ? comparison : -comparison;
          });
        case 'created_at':
          return orders.sort((a, b) => {
            const aDate = new Date(a.created_at).getTime();
            const bDate = new Date(b.created_at).getTime();
            return direction === 'asc' ? aDate - bDate : bDate - aDate;
          });
        default:
          return orders;
      }
    },
    [],
  );

  const processedOrders = useMemo(() => {
    if (!orders) return [];
    const filtered = filterOrders(orders, filters.searchTerm);
    return sortOrders(filtered, filters.sortField, filters.sortDirection);
  }, [orders, filters, filterOrders, sortOrders]);

  return processedOrders;
};
