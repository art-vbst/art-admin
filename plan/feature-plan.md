## CMS Admin Feature Plan

### Scope and Priorities
- **Priorities**: simplicity, minimalism, modernity, maintainability. White backgrounds, sharp corners.
- **Pages**: Dashboard, Artwork List, Artwork Detail, Orders List, Orders Detail.
- **Frontend-only**: Data via API. Auth and routes already wired.

### Confirmed API and Behavior
- **API host**: Already set via `VITE_API_HOST`.
- **Endpoints**: `BaseEndpoint` builds `/${resource}` and `/${resource}/${id}`.
- **IDs**: UUID strings. Validate route params with Zod `z.string().uuid()`.
- **Lists**: Endpoints return plain arrays; no pagination initially.
- **Search and sort**:
  - Client-side `search` by Title.
  - Client-side sort by Title and Created Date.
- **Errors**: Status code + message; show minimal inline errors.
- **Types**: Use latest `@art-vbst/art-types` for `Artwork`, `Image`, `Order`, `Payment`.
- **Artwork fields**: Render every field from type.
- **Mutations**:
  - Artworks: create, update, delete.
  - Orders: read-only for now.
- **Creation UX**: Artwork creation via modal on list page (no images). After create, navigate to detail.
- **Images**:
  - Use `/images` REST endpoint with standard CRUD.
  - POST file directly (backend handles GCS upload).
  - Manage create/delete and toggle primary on the Artwork Detail page using modals.
  - Ignore image ordering for now.
- **Navigation**: Add global navbar/header. Add breadcrumbs per page.
- **Loading**: Minimal skeletons for lists/details; spinner for auth loading.
- **Display**: Dates in local time. Money in USD (cents → dollars).
- **Access**: No role-based differences.

### Shared Infrastructure Updates
1) Layout header and breadcrumbs
- Add a header in `src/layout/layout.tsx` with links: Dashboard (`/`), Artworks (`/artworks`), Orders (`/orders`), and Logout (calling auth `logout` then route to `/login`).
- Add a breadcrumb strip in each page at the top:
  - Dashboard: “dashboard”
  - Artwork List: “artworks”
  - Artwork Detail: “artworks > {title or id}”
  - Orders List: “orders”
  - Orders Detail: “orders > {id}”

2) Loading and error UX
- Replace `AuthGuard` “Loading...” with a centered spinner (Tailwind `animate-spin`).
- Provide minimal skeletons:
  - Lists: gray bars/rows matching table columns.
  - Detail: two-column skeleton blocks.
- Inline error message area at top of page/table/form when API calls fail.

3) Hooks and utils
- Utility `formatUSD(cents: number): string` (e.g., `$1,234.56`).
- Utility `isUuid(value: string): boolean` using Zod.

4) Endpoints
- Keep `ArtEndpoint` and `OrderEndpoint` as-is.
- Add `ImageEndpoint = new BaseEndpoint<Image>('images')` in `src/pages/images/api/index.ts` (or colocate under artwork api).

### Page Implementations
1) Dashboard (`/`)
- Data:
  - Fetch all orders via `OrderEndpoint.list()`.
  - Optionally fetch artworks via `ArtEndpoint.list()` to show total artworks.
- UI:
  - Breadcrumb: “dashboard”.
  - Minimal cards:
    - Active Orders: temporarily equal to all orders length (backend will refine later).
    - Total Orders: all orders length.
    - Total Artworks: artworks length (optional).
  - Each card includes a link button: Artworks → `/artworks`, Orders → `/orders`.
  - Skeleton: 2–3 rectangular skeleton cards while loading.

2) Artwork List (`/artworks`)
- Data:
  - Use `usePageData` or `useAction` to call `ArtEndpoint.list()`.
  - Client-side search with searchbar. Matches case-insensitive artwork title substring.
  - Client-side sorting by Title (A↔Z) and Created Date (new↔old). Default: Created newest first if `created_at` exists; otherwise Title A–Z.
- Header:
  - Breadcrumb: “artworks”.
  - Search input (debounce ~300ms).
  - Sort controls (Title, Created).
  - “Create Artwork” button that opens a modal.
- Table columns (from `Artwork`):
  - id, title, painting_number, painting_year, width_inches, height_inches, price_cents (format USD), paper, sort_order, sold_at (local or —), status, medium, category, created_at (local), order_id (or —).
  - Optional thumbnail if a main image is available (small square left of title).
  - Row click navigates to `/artworks/:id`.
- Empty state: “No artworks” with a “Create Artwork” button.
- Skeleton: 6–10 row skeleton table.

Create Artwork modal
- Fields: title (required), width_inches, height_inches, price in USD (converted to cents on submit), status, medium, category, optional painting_number, painting_year, paper.
- Validation: title non-empty; numeric fields non-negative; price integer cents.
- Submit:
  - Call `ArtEndpoint.create(payload)`.
  - On success, close modal and navigate to `/artworks/{id}`.
  - Show inline error on failure.

3) Artwork Detail (`/artworks/:id`)
- Param validation:
  - Read `id` from route; validate with Zod UUID. If invalid, render NotFound.
- Data:
  - Fetch via `ArtEndpoint.get(id)`; use `usePageData` with `[id]` and expose `refetch` for after mutations.
- Layout:
  - Breadcrumb: “artworks > {title or id}”.
  - Two columns on desktop; single column stacking on mobile.
- Left: Artwork form (render and allow edits to all fields):
  - id (readonly), title, painting_number, painting_year, width_inches, height_inches, price (USD input, convert to cents on submit), paper, sort_order, sold_at (nullable date-time), status, medium, category, created_at (readonly), order_id (nullable).
  - Save button → `ArtEndpoint.update(id, partial, { patch: true })`.
  - Delete artwork button → confirm → `ArtEndpoint.delete(id)` → navigate back to `/artworks`.
- Right: Images panel
  - “Add Image” button → modal with fields: file (required), is_main_image (checkbox); hidden artwork_id = current id.
  - Create image:
    - Build `FormData` with: `file`, `artwork_id`, `is_main_image`.
    - `ImageEndpoint.create(formData, { headers: { 'Content-Type': 'multipart/form-data' } })`.
    - Close and `refetch`.
  - Image grid/list:
    - Each shows preview and metadata (image_url, created_at).
    - Click image → modal with toggle for primary and a Delete button.
      - Toggle primary → `ImageEndpoint.update(image.id, { is_main_image })` → `refetch`.
      - Delete → confirm → `ImageEndpoint.delete(image.id)` → `refetch`.
  - Ignore image ordering for now.
- Skeletons for form and images while loading.

4) Orders List (`/orders`)
- Data: `OrderEndpoint.list()`; client-side sort by Created (default newest first) and optionally by status.
- Client-side search for customer email.
- Header: breadcrumb “orders”, search input, sort dropdown.
- Table columns:
  - id, status, shippingDetail.name, shippingDetail.email, paymentRequirement.totalCents (USD), payments.length, createdAt (local).
- Row click → `/orders/:id`.
- Skeleton table while loading.

5) Orders Detail (`/orders/:id`)
- Param validation with Zod UUID. Invalid → NotFound.
- Data: `OrderEndpoint.get(id)`.
- UI (read-only):
  - Breadcrumb: “orders > {id}”.
  - Summary: id, status, createdAt (local).
  - Customer: full shippingDetail.
  - Payments: list each payment with amounts (USD) and basic details from `Payment` type.
  - Totals: paymentRequirement subtotalCents, shippingCents, totalCents (USD).
- Skeletons while loading.

### API Usage Details
- BaseEndpoint
  - `create(data, config)` → `POST /{resource}`
  - `get(id)` → `GET /{resource}/{id}`
  - `list(params)` → `GET /{resource}` with query params
  - `update(id, data, { patch: true })` → `PATCH /{resource}/{id}`
  - `delete(id)` → `DELETE /{resource}/{id}`
- Images endpoint
  - Create: `multipart/form-data` with `file`, `artwork_id`, `is_main_image`.
  - Update: JSON `{ is_main_image: boolean }`.
  - Delete: `DELETE /images/{id}`.
- Search: client-side `search` for Artwork and Orders lists when input non-empty.
- Sorting: client-side on arrays returned by API.
- Errors: show inline message near page title or form/table header.
- Dates: local `toLocaleString()`.
- Currency: cents → USD string via `formatUSD`.
- Validation: Zod UUID for route params; Zod field validation in forms.

### File-by-File Checklist
1) `src/layout/layout.tsx`
- Add header with nav links and Logout. Keep content container minimal and white.

2) `src/auth/context.tsx`
- Replace loading text in `AuthGuard` with spinner component.

3) `src/hooks/usePageData.ts`
- Add dependencies and `refetch` return value.

4) `src/pages/dashboard/Dashboard.tsx`
- Implement cards, data fetching, and links.

5) `src/pages/artwork/api/index.ts`
- Keep `ArtEndpoint`.
- Add `src/pages/images/api/index.ts` exporting `ImageEndpoint`.

6) `src/pages/artwork/list/index.tsx`
- Implement breadcrumb, search, sort, create modal, table, skeleton.

7) `src/pages/artwork/detail/index.tsx`
- Validate UUID; implement editable form; implement images panel with add/toggle/delete flows; skeletons.

8) `src/pages/orders/list/index.tsx`
- Implement breadcrumb, search, sort, table, skeleton.

9) `src/pages/orders/detail/index.tsx`
- Validate UUID; render read-only sections; skeletons.

### Acceptance Criteria
- Global navbar and breadcrumbs present.
- Dashboard shows cards and links.
- Artwork List: search param sent; client-side sort; table renders all fields; create modal navigates to detail on success.
- Artwork Detail: all fields editable and persisted; images can be created, set primary, and deleted via `/images`.
- Orders List: search param sent; client-side sort; table renders required fields; row navigation works.
- Orders Detail: renders sections read-only.
- Minimal skeletons and spinner are used; dates are local; currency is USD from cents.
- Invalid UUIDs render NotFound without API calls.

### Out of Scope (for now)
- Pagination and server-side sorting/filtering.
- Image reordering.
- Orders mutations and additional dashboards/charts.