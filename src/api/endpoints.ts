import { BaseEndpoint, http } from './http';
import type { Test } from './types';

export const TestEndpoint = new BaseEndpoint<Test>('test');

export function login(email: string, password: string) {
  return http.post('/auth/login', { email, password });
}

export function logout() {
  return http.post('/auth/logout');
}

export function me() {
  return http.get('/auth/me');
}
