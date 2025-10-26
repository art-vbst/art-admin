import type { Artwork } from '@art-vbst/art-types';
import { BaseEndpoint } from '~/api/http';

export const ArtEndpoint = new BaseEndpoint<Artwork>('artworks');
