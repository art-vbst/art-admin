import type { Order } from '@art-vbst/art-types';
import { BaseEndpoint } from '~/api/http';

export const OrderEndpoint = new BaseEndpoint<Order>('orders');
