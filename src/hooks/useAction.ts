import type { AxiosError, AxiosResponse } from 'axios';
import { useState } from 'react';

type UseActionConfig = {
  initLoading: boolean;
};

export const useAction = <T, Args extends unknown[]>(
  fetcher: (...args: Args) => Promise<AxiosResponse<T>>,
  config?: UseActionConfig,
) => {
  const [loading, setLoading] = useState(config?.initLoading ?? false);
  const [error, setError] = useState<AxiosError<T> | null>(null);

  const execute = async (...args: Args) => {
    try {
      setLoading(true);
      const res = await fetcher(...args);
      return res.data;
    } catch (error) {
      setError(error as AxiosError<T>);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { execute, loading, error };
};
