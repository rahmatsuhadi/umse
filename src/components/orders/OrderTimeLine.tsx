import React from 'react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format-date';
import { Order } from '@/types';
import { CheckCircle2, XCircle, Hourglass, PackageCheck, History, Truck } from 'lucide-react';

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

  // 1. Pesanan Dibuat
  events.push({
    title: 'Pesanan Dibuat',
    timestamp: order.created_at,
    icon: PackageCheck,
    status: 'completed',
  });

  // 2. Pembayaran Diajukan
  if (order.payment) {
    events.push({
      title: 'Pembayaran Diajukan',
      description: `Pengirim: ${order.payment.sender_name}`,
      timestamp: order.payment.created_at,
      icon: Hourglass,
      status: 'completed',
    });

    // 3. Status Verifikasi Pembayaran
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

  // 4. Pesanan Diproses oleh Toko
  if (order.status === 'processing') {
    events.push({
      title: 'Pesanan Diproses',
      description: 'Penjual sedang memproses dan menyiapkan produk Anda.',
      timestamp: order.payment?.verified_at || order.created_at,
      icon: Hourglass,
      status: 'inProgress',
    });
  }

  // 5. Pesanan Dikirim
  if (order.shipped_at) {
    events.push({
      title: 'Pesanan Dikirim',
      description: `Kurir: ${order.shipping_service?.toUpperCase()} (${order.shipping_service_type})` + (order.tracking_number ? ` - Resi: ${order.tracking_number}` : ''),
      timestamp: order.shipped_at,
      icon: Truck,
      status: 'completed',
    });
  }

  // 6. Pesanan Terkirim
  if (order.delivered_at) {
    events.push({
      title: 'Pesanan Terkirim',
      description: 'Pesanan telah sampai di lokasi tujuan pengiriman.',
      timestamp: order.delivered_at,
      icon: CheckCircle2,
      status: 'completed',
    });
  }

  // 7. Pesanan Selesai
  if (order.status === 'completed') {
    events.push({
      title: 'Pesanan Selesai',
      description: 'Transaksi selesai. Terima kasih sudah berbelanja!',
      timestamp: order.delivered_at || order.shipped_at || order.created_at,
      icon: CheckCircle2,
      status: 'completed',
    });
  }

  // 8. Pesanan Dibatalkan
  if (order.cancelled_at || order.status === 'cancelled') {
    events.push({
      title: 'Pesanan Dibatalkan',
      description: order.cancellation_reason ? `Alasan: ${order.cancellation_reason}` : 'Pesanan dibatalkan.',
      timestamp: order.cancelled_at || order.created_at,
      icon: XCircle,
      status: 'failed',
    });
  }

  // 9. Pesanan Kadaluarsa
  if (order.status === 'expired') {
    events.push({
      title: 'Pesanan Kadaluarsa',
      description: 'Batas waktu pembayaran pesanan telah habis.',
      timestamp: order.expired_at || order.created_at,
      icon: XCircle,
      status: 'failed',
    });
  }

  const statusConfig = {
    completed: {
      bg: 'bg-[#D4EFDF] border-[#27AE60]/20',
      ring: 'ring-[rgba(39,174,96,0.12)]',
      icon: 'text-[var(--forest-mid)]',
    },
    failed: {
      bg: 'bg-[#FDE8D8] border-[var(--terracotta)]/20',
      ring: 'ring-[rgba(247,98,10,0.12)]',
      icon: 'text-[var(--terracotta-dark)]',
    },
    inProgress: {
      bg: 'bg-[#FEF3D0] border-[var(--saffron)]/20',
      ring: 'ring-[rgba(245,166,35,0.12)]',
      icon: 'text-[#9B6E00]',
    },
  };

  return (
    <div className="bg-white border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-lg)] p-5 mb-4 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-2.5 mb-6">
        <div className="w-9 h-9 bg-[var(--cream)] border border-[var(--cream-dark)] rounded-[var(--radius-sm)] flex items-center justify-center shadow-xs">
          <History className="w-4 h-4 text-[var(--terracotta)]" />
        </div>
        <h3 className="text-base font-extrabold text-[var(--text-primary)]">Riwayat Pesanan</h3>
      </div>

      <ol className="relative border-l-2 border-[var(--cream-dark)] ml-4 space-y-6">
        {events.map((event, index) => {
          const cfg = statusConfig[event.status];
          const Icon = event.icon;
          return (
            <li key={index} className="ml-6">
              <span
                className={cn(
                  "absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full border border-white ring-4 z-10 shadow-xs",
                  cfg.bg,
                  cfg.ring
                )}
              >
                <Icon className={cn("w-4 h-4", cfg.icon)} />
              </span>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 bg-[var(--cream)]/40 border border-[var(--cream-dark)]/30 rounded-[var(--radius-sm)] p-3.5 hover:bg-white hover:border-[var(--terracotta-light)]/40 hover:shadow-xs transition-all duration-300">
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-[var(--text-primary)] text-sm">{event.title}</h4>
                  {event.description && (
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{event.description}</p>
                  )}
                </div>
                <time className="text-[11px] text-[var(--text-muted)] font-bold whitespace-nowrap sm:ml-4 flex-shrink-0 flex items-center gap-1 mt-0.5">
                  <i className="far fa-clock text-[var(--brown-light)]"></i> {formatDate(event.timestamp)}
                </time>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}