import { z } from 'zod';

export function formatUSD(cents: number | null | undefined): string {
  if (cents == null) return '$0.00';
  const dollars = cents / 100;
  return dollars.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function isUuid(value: string): boolean {
  const schema = z.string().uuid();
  const res = schema.safeParse(value);
  return res.success;
}
