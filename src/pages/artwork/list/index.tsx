import type { Artwork } from '@art-vbst/art-types';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { useAction } from '~/hooks/useAction';
import { usePageData } from '~/hooks/usePageData';
import { ArtEndpoint } from '~/pages/artwork/api';
import { formatUSD } from '~/utils/format';

type SortKey = 'title' | 'created_at';
type SortDir = 'asc' | 'desc';

const CreateArtworkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  painting_number: z.string().optional(),
  painting_year: z.coerce.number().int().nonnegative().optional(),
  width_inches: z.coerce.number().nonnegative().optional(),
  height_inches: z.coerce.number().nonnegative().optional(),
  price_usd: z
    .string()
    .transform((v) => v.trim())
    .refine((v) => v === '' || !Number.isNaN(Number.parseFloat(v)), 'Invalid price')
    .optional(),
  status: z.string().optional(),
  medium: z.string().optional(),
  category: z.string().optional(),
  paper: z.string().optional(),
});

export const ArtworkList = () => {
  const navigate = useNavigate();
  const { data, loading, error, refetch } = usePageData<Artwork[]>(
    ArtEndpoint.list.bind(ArtEndpoint),
  );

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  useEffect(() => {
    const id = setTimeout(() => setDebouncedSearch(search.trim().toLowerCase()), 300);
    return () => clearTimeout(id);
  }, [search]);

  const filtered = useMemo(() => {
    const items = (data ?? []).slice();
    const bySearch = debouncedSearch
      ? items.filter((a) => {
          const r = a as unknown as Record<string, unknown>;
          const title = String((r.title as string) ?? '').toLowerCase();
          return title.includes(debouncedSearch);
        })
      : items;

    const withKey = bySearch.sort((a, b) => {
      const ra = a as unknown as Record<string, unknown>;
      const rb = b as unknown as Record<string, unknown>;
      if (sortKey === 'title') {
        const ta = String(ra.title ?? '').toLowerCase();
        const tb = String(rb.title ?? '').toLowerCase();
        return sortDir === 'asc' ? ta.localeCompare(tb) : tb.localeCompare(ta);
      }
      const ca = new Date(String(ra.created_at ?? ra.createdAt ?? 0)).getTime();
      const cb = new Date(String(rb.created_at ?? rb.createdAt ?? 0)).getTime();
      return sortDir === 'asc' ? ca - cb : cb - ca;
    });

    return withKey;
  }, [data, debouncedSearch, sortKey, sortDir]);

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [createVals, setCreateVals] = useState({
    title: '',
    painting_number: '',
    painting_year: '' as unknown as number | undefined,
    width_inches: '' as unknown as number | undefined,
    height_inches: '' as unknown as number | undefined,
    price_usd: '',
    status: '',
    medium: '',
    category: '',
    paper: '',
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const { execute: createArtwork, loading: creating } = useAction(() => {
    const parsed = CreateArtworkSchema.safeParse(createVals);
    if (!parsed.success) {
      const first = parsed.error.issues[0]?.message ?? 'Invalid fields';
      return Promise.reject(new Error(first));
    }
    const v = parsed.data;
    const price_cents = v.price_usd && v.price_usd !== ''
      ? Math.round(Number.parseFloat(v.price_usd) * 100)
      : undefined;
    const payload: Partial<Artwork> = {
      title: v.title,
      painting_number: v.painting_number,
      painting_year: v.painting_year,
      width_inches: v.width_inches,
      height_inches: v.height_inches,
      // @ts-expect-error dynamic shape tolerated
      price_cents,
      status: v.status,
      medium: v.medium,
      category: v.category,
      paper: v.paper,
    } as unknown as Artwork;
    // @ts-expect-error create accepts Partial in backend
    return ArtEndpoint.create(payload);
  });

  const handleCreate = async () => {
    setCreateError(null);
    try {
      const created = await createArtwork();
      if (!created) return;
      const rec = created as unknown as Record<string, unknown>;
      const id = String(rec.id);
      setCreateOpen(false);
      await refetch();
      navigate(`/artworks/${id}`);
    } catch (e) {
      setCreateError((e as Error).message);
    }
  };

  const renderTable = () => {
    if (loading) {
      return (
        <div className="overflow-hidden rounded border">
          <div className="grid grid-cols-12 gap-2 bg-gray-50 p-3 text-sm text-gray-600">
            {['ID', 'Title', 'Year', 'WxH', 'Price', 'Paper', 'Sort', 'Sold', 'Status', 'Medium', 'Category', 'Created'].map((h) => (
              <div key={h}>{h}</div>
            ))}
          </div>
          <div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 p-3">
                <div className="col-span-12 h-6 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      );
    }

    const rows = filtered;
    if (!rows.length) {
      return (
        <div className="rounded border p-6 text-center">
          <div className="mb-2">No artworks</div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-black"
          >
            Create Artwork
          </button>
        </div>
      );
    }

    return (
      <div className="overflow-hidden rounded border">
        <div className="grid grid-cols-12 gap-2 bg-gray-50 p-3 text-sm text-gray-600">
          <div>ID</div>
          <div>Title</div>
          <div>Year</div>
          <div>WxH</div>
          <div>Price</div>
          <div>Paper</div>
          <div>Sort</div>
          <div>Sold</div>
          <div>Status</div>
          <div>Medium</div>
          <div>Category</div>
          <div>Created</div>
        </div>
        <div>
          {rows.map((a) => {
            const r = a as unknown as Record<string, unknown>;
            const price = (r.price_cents ?? r.priceCents) as number | undefined;
            const priceStr = typeof price === 'number' ? formatUSD(price) : '—';
            const width = Number(r.width_inches ?? r.widthInches ?? 0) || 0;
            const height = Number(r.height_inches ?? r.heightInches ?? 0) || 0;
            const created = String(r.created_at ?? r.createdAt ?? '')
              ? new Date(String(r.created_at ?? r.createdAt)).toLocaleString()
              : '—';
            const sold = String(r.sold_at ?? r.soldAt ?? '')
              ? new Date(String(r.sold_at ?? r.soldAt)).toLocaleString()
              : '—';
            return (
              <button
                key={String(r.id)}
                onClick={() => navigate(`/artworks/${String(r.id)}`)}
                className="grid w-full grid-cols-12 gap-2 p-3 text-left hover:bg-gray-50"
              >
                <div className="truncate text-gray-500">{String(r.id)}</div>
                <div className="font-medium">{String(r.title ?? '—')}</div>
                <div>{String(r.painting_year ?? '—')}</div>
                <div>
                  {width || height ? (
                    <span>
                      {width}×{height}
                    </span>
                  ) : (
                    '—'
                  )}
                </div>
                <div>{priceStr}</div>
                <div>{String(r.paper ?? '—')}</div>
                <div>{String(r.sort_order ?? '—')}</div>
                <div>{sold}</div>
                <div>{String(r.status ?? '—')}</div>
                <div>{String(r.medium ?? '—')}</div>
                <div>{String(r.category ?? '—')}</div>
                <div>{created}</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">artworks</div>

      {error && (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-red-700">
          {error.message}
        </div>
      )}

      <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-56 rounded border px-3 py-1.5"
          />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Sort</span>
            <select
              className="rounded border px-2 py-1"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="title">Title</option>
              <option value="created_at">Created</option>
            </select>
            <select
              className="rounded border px-2 py-1"
              value={sortDir}
              onChange={(e) => setSortDir(e.target.value as SortDir)}
            >
              <option value="asc">Asc</option>
              <option value="desc">Desc</option>
            </select>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-black"
        >
          Create Artwork
        </button>
      </div>

      {renderTable()}

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded bg-white p-6 shadow">
            <div className="mb-4 text-lg font-semibold">Create Artwork</div>
            {createError && (
              <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-red-700">
                {createError}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="mb-1 block text-sm">Title</label>
                <input
                  className="w-full rounded border px-3 py-1.5"
                  value={createVals.title}
                  onChange={(e) =>
                    setCreateVals((v) => ({ ...v, title: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Width (in)</label>
                <input
                  type="number"
                  className="w-full rounded border px-3 py-1.5"
                  value={String(createVals.width_inches ?? '')}
                  onChange={(e) =>
                    setCreateVals((v) => ({
                      ...v,
                      // @ts-expect-error coerce
                      width_inches: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Height (in)</label>
                <input
                  type="number"
                  className="w-full rounded border px-3 py-1.5"
                  value={String(createVals.height_inches ?? '')}
                  onChange={(e) =>
                    setCreateVals((v) => ({
                      ...v,
                      // @ts-expect-error coerce
                      height_inches: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Price (USD)</label>
                <input
                  className="w-full rounded border px-3 py-1.5"
                  value={createVals.price_usd}
                  onChange={(e) =>
                    setCreateVals((v) => ({ ...v, price_usd: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Status</label>
                <input
                  className="w-full rounded border px-3 py-1.5"
                  value={createVals.status}
                  onChange={(e) =>
                    setCreateVals((v) => ({ ...v, status: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Medium</label>
                <input
                  className="w-full rounded border px-3 py-1.5"
                  value={createVals.medium}
                  onChange={(e) =>
                    setCreateVals((v) => ({ ...v, medium: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Category</label>
                <input
                  className="w-full rounded border px-3 py-1.5"
                  value={createVals.category}
                  onChange={(e) =>
                    setCreateVals((v) => ({ ...v, category: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Painting #</label>
                <input
                  className="w-full rounded border px-3 py-1.5"
                  value={createVals.painting_number}
                  onChange={(e) =>
                    setCreateVals((v) => ({
                      ...v,
                      painting_number: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-sm">Year</label>
                <input
                  type="number"
                  className="w-full rounded border px-3 py-1.5"
                  value={String(createVals.painting_year ?? '')}
                  onChange={(e) =>
                    setCreateVals((v) => ({
                      ...v,
                      // @ts-expect-error coerce
                      painting_year: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="col-span-2">
                <label className="mb-1 block text-sm">Paper</label>
                <input
                  className="w-full rounded border px-3 py-1.5"
                  value={createVals.paper}
                  onChange={(e) =>
                    setCreateVals((v) => ({ ...v, paper: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                className="rounded px-3 py-1.5 hover:bg-gray-100"
                onClick={() => setCreateOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={creating}
                onClick={handleCreate}
                className="rounded bg-gray-900 px-3 py-1.5 text-white hover:bg-black disabled:bg-gray-400"
              >
                {creating ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
