import type { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useAction } from './useAction';

export const usePageData = <T>(
  fetcher: () => Promise<AxiosResponse<T>>,
  deps: unknown[] = [],
) => {
  const [data, setData] = useState<T | null>(null);

  const { execute, loading, error } = useAction(fetcher, {
    initLoading: true,
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: dependencies managed by caller
  useEffect(() => void execute().then(setData), deps);

  const refetch = async () => {
    const next = await execute();
    if (next !== null) setData(next);
    return next;
  };

  return { data, loading, error, refetch };
};
