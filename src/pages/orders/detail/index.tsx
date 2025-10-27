import { useNavigate, useParams } from 'react-router';
import { Breadcrumbs } from '~/components/Breadcrumbs';
import { usePageData } from '~/hooks/usePageData';
import { formatUSD, isUuid } from '~/utils/format';
import { OrderEndpoint } from '../api';

export const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id || !isUuid(id)) {
    navigate('/404');
    return null;
  }

  const {
    data: order,
    loading,
    error,
  } = usePageData(() => OrderEndpoint.get(id), [id]);

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

  if (error || !order) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded border border-red-200 bg-red-50 p-4 text-red-800">
          Error loading order: {error?.message || 'Not found'}
        </div>
      </div>
    );
  }

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
            value={new Date(order.createdAt).toLocaleString()}
          />
          {order.stripeSessionId && (
            <InfoRow label="Stripe Session ID" value={order.stripeSessionId} />
          )}
        </Section>

        <Section title="Customer & Shipping">
          <InfoRow label="Name" value={order.shippingDetail.name} />
          <InfoRow label="Email" value={order.shippingDetail.email} />
          <InfoRow label="Address Line 1" value={order.shippingDetail.line1} />
          {order.shippingDetail.line2 && (
            <InfoRow
              label="Address Line 2"
              value={order.shippingDetail.line2}
            />
          )}
          <InfoRow label="City" value={order.shippingDetail.city} />
          <InfoRow label="State" value={order.shippingDetail.state} />
          <InfoRow label="Postal Code" value={order.shippingDetail.postal} />
          <InfoRow label="Country" value={order.shippingDetail.country} />
        </Section>

        <Section title="Payment Totals">
          <InfoRow
            label="Subtotal"
            value={formatUSD(order.paymentRequirement.subtotalCents)}
          />
          <InfoRow
            label="Shipping"
            value={formatUSD(order.paymentRequirement.shippingCents)}
          />
          <InfoRow
            label="Total"
            value={
              <span className="font-bold text-lg">
                {formatUSD(order.paymentRequirement.totalCents)}
              </span>
            }
          />
          <InfoRow
            label="Currency"
            value={order.paymentRequirement.currency.toUpperCase()}
          />
        </Section>

        <Section title="Payments">
          {order.payments.length === 0 ? (
            <p className="text-gray-600 text-sm">No payments recorded</p>
          ) : (
            <div className="space-y-4">
              {order.payments.map((payment) => (
                <div
                  key={payment.id}
                  className="rounded border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {formatUSD(payment.totalCents)}
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
                      {payment.stripePaymentIntentId}
                    </p>
                    <p>
                      <strong>Created:</strong>{' '}
                      {new Date(payment.createdAt).toLocaleString()}
                    </p>
                    <p>
                      <strong>Paid:</strong>{' '}
                      {new Date(payment.paidAt).toLocaleString()}
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
