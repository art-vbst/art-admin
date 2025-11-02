import type { SortDirection } from '~/hooks/useSort';
import { Button } from './ui';

type SortButtonProps<T extends string> = {
  field: T;
  direction?: SortDirection;
  toggleSort: (field: T) => void;
  currentSortField?: T;
};

export const SortButton = <T extends string>({
  field,
  direction,
  toggleSort,
  currentSortField,
}: SortButtonProps<T>) => {
  const getDirectionArrow = (field: T, direction?: SortDirection) => {
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
};
