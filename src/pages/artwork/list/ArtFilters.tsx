import { useEffect, useState } from 'react';
import { Button } from '~/components/ui';
import { type SortDirection, useSort } from '~/hooks/useSort';
import { cn } from '~/utils/format';

type SortField = 'title' | 'created_at';

type ArtFiltersProps = {
  className?: string;
  onFilterChange: (filters: ArtFilters) => void;
};

export type ArtFilters = {
  searchTerm: string;
  sortField?: SortField;
  sortDirection?: SortDirection;
};

export const ArtFilters = ({ className, onFilterChange }: ArtFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { field, direction, toggleSort } = useSort<SortField>();

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
        placeholder="Search by title..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
      />
      <div className="flex gap-2">
        <SortButton
          field="title"
          direction={direction}
          toggleSort={toggleSort}
          currentSortField={field}
        />
        <SortButton
          field="created_at"
          direction={direction}
          toggleSort={toggleSort}
          currentSortField={field}
        />
      </div>
    </div>
  );
};

function SortButton({
  field,
  direction,
  toggleSort,
  currentSortField,
}: {
  field: SortField;
  direction?: SortDirection;
  toggleSort: (field: SortField) => void;
  currentSortField?: SortField;
}) {
  const getDirectionArrow = (field: SortField, direction?: SortDirection) => {
    if (field !== currentSortField) {
      return null;
    }
    return direction === 'asc' ? '↑' : '↓';
  };

  return (
    <Button onClick={() => toggleSort(field)} variant="secondary">
      {field} {getDirectionArrow(field, direction)}
    </Button>
  );
}
