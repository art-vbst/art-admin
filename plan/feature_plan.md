# Active Orders Feature Plan

## Overview

Add an "Active Orders" workflow to the admin interface that allows admins to easily view and process orders with status "processing". This includes a dashboard card, dedicated list view, and order status management actions.

## Feature Requirements

### 1. Dashboard Enhancement

**Location**: `/src/pages/dashboard/Dashboard.tsx`

**Requirements**:

- Add a new dashboard card titled "Active Orders"
- Display count of orders with `status === "processing"`
- Card should be clickable and navigate to `/orders/active`
- Card should include link text "View Active Orders →"
- Fetch orders data with query param `status=processing` using `OrderEndpoint.list({ status: 'processing' })`
- Show loading skeleton while fetching
- Position: Display alongside existing "Total Orders" and "Total Artworks" cards

**Implementation Notes**:

- Follow existing `DashboardCard` component pattern
- Use `usePageData` hook for data fetching
- Handle loading state with skeleton (existing pattern)

---

### 2. Active Orders List View

**Location**: `/src/pages/orders/active/index.tsx` (new file)

**Route**: `/orders/active`

**Requirements**:

- Display orders with `status === "processing"` only
- Fetch using `OrderEndpoint.list({ status: 'processing' })`
- Sort by `created_at` ascending (oldest first) - this ensures orders are processed in the order they were received
- Breadcrumb: `"orders" > "active orders"`
- Page title: "Active Orders"
- Reuse `OrdersTable` component from `/src/pages/orders/list/OrdersTable.tsx`
- Row click navigates to `/orders/:id` (existing order detail page)
- Show empty state if no processing orders exist: "No active orders"
- Display loading skeleton (match pattern from existing orders list)

**Implementation Notes**:

- No search/filter inputs on this page
- No sort controls (always sorted by created_at ascending)
- May reuse or duplicate structure from `/src/pages/orders/list/index.tsx`
- Create simple sorting logic inline or use `useMemo` to sort by `created_at` ascending
- Browser back button will naturally return user to this page when navigating from order detail

**Data Flow**:

```typescript
const { data, loading, error } = usePageData(() =>
  OrderEndpoint.list({ status: "processing" })
);

const sortedOrders = useMemo(() => {
  if (!data) return [];
  return [...data].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );
}, [data]);
```

---

### 3. Order Detail Page Enhancement

**Location**: `/src/pages/orders/detail/index.tsx`

**Requirements**:

- Add action buttons section after the existing order details
- Display buttons based on current order status:
  - **"Mark as Shipped"** button: Show if `order.status === "pending"` OR `order.status === "processing"`
  - **"Mark as Delivered"** button: Show if `order.status === "shipped"`
- Position buttons in a prominent location (e.g., after Summary section, before Customer & Shipping)

**Button Behaviors**:

#### Mark as Shipped Button

- Opens a confirmation modal with:
  - Title: "Mark Order as Shipped"
  - Input field for tracking link (optional, labeled "Tracking Link (optional)")
  - Description: "This will update the order status to 'shipped'. Optionally provide a tracking link that will be emailed to the customer."
  - Cancel button (secondary variant)
  - Confirm button (primary variant, text: "Mark as Shipped")
- On confirm:
  - Call `OrderEndpoint.update(orderId, { status: 'shipped', tracking_link: trackingLinkValue })`
  - If tracking link is empty/null, only send `{ status: 'shipped' }`
  - Show loading state on buttons during API call
  - On success: Refetch order data to show updated status (stay on detail page)
  - On error: Display error message in modal
  - Close modal after successful update

#### Mark as Delivered Button

- Opens a confirmation modal with:
  - Title: "Mark Order as Delivered"
  - Description: "This will mark the order as completed. This action confirms the customer has received their order."
  - Cancel button (secondary variant)
  - Confirm button (primary variant, text: "Mark as Delivered")
- On confirm:
  - Call `OrderEndpoint.update(orderId, { status: 'completed' })`
  - Show loading state on buttons during API call
  - On success: Refetch order data to show updated status (stay on detail page)
  - On error: Display error message in modal
  - Close modal after successful update

**Implementation Notes**:

- Create new modal component or extend existing `ConfirmModal` (from `DeleteModal.tsx`) to support input field
- Use controlled input state for tracking link
- Refetch order data after successful status update using existing `usePageData` refetch pattern
- Follow existing modal patterns in codebase (see `DeleteModal.tsx`)
- Buttons should be disabled during loading state
- Use existing `Button` component from `~/components/ui`

---

### 4. Routing Updates

**Location**: `/src/routes.tsx`

**Requirements**:

- Add new route: `{ path: '/orders/active', element: <ActiveOrdersList /> }`
- Insert in `privateRoutes` array alongside existing order routes
- Import new `ActiveOrdersList` component

---

### 5. API Integration Details

**BaseEndpoint Support**:

- `OrderEndpoint.list({ status: 'processing' })` - fetches filtered orders
- `OrderEndpoint.update(id, { status: 'shipped', tracking_link?: string })` - updates order status with optional tracking link
- `OrderEndpoint.update(id, { status: 'completed' })` - updates order status to completed

**Request Bodies**:

```typescript
// Mark as Shipped (with tracking link)
{ status: 'shipped', tracking_link: 'https://...' }

// Mark as Shipped (without tracking link)
{ status: 'shipped' }

// Mark as Delivered
{ status: 'completed' }
```

---

## UI/UX Patterns to Follow

### Component Patterns

1. **Loading States**: Use existing skeleton patterns from Dashboard and OrderList
2. **Modals**: Follow `ConfirmModal` pattern from `DeleteModal.tsx`
3. **Buttons**: Use `Button` component with appropriate variants (primary, secondary)
4. **Tables**: Reuse `OrdersTable` component
5. **Breadcrumbs**: Use existing `Breadcrumbs` component
6. **Error Display**: Use `ErrorText` component for inline errors

### Styling Consistency

- Maintain white backgrounds
- Use existing Tailwind utility classes
- Sharp corners (not rounded excessively)
- Follow existing spacing/padding patterns
- Match existing color scheme (gray-900 for text, gray-100 for badges, etc.)

### Code Organization

- Colocate components within feature folders
- Use `usePageData` hook for data fetching
- Use `useAction` hook if needed for mutations
- Follow existing file structure patterns
- Keep components simple and focused

---

## Implementation Checklist

### Phase 1: Active Orders List View

- [ ] Create `/src/pages/orders/active/index.tsx`
- [ ] Create `ActiveOrdersList` component
- [ ] Implement data fetching with `status=processing` filter
- [ ] Implement sorting by `created_at` ascending
- [ ] Add breadcrumbs component
- [ ] Reuse `OrdersTable` component
- [ ] Add empty state handling
- [ ] Add loading skeleton
- [ ] Add error handling
- [ ] Update routes in `routes.tsx`

### Phase 2: Dashboard Card

- [ ] Update `Dashboard.tsx` to fetch processing orders count
- [ ] Add "Active Orders" dashboard card
- [ ] Make card clickable linking to `/orders/active`
- [ ] Update loading skeleton to include new card
- [ ] Test navigation flow

### Phase 3: Order Detail Actions

- [ ] Create reusable modal component for tracking link input (or extend `ConfirmModal`)
- [ ] Add action buttons section to order detail page
- [ ] Implement "Mark as Shipped" button with conditional rendering
- [ ] Implement "Mark as Delivered" button with conditional rendering
- [ ] Create "Mark as Shipped" modal with tracking link input
- [ ] Create "Mark as Delivered" confirmation modal
- [ ] Implement API calls for status updates
- [ ] Add error handling for API calls
- [ ] Implement order refetch after successful update
- [ ] Add loading states to buttons during API calls

### Phase 4: Testing & Polish

- [ ] Test complete workflow: Dashboard → Active Orders → Order Detail → Status Update → Refetch
- [ ] Test browser back button navigation
- [ ] Verify status-based button visibility logic
- [ ] Test empty states
- [ ] Test error states
- [ ] Verify consistency with existing UI patterns
- [ ] Test loading states
- [ ] Verify proper sorting (oldest orders first)

---

## Technical Considerations

### Status Flow

```
pending → processing → shipped → completed
         ↓
       failed/canceled
```

### Button Visibility Logic

```typescript
const showMarkAsShipped =
  order.status === "pending" || order.status === "processing";
const showMarkAsDelivered = order.status === "shipped";
```

### Sorting Logic

```typescript
// Sort by created_at ascending (oldest first)
orders.sort(
  (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
);
```

### Modal Component Pattern

Consider creating a new component `OrderActionModal` that extends the pattern from `ConfirmModal`:

```typescript
type OrderActionModalProps = {
  title: string;
  description: string;
  open: boolean;
  onConfirm: (trackingLink?: string) => Promise<void>;
  onClose: () => void;
  showTrackingInput?: boolean;
};
```

---

## Edge Cases & Error Handling

1. **No Processing Orders**: Show empty state on active orders page
2. **API Errors**: Display inline error messages, don't navigate away
3. **Network Failures**: Show error in modal, keep modal open
4. **Invalid Order Status**: Button should not show (handled by conditional rendering)
5. **Concurrent Updates**: Refetch order data after any update to ensure fresh state
6. **Invalid Tracking Link**: No validation required per requirements (optional field)

---

## Out of Scope

- Search/filter functionality on active orders page
- Persistent sorting preferences
- URL state management for filters
- Automatic refresh/polling for new orders
- Bulk actions on multiple orders
- Order status history/audit log
- Tracking link validation
- Tracking link display on order detail page
- Email notification triggers (handled by backend)

---

## Success Criteria

✅ Admin can see count of processing orders on dashboard  
✅ Admin can navigate to dedicated active orders list view  
✅ Active orders are sorted by creation date (oldest first)  
✅ Admin can click order to view details  
✅ Admin can mark pending/processing orders as shipped (with optional tracking link)  
✅ Admin can mark shipped orders as delivered  
✅ Order detail page updates after status change  
✅ Browser back button returns to previous view  
✅ All UI components match existing design patterns  
✅ Error states are handled gracefully  
✅ Loading states are consistent with existing patterns
