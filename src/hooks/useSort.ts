import { useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export const useSort = <T extends string>() => {
  const [field, setField] = useState<T>();
  const [direction, setDirection] = useState<SortDirection | undefined>();

  const toggleSort = (newField: T) => {
    if (newField === field) {
      setDirection(direction === 'asc' ? 'desc' : 'asc');
    } else {
      setField(newField);
      setDirection(newField === 'created_at' ? 'desc' : 'asc');
    }
  };

  const clearSort = () => {
    setField(undefined);
    setDirection(undefined);
  };

  return { field, direction, toggleSort, clearSort };
};
