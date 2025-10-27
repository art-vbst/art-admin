import { z } from 'zod';

export function formatUSD(cents: number): string {
  const amount = Number.isFinite(cents) ? cents / 100 : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function isUuid(value: string): boolean {
  return z.string().uuid().safeParse(value).success;
}
