import type { Order } from '@art-vbst/art-types';
import { processColumns, Table } from '~/components/ui';
import { formatUSD } from '~/utils/format';

type OrdersTableProps = {
  orders: Order[];
  onRowClick: (order: Order) => void;
};

export const OrdersTable = ({ orders, onRowClick }: OrdersTableProps) => {
  const { headers, render } = processColumns<Order>([
    {
      header: 'ID',
      cell: (order) => ({
        children: `${order.id.slice(0, 8)}...`,
        className: 'font-medium',
      }),
    },
    {
      header: 'Status',
      cell: (order) => ({
        children: (
          <span className="rounded bg-gray-100 px-2 py-1 font-medium text-xs">
            {order.status}
          </span>
        ),
      }),
    },
    {
      header: 'Customer Name',
      cell: (order) => ({ children: order.shipping_detail?.name }),
    },
    {
      header: 'Email',
      cell: (order) => ({
        children: order.shipping_detail?.email,
        className: 'text-gray-600',
      }),
    },
    {
      header: 'Total',
      cell: (order) => ({
        children: formatUSD(order.payment_requirement?.total_cents),
      }),
    },
    {
      header: 'Payments',
      cell: (order) => ({ children: order.payments?.length ?? 0 }),
    },
    {
      header: 'Created',
      cell: (order) => ({
        children: new Date(order.created_at).toLocaleString(),
      }),
    },
  ]);

  return (
    <Table
      data={orders}
      headers={headers}
      render={render}
      onRowClick={onRowClick}
    />
  );
};
