import { useState } from 'react';
import { useParams } from 'react-router';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { Button } from '~/components/ui';
import { usePageData } from '~/hooks/usePageData';
import { NotFound } from '~/pages/general/NotFound';
import { formatUSD, isUuid } from '~/utils/format';
import { OrderEndpoint } from '../api';
import { OrderActionModal } from './OrderActionModal';

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();

  if (!id || !isUuid(id)) {
    return <NotFound />;
  }

  return <OrderDetailContent id={id} />;
};

const OrderDetailContent = ({ id }: { id: string }) => {
  const {
    data: order,
    loading,
    error,
    refetch,
  } = usePageData(() => OrderEndpoint.get(id), [id]);

  const [shippedModalOpen, setShippedModalOpen] = useState(false);
  const [deliveredModalOpen, setDeliveredModalOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 h-6 w-48 animate-pulse rounded bg-gray-200" />
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-48 animate-pulse rounded-lg bg-gray-200"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error && error.response?.status !== 404) {
    return <NotFound />;
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded border border-red-200 bg-red-50 p-4 text-red-800">
          Error loading order: {error?.message || 'Not found'}
        </div>
      </div>
    );
  }

  const showMarkAsShipped =
    order.status === 'pending' || order.status === 'processing';
  const showMarkAsDelivered = order.status === 'shipped';

  const handleMarkAsShipped = async (trackingLink?: string) => {
    setActionError(null);
    try {
      const updateData = trackingLink
        ? { status: 'shipped', tracking_link: trackingLink }
        : { status: 'shipped' };
      await OrderEndpoint.update(id, updateData);
      await refetch();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update order status';
      setActionError(errorMessage);
      throw err;
    }
  };

  const handleMarkAsDelivered = async () => {
    setActionError(null);
    try {
      await OrderEndpoint.update(id, { status: 'completed' });
      await refetch();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to update order status';
      setActionError(errorMessage);
      throw err;
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs
        items={[{ label: 'orders', href: '/orders' }, { label: id }]}
      />

      <h1 className="mb-8 font-bold text-3xl text-gray-900">Order Details</h1>

      <div className="space-y-6">
        <Section title="Summary">
          <InfoRow label="Order ID" value={order.id} />
          <InfoRow
            label="Status"
            value={
              <span className="rounded bg-gray-100 px-2 py-1 font-medium text-sm">
                {order.status}
              </span>
            }
          />
          <InfoRow
            label="Created"
            value={new Date(order.created_at).toLocaleString()}
          />
          {order.stripe_session_id && (
            <InfoRow
              label="Stripe Session ID"
              value={order.stripe_session_id}
            />
          )}
        </Section>

        {(showMarkAsShipped || showMarkAsDelivered) && (
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="mb-4 font-bold text-gray-900 text-xl">Actions</h2>
            <div className="flex gap-3">
              {showMarkAsShipped && (
                <Button
                  variant="primary"
                  onClick={() => setShippedModalOpen(true)}
                >
                  Mark as Shipped
                </Button>
              )}
              {showMarkAsDelivered && (
                <Button
                  variant="primary"
                  onClick={() => setDeliveredModalOpen(true)}
                >
                  Mark as Delivered
                </Button>
              )}
            </div>
          </div>
        )}

        <Section title="Customer & Shipping">
          <InfoRow label="Name" value={order.shipping_detail?.name} />
          <InfoRow label="Email" value={order.shipping_detail?.email} />
          <InfoRow
            label="Address Line 1"
            value={order.shipping_detail?.line1}
          />
          {order.shipping_detail?.line2 && (
            <InfoRow
              label="Address Line 2"
              value={order.shipping_detail?.line2}
            />
          )}
          <InfoRow label="City" value={order.shipping_detail?.city} />
          <InfoRow label="State" value={order.shipping_detail?.state} />
          <InfoRow label="Postal Code" value={order.shipping_detail?.postal} />
          <InfoRow label="Country" value={order.shipping_detail?.country} />
        </Section>

        <Section title="Payment Totals">
          <InfoRow
            label="Subtotal"
            value={formatUSD(order.payment_requirement?.subtotal_cents)}
          />
          <InfoRow
            label="Shipping"
            value={formatUSD(order.payment_requirement?.shipping_cents)}
          />
          <InfoRow
            label="Total"
            value={
              <span className="font-bold text-lg">
                {formatUSD(order.payment_requirement?.total_cents)}
              </span>
            }
          />
          <InfoRow
            label="Currency"
            value={order.payment_requirement?.currency.toUpperCase()}
          />
        </Section>

        <Section title="Payments">
          {order.payments?.length === 0 ? (
            <p className="text-gray-600 text-sm">No payments recorded</p>
          ) : (
            <div className="space-y-4">
              {order.payments?.map((payment) => (
                <div
                  key={payment.id}
                  className="rounded border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {formatUSD(payment.total_cents)}
                    </span>
                    <span
                      className={`rounded px-2 py-1 font-medium text-xs ${
                        payment.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : payment.status === 'failed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                  <div className="space-y-1 text-gray-600 text-sm">
                    <p>
                      <strong>Payment ID:</strong> {payment.id}
                    </p>
                    <p>
                      <strong>Stripe Payment Intent:</strong>{' '}
                      {payment.stripe_payment_intent_id}
                    </p>
                    <p>
                      <strong>Created:</strong>{' '}
                      {new Date(payment.created_at).toLocaleString()}
                    </p>
                    <p>
                      <strong>Paid:</strong>{' '}
                      {new Date(payment.paid_at ?? '').toLocaleString()}
                    </p>
                    <p>
                      <strong>Currency:</strong>{' '}
                      {payment.currency.toUpperCase()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Section>
      </div>

      <OrderActionModal
        title="Mark Order as Shipped"
        description="This will update the order status to 'shipped'. Optionally provide a tracking link that will be emailed to the customer."
        open={shippedModalOpen}
        onConfirm={handleMarkAsShipped}
        onClose={() => {
          setShippedModalOpen(false);
          setActionError(null);
        }}
        showTrackingInput
        error={actionError}
      />

      <OrderActionModal
        title="Mark Order as Delivered"
        description="This will mark the order as completed. This action confirms the customer has received their order."
        open={deliveredModalOpen}
        onConfirm={handleMarkAsDelivered}
        onClose={() => {
          setDeliveredModalOpen(false);
          setActionError(null);
        }}
        error={actionError}
      />
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h2 className="mb-4 font-bold text-gray-900 text-xl">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
      <dt className="w-48 font-medium text-gray-700 text-sm">{label}</dt>
      <dd className="text-gray-900 text-sm">{value}</dd>
    </div>
  );
};
