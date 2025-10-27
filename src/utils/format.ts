import { z } from 'zod';

export const formatUSD = (cents: number): string => {
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
};

const uuidSchema = z.string().uuid();

export const isUuid = (value: string): boolean => {
  return uuidSchema.safeParse(value).success;
};
