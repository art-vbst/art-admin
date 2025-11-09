import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SortButton } from '~/components/SortButton';
import { Button } from '~/components/ui';
import { type SortDirection, useSort } from '~/hooks/useSort';
import { cn } from '~/utils/format';
import type { ArtSortField } from './useSortedArtworks';

type ArtFiltersProps = {
  className?: string;
  onFilterChange: (filters: ArtFilters) => void;
};

export type ArtFilters = {
  searchTerm: string;
  sortField?: ArtSortField;
  sortDirection?: SortDirection;
};

export const ArtFilters = ({ className, onFilterChange }: ArtFiltersProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { field, direction, toggleSort, clearSort } = useSort<ArtSortField>();

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
      <div className="flex items-center gap-2">
        <ArtSortButton
          field="title"
          direction={direction}
          toggleSort={toggleSort}
          currentSortField={field}
        />
        <ArtSortButton
          field="status"
          direction={direction}
          toggleSort={toggleSort}
          currentSortField={field}
        />
        <ArtSortButton
          field="created_at"
          direction={direction}
          toggleSort={toggleSort}
          currentSortField={field}
        />
        {field && (
          <Button
            variant="secondary"
            onClick={clearSort}
            className="flex h-[38px] items-center justify-center px-3"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

const ArtSortButton = SortButton<ArtSortField>;
