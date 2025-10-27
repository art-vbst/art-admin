import type { Image } from '@art-vbst/art-types';
import { BaseEndpoint } from '~/api/http';

export const ImageEndpoint = new BaseEndpoint<Image>('images');
