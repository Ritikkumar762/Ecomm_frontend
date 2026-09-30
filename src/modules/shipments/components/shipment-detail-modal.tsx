'use client';

import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/modules/orders/components/status-badge';
import { shipmentService } from '../services/shipment-service';
import { AdminShipmentDetail, ShipmentEvent, ShipmentStatus } from '../types/shipment.types';
import { ApiError } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';

export interface ShipmentDetailModalProps {
  shipmentId: string | null;
  onClose: () => void;
  onChanged: () => void;
}

/** The real transition history is `fromStatus`/`toStatus` pairs, not a human-readable string —
 * this is the one place that pair gets translated into the label a timeline reads naturally. */
function eventLabel(event: ShipmentEvent): string {
  if (event.fromStatus === null && event.toStatus === 'pending') return 'Shipment Created';
  if (event.toStatus === 'shipped') return 'Shipped';
  if (event.toStatus === 'delivered') return 'Delivered';
  return `${event.fromStatus ?? '—'} → ${event.toStatus}`;
}

export function ShipmentDetailModal({ shipmentId, onClose, onChanged }: ShipmentDetailModalProps) {
  const [shipment, setShipment] = useState<AdminShipmentDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');

  useEffect(() => {
    if (!shipmentId) return;
    setLoading(true);
    setError(null);
    shipmentService
      .getShipment(shipmentId)
      .then((data) => {
        setShipment(data);
        setCarrier(data.carrier ?? '');
        setTrackingNumber(data.trackingNumber ?? '');
        setTrackingUrl(data.trackingUrl ?? '');
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load shipment.'))
      .finally(() => setLoading(false));
  }, [shipmentId]);

  const handleSaveTracking = async () => {
    if (!shipment) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const updated = await shipmentService.updateTracking(shipment.id, {
        carrier: carrier.trim() || null,
        trackingNumber: trackingNumber.trim() || null,
        trackingUrl: trackingUrl.trim() || null,
      });
      // The endpoint returns the narrower staff shape (no orderNumber/history); merge in the
      // fields it did send rather than losing what the detail read already carries.
      setShipment({ ...shipment, ...updated });
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update tracking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTransition = async (action: 'ship' | 'deliver') => {
    if (!shipment) return;
    setIsSubmitting(true);
    setError(null);
    try {
      if (action === 'ship') await shipmentService.ship(shipment.id);
      else await shipmentService.deliver(shipment.id);
      // Re-fetch rather than merge: a real transition just happened, so the history needs the
      // new entry the ship/deliver endpoints themselves don't return.
      const refreshed = await shipmentService.getShipment(shipment.id);
      setShipment(refreshed);
      onChanged();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to update shipment status.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={!!shipmentId} onClose={onClose} title={shipment ? `Shipment for ${shipment.orderNumber}` : 'Shipment'}>
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-[#f6f9fe]" />
      ) : !shipment ? (
        <p className="text-sm text-[#7c818d]">{error || 'Shipment not found.'}</p>
      ) : (
        <div className="space-y-6">
          {error && <p className="text-xs text-[#df2e2e]">{error}</p>}

          <div className="flex items-center justify-between rounded-xl bg-[#f6f9fe] p-3">
            <StatusBadge status={shipment.status} />
            <div className="flex gap-2">
              {shipment.status === 'pending' && (
                <Button onClick={() => handleTransition('ship')} isLoading={isSubmitting} size="sm">
                  Mark as Shipped
                </Button>
              )}
              {shipment.status === 'shipped' && (
                <Button onClick={() => handleTransition('deliver')} isLoading={isSubmitting} size="sm">
                  Mark as Delivered
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7c818d]">Carrier &amp; Tracking</h4>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Courier" placeholder="e.g. Blue Dart" value={carrier} onChange={(e) => setCarrier(e.target.value)} />
              <Input
                label="Tracking Number"
                placeholder="e.g. BD660356549"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
            </div>
            <Input
              label="Tracking URL"
              placeholder="https://..."
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
            />
            <Button variant="outline" onClick={handleSaveTracking} isLoading={isSubmitting} size="sm">
              Save Tracking Info
            </Button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7c818d]">Shipment Timeline</h4>
            {shipment.history.length === 0 ? (
              <p className="text-xs text-[#adb0b8]">No transitions recorded yet.</p>
            ) : (
              <ol className="space-y-3 border-l-2 border-[#e9eaec] pl-4">
                {shipment.history.map((event, i) => (
                  <li key={i} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#2563eb]" />
                    <p className="text-sm font-medium text-[#23272f]">{eventLabel(event)}</p>
                    <p className="text-xs text-[#7c818d]">{formatDate(event.occurredAt)}</p>
                    {event.note && <p className="mt-1 text-xs text-[#727783]">"{event.note}"</p>}
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="flex justify-end border-t border-[#e9eaec] pt-4">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
