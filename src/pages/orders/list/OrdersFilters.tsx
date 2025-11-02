import { useEffect, useState } from 'react';
import { SortButton } from '~/components/SortButton';
import { type SortDirection, useSort } from '~/hooks/useSort';
import { cn } from '~/utils/format';

export type OrdersSortField = 'created_at' | 'status';

export type OrdersFilters = {
  searchTerm: string;
  sortField?: OrdersSortField;
  sortDirection?: SortDirection;
};

type OrdersFiltersProps = {
  className?: string;
  onFilterChange: (filters: OrdersFilters) => void;
};

export const OrdersFilters = ({
  className,
  onFilterChange,
}: OrdersFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { field, direction, toggleSort } = useSort<OrdersSortField>();

  useEffect(() => {
    onFilterChange({
      searchTerm,
      sortField: field,
      sortDirection: direction,
    });
  }, [searchTerm, field, direction, onFilterChange]);

  return (
    <div className={cn('flex gap-4', className)}>
      <input
        type="text"
        placeholder="Search by customer email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <OrdersSortButton
          field="status"
          direction={direction}
          toggleSort={toggleSort}
          currentSortField={field}
        />
        <OrdersSortButton
          field="created_at"
          direction={direction}
          toggleSort={toggleSort}
          currentSortField={field}
        />
      </div>
    </div>
  );
};

const OrdersSortButton = SortButton<OrdersSortField>;
