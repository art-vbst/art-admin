import clsx, { type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { z } from 'zod';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatUSD = (cents: number | undefined): string => {
  const dollars = cents ? cents / 100 : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(dollars);
};

const uuidSchema = z.string().uuid();

export const isUuid = (value: string): boolean => {
  return uuidSchema.safeParse(value).success;
};
