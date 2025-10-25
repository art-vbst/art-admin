import axios, { type AxiosRequestConfig } from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_HOST,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class BaseEndpoint<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  create(data: T, config: AxiosRequestConfig = {}) {
    return http.post<T>(this.endpoint, data, config);
  }

  get(id: number | string, params: Record<string, unknown> = {}) {
    const endpoint = `${this.endpoint}${id}`;
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
    const endpoint = `${this.endpoint}${id}`;

    return patch
      ? http.patch<T>(endpoint, data, config)
      : http.put<T>(endpoint, data, config);
  }

  delete(id: number | string) {
    const endpoint = `${this.endpoint}${id}`;
    return http.delete(endpoint);
  }
}
