import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useAction } from './useAction';

export const usePageData = <T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  dependencies: unknown[] = [],
) => {
  const [data, setData] = useState<T | null>(null);

  const { execute, loading, error } = useAction(fetcher, {
    initLoading: true,
  });

  const refetch = async () => {
    const result = await execute();
    if (result) {
      setData(result);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: don't rely on memoization
  useEffect(() => void execute().then(setData), dependencies);

  return { data, loading, error, refetch };
};
