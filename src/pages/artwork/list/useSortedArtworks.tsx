import type { Artwork } from '@art-vbst/art-types';
import { useCallback, useMemo } from 'react';
import type { SortDirection } from '~/hooks/useSort';
import type { ArtFilters, ArtSortField } from './ArtFilters';

export const useSortedArtworks = (
  artworks: Artwork[] | null,
  filters: ArtFilters,
) => {
  const filterArtworks = useCallback(
    (artworks: Artwork[], searchTerm: string) => {
      if (!searchTerm.trim()) return artworks;
      const term = searchTerm.toLowerCase();
      return artworks.filter((art) => art.title.toLowerCase().includes(term));
    },
    [],
  );

  const sortArtworks = useCallback(
    (artworks: Artwork[], field?: ArtSortField, direction?: SortDirection) => {
      switch (field) {
        case 'title':
          return artworks.sort((a, b) => {
            const comparison = a.title.localeCompare(b.title);
            return direction === 'asc' ? comparison : -comparison;
          });
        case 'created_at':
          return artworks.sort((a, b) => {
            const aDate = new Date(a.created_at).getTime();
            const bDate = new Date(b.created_at).getTime();
            return direction === 'asc' ? aDate - bDate : bDate - aDate;
          });
        default:
          return artworks;
      }
    },
    [],
  );

  const processedArtworks = useMemo(() => {
    if (!artworks) return [];

    const filtered = filterArtworks(artworks, filters.searchTerm);
    const sorted = sortArtworks(
      filtered,
      filters.sortField,
      filters.sortDirection,
    );

    return sorted;
  }, [artworks, filters, filterArtworks, sortArtworks]);

  return processedArtworks;
};
