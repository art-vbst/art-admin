import type { User } from '@art-vbst/art-types';
import { http } from '~/api/http';

export function me() {
  return http.get<User>('/auth/me');
}

export function refresh() {
  return http.get<User>('/auth/refresh');
}

export function login(email: string, password: string) {
  return http.post<User>('/auth/login', { email, password });
}

export function logout() {
  return http.post('/auth/logout');
}
