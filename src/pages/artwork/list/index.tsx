import type { Artwork } from '@art-vbst/art-types';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { z } from 'zod';
import { useAction } from '~/hooks/useAction';
import { usePageData } from '~/hooks/usePageData';
import { formatUSD } from '~/utils/format';
import { ArtEndpoint } from '../api';

type SortKey = 'title' | 'created_at';
type SortDir = 'asc' | 'desc';

export const ArtworkList = () => {
  const navigate = useNavigate();

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [showCreate, setShowCreate] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(id);
  }, [searchInput]);

  const {
    data,
    loading,
    error,
    refetch,
  } = usePageData<Artwork[]>(() => ArtEndpoint.list(search ? { search } : {}), [search]);

  const artworks = useMemo(() => {
    const list = data ?? [];
    const filtered = search
      ? list.filter((a) => a.title.toLowerCase().includes(search.toLowerCase()))
      : list;

    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'title') {
        const res = a.title.localeCompare(b.title);
        return sortDir === 'asc' ? res : -res;
      }
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
      const res = aDate - bDate;
      return sortDir === 'asc' ? res : -res;
    });

    return sorted;
  }, [data, search, sortKey, sortDir]);

  const handleRowClick = (id: string) => navigate(`/artworks/${id}`);

  return (
    <div>
      <div className="breadcrumb">artworks</div>

      {error && (
        <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-red-700">
          {error.message}
        </div>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <input
            placeholder="Search by title..."
            className="w-full rounded-md border px-3 py-2 sm:max-w-xs"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Sort</label>
            <select
              className="rounded-md border px-2 py-1 text-sm"
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
            >
              <option value="title">Title</option>
              <option value="created_at">Created</option>
            </select>
            <button
              type="button"
              onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
              className="rounded-md border px-2 py-1 text-sm"
              aria-label="Toggle sort direction"
              title="Toggle sort direction"
            >
              {sortDir === 'asc' ? 'A→Z' : 'Z→A'}
            </button>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="rounded-md bg-black px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          Create Artwork
        </button>
      </div>

      {loading ? (
        <SkeletonTable />
      ) : artworks.length === 0 ? (
        <div className="rounded border bg-white p-8 text-center text-gray-600">
          <div className="mb-4">No artworks</div>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="rounded-md border px-3 py-2 text-sm hover:bg-gray-100"
          >
            Create Artwork
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-md border bg-white text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <Th>ID</Th>
                <Th>Title</Th>
                <Th>No.</Th>
                <Th>Year</Th>
                <Th>W (in)</Th>
                <Th>H (in)</Th>
                <Th>Price</Th>
                <Th>Paper</Th>
                <Th>Sort</Th>
                <Th>Sold</Th>
                <Th>Status</Th>
                <Th>Medium</Th>
                <Th>Category</Th>
                <Th>Created</Th>
                <Th>Order</Th>
              </tr>
            </thead>
            <tbody>
              {artworks.map((a) => (
                <tr
                  key={a.id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(a.id)}
                >
                  <Td>{a.id}</Td>
                  <Td className="font-medium">{a.title}</Td>
                  <Td>{a.painting_number ?? '—'}</Td>
                  <Td>{a.painting_year ?? '—'}</Td>
                  <Td>{a.width_inches ?? '—'}</Td>
                  <Td>{a.height_inches ?? '—'}</Td>
                  <Td>{formatUSD(a.price_cents ?? 0)}</Td>
                  <Td>{a.paper ?? '—'}</Td>
                  <Td>{a.sort_order ?? '—'}</Td>
                  <Td>
                    {a.sold_at ? new Date(a.sold_at).toLocaleString() : '—'}
                  </Td>
                  <Td>{a.status ?? '—'}</Td>
                  <Td>{a.medium ?? '—'}</Td>
                  <Td>{a.category ?? '—'}</Td>
                  <Td>
                    {a.created_at ? new Date(a.created_at).toLocaleString() : '—'}
                  </Td>
                  <Td>{a.order_id ?? '—'}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showCreate && (
        <CreateArtworkModal
          onClose={() => setShowCreate(false)}
          onCreated={(id) => navigate(`/artworks/${id}`)}
        />
      )}
    </div>
  );
};

const Th = ({ children }: { children: React.ReactNode }) => (
  <th className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
    {children}
  </th>
);

const Td = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-3 py-2 align-top ${className}`}>{children}</td>
);

const SkeletonTable = () => {
  return (
    <div className="overflow-x-auto">
      <div className="min-w-full rounded-md border bg-white p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="mb-3 grid grid-cols-6 gap-4 last:mb-0">
            <div className="skeleton h-4 w-16" />
            <div className="skeleton h-4 w-40" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-4 w-24" />
            <div className="skeleton h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
};

const createArtworkSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  width_inches: z.coerce.number().nonnegative().optional(),
  height_inches: z.coerce.number().nonnegative().optional(),
  price_usd: z
    .string()
    .regex(/^\d*(?:\.\d{0,2})?$/, 'Enter a valid price')
    .optional()
    .default('0'),
  status: z.string().optional(),
  medium: z.string().optional(),
  category: z.string().optional(),
  painting_number: z.coerce.number().nonnegative().optional(),
  painting_year: z.coerce.number().nonnegative().optional(),
  paper: z.string().optional(),
});

type CreateArtworkForm = z.infer<typeof createArtworkSchema>;

const CreateArtworkModal = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: string) => void;
}) => {
  const [form, setForm] = useState<CreateArtworkForm>({ title: '' });
  const [error, setError] = useState<string | null>(null);
  const { execute, loading } = useAction(() =>
    ArtEndpoint.create({
      title: form.title,
      width_inches: form.width_inches,
      height_inches: form.height_inches,
      price_cents: Math.round(Number(form.price_usd || '0') * 100),
      status: form.status,
      medium: form.medium,
      category: form.category,
      painting_number: form.painting_number,
      painting_year: form.painting_year,
      paper: form.paper,
    } as unknown as Artwork),
  );

  const submit = async () => {
    setError(null);
    const parsed = createArtworkSchema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Invalid form');
      return;
    }
    const created = await execute();
    if (!created) {
      setError('Failed to create');
      return;
    }
    onClose();
    onCreated((created as unknown as Artwork).id as unknown as string);
  };

  const onChange = <K extends keyof CreateArtworkForm>(key: K, value: CreateArtworkForm[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-md bg-white p-6 shadow-lg">
        <div className="mb-3 text-lg font-semibold">Create Artwork</div>
        {error && (
          <div className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <TextField label="Title" value={form.title} onChange={(v) => onChange('title', v)} required />
          <NumberField label="Width (in)" value={form.width_inches} onChange={(v) => onChange('width_inches', v)} />
          <NumberField label="Height (in)" value={form.height_inches} onChange={(v) => onChange('height_inches', v)} />
          <TextField label="Price (USD)" value={form.price_usd} onChange={(v) => onChange('price_usd', v)} />
          <TextField label="Status" value={form.status} onChange={(v) => onChange('status', v)} />
          <TextField label="Medium" value={form.medium} onChange={(v) => onChange('medium', v)} />
          <TextField label="Category" value={form.category} onChange={(v) => onChange('category', v)} />
          <NumberField label="Painting No." value={form.painting_number} onChange={(v) => onChange('painting_number', v)} />
          <NumberField label="Painting Year" value={form.painting_year} onChange={(v) => onChange('painting_year', v)} />
          <TextField label="Paper" value={form.paper} onChange={(v) => onChange('paper', v)} />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button className="rounded-md border px-3 py-1.5 text-sm" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button
            className="rounded-md bg-black px-3 py-1.5 text-sm text-white disabled:bg-gray-400"
            onClick={submit}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TextField = ({
  label,
  value,
  onChange,
  required,
}: {
  label: string;
  value?: string;
  onChange: (value: string) => void;
  required?: boolean;
}) => (
  <label className="block text-sm">
    <span className="mb-1 block text-gray-600">{label}</span>
    <input
      className="w-full rounded-md border px-3 py-2"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    />
  </label>
);

const NumberField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number;
  onChange: (value: number | undefined) => void;
}) => (
  <label className="block text-sm">
    <span className="mb-1 block text-gray-600">{label}</span>
    <input
      type="number"
      className="w-full rounded-md border px-3 py-2"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? undefined : Number(e.target.value))}
    />
  </label>
);
