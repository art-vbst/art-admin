import axios, { type AxiosError, type AxiosRequestConfig } from 'axios';
import { refresh } from '~/auth/api';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

type RetryRequest = AxiosRequestConfig & {
  _retry: boolean;
};

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequest;

    const shouldSkipRetry =
      !originalRequest ||
      originalRequest._retry ||
      error.response?.status !== 401;

    const isRefreshRequest = originalRequest.url?.endsWith('/auth/refresh');

    if (shouldSkipRetry || isRefreshRequest) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      const response = await refresh();
      const isMeRequest = originalRequest.url?.endsWith('/auth/me');
      return isMeRequest ? response : http.request(originalRequest);
    } catch (error) {
      return Promise.reject(error);
    }
  },
);

export class BaseEndpoint<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  create(data: Partial<T>, config: AxiosRequestConfig = {}) {
    return http.post<T>(this.endpoint, data, config);
  }

  get(id: number | string, params: Record<string, unknown> = {}) {
    const endpoint = `${this.endpoint}/${id}`;
    return http.get<T>(endpoint, { params });
  }

  list(params: Record<string, unknown> = {}) {
    return http.get<T[]>(this.endpoint, { params });
  }

  update(
    id: number | string,
    data: Partial<T>,
    config: AxiosRequestConfig = {},
    patch = true,
  ) {
    const endpoint = `${this.endpoint}/${id}`;

    return patch
      ? http.patch<T>(endpoint, data, config)
      : http.put<T>(endpoint, data, config);
  }

  delete(id: number | string) {
    const endpoint = `${this.endpoint}/${id}`;
    return http.delete(endpoint);
  }
}
