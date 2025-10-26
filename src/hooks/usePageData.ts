import type { AxiosResponse } from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { useAction } from './useAction';

export const usePageData = <T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  deps: unknown[] = [],
) => {
  const [data, setData] = useState<T | null>(null);

  const { execute, loading, error } = useAction(fetcher, {
    initLoading: true,
  });

  const refetch = useCallback(async () => {
    const result = await execute();
    setData(result);
    return result;
  }, [execute]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: external deps are intentional
  useEffect(() => {
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, refetch } as const;
};
