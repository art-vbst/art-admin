import type { Image } from '@art-vbst/art-types';
import { BaseEndpoint } from '~/api/http';

export const getImageEndpoint = (artworkId: string) =>
  new BaseEndpoint<Image>(`artworks/${artworkId}/images`);
