import React from 'react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format-date';
import { Order } from '@/types';
import { CheckCircle2, XCircle, Hourglass, PackageCheck, History } from 'lucide-react';

interface TimelineEvent {
  title: string;
  description?: string | null;
  timestamp: string;
  icon: React.ElementType;
  status: 'completed' | 'failed' | 'inProgress';
}

type OrderTimelineProps = {
  order: Order;
};

export function OrderTimeline({ order }: OrderTimelineProps) {
  const events: TimelineEvent[] = [];

  events.push({
    title: 'Pesanan Dibuat',
    timestamp: order.created_at,
    icon: PackageCheck,
    status: 'completed',
  });

  if (order.payment) {
    events.push({
      title: 'Pembayaran Diajukan',
      description: `Pengirim: ${order.payment.sender_name}`,
      timestamp: order.payment.created_at,
      icon: Hourglass,
      status: 'completed',
    });

    if (order.payment.verified_at) {
      if (order.payment.status === 'rejected') {
        events.push({
          title: 'Pembayaran Ditolak',
          description: `Alasan: ${order.payment.rejection_reason}`,
          timestamp: order.payment.verified_at,
          icon: XCircle,
          status: 'failed',
        });
      } else if (order.payment.status === 'verified') {
        events.push({
          title: 'Pembayaran Diterima',
          description: `Diverifikasi oleh: ${order.payment.verified_by_name}`,
          timestamp: order.payment.verified_at,
          icon: CheckCircle2,
          status: 'completed',
        });
      }
    } else {
      events.push({
        title: 'Menunggu Verifikasi',
        description: 'Pembayaran Anda sedang kami periksa.',
        timestamp: order.payment.created_at,
        icon: Hourglass,
        status: 'inProgress',
      });
    }
  }

  const statusConfig = {
    completed: {
      bg: 'bg-emerald-100',
      ring: 'ring-emerald-50',
      icon: 'text-emerald-600',
      dot: 'bg-emerald-500',
    },
    failed: {
      bg: 'bg-red-100',
      ring: 'ring-red-50',
      icon: 'text-red-600',
      dot: 'bg-red-500',
    },
    inProgress: {
      bg: 'bg-amber-100',
      ring: 'ring-amber-50',
      icon: 'text-amber-600',
      dot: 'bg-amber-500',
    },
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-gray-100 rounded-xl flex items-center justify-center">
          <History className="w-4 h-4 text-gray-500" />
        </div>
        <h3 className="text-base font-bold text-gray-800">Riwayat Pesanan</h3>
      </div>

      <ol className="relative border-l-2 border-gray-100 ml-4 space-y-6">
        {events.map((event, index) => {
          const cfg = statusConfig[event.status];
          const Icon = event.icon;
          return (
            <li key={index} className="ml-6">
              <span
                className={cn(
                  "absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full ring-4",
                  cfg.bg,
                  cfg.ring
                )}
              >
                <Icon className={cn("w-4 h-4", cfg.icon)} />
              </span>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
                <div>
                  <h4 className="font-semibold text-gray-800 text-sm">{event.title}</h4>
                  {event.description && (
                    <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
                  )}
                </div>
                <time className="text-xs text-gray-400 whitespace-nowrap sm:ml-4 flex-shrink-0">
                  {formatDate(event.timestamp)}
                </time>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}