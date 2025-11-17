import type { User } from '@art-vbst/art-types';
import { http } from '~/api/http';

type LoginResponse = {
  qr_code?: string;
};

export function me() {
  return http.get<User>('/auth/me');
}

export function refresh() {
  return http.post<User>('/auth/refresh');
}

export function login(email: string, password: string) {
  return http.post<LoginResponse>('/auth/login', { email, password });
}

export function verify(totp: string) {
  return http.post<User>('/auth/totp', { totp });
}

export function logout() {
  return http.post('/auth/logout');
}
