import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format-date';
import { Order } from '@/types';
import { getCourierDisplayName } from '@/lib/shipping-helper';

interface TimelineEvent {
  title: string;
  description?: string | null;
  timestamp: string;
  icon: string;
  status: 'completed' | 'failed' | 'inProgress';
}

type OrderTimelineProps = {
  order: Order;
  defaultOpen?: boolean;
};

export function OrderTimeline({ order, defaultOpen = false }: OrderTimelineProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const events: TimelineEvent[] = [];

  const isCod =
    order.payment_method === 'cash_on_delivery' ||
    order.payment_method === 'cod' ||
    order.shipping_service?.toLowerCase() === 'cod' ||
    order.estimated_delivery?.toLowerCase().includes('cod');

  // 1. Pesanan Dibuat
  events.push({
    title: 'Pesanan Dibuat',
    timestamp: order.created_at,
    icon: 'fas fa-box-open',
    status: 'completed',
  });

  // 2. Pembayaran / COD
  if (isCod) {
    events.push({
      title: 'Metode Bayar di Tempat (COD)',
      description: 'Pesanan akan dibayar tunai langsung saat kurir/penjual tiba di alamat tujuan.',
      timestamp: order.created_at,
      icon: 'fas fa-hand-holding-usd',
      status: 'completed',
    });
  } else if (order.payment) {
    // Pembayaran manual transfer
    events.push({
      title: 'Pembayaran Diajukan',
      description: `Pengirim: ${order.payment.sender_name}`,
      timestamp: order.payment.created_at,
      icon: 'fas fa-credit-card',
      status: 'completed',
    });

    if (order.payment.verified_at) {
      if (order.payment.status === 'rejected') {
        events.push({
          title: 'Pembayaran Ditolak',
          description: `Alasan: ${order.payment.rejection_reason}`,
          timestamp: order.payment.verified_at,
          icon: 'fas fa-times-circle',
          status: 'failed',
        });
      } else if (order.payment.status === 'verified') {
        events.push({
          title: 'Pembayaran Diterima',
          description: `Diverifikasi oleh: ${order.payment.verified_by_name}`,
          timestamp: order.payment.verified_at,
          icon: 'fas fa-check-circle',
          status: 'completed',
        });
      }
    } else {
      events.push({
        title: 'Menunggu Verifikasi',
        description: 'Pembayaran Anda sedang kami periksa.',
        timestamp: order.payment.created_at,
        icon: 'fas fa-hourglass-half',
        status: 'inProgress',
      });
    }
  } else if (order.paid_at || order.is_order_paid || order.payment_status === 'paid') {
    // Pembayaran otomatis via QRIS Bank BPD DIY
    events.push({
      title: 'Pembayaran Terverifikasi',
      description: 'Pembayaran tagihan pesanan telah berhasil diverifikasi oleh sistem.',
      timestamp: order.paid_at || order.created_at,
      icon: 'fas fa-check-circle',
      status: 'completed',
    });
  }

  // 3. Pesanan Diproses oleh Toko
  if (order.status === 'processing') {
    events.push({
      title: 'Pesanan Diproses',
      description: 'Penjual sedang memproses dan menyiapkan produk Anda.',
      timestamp: order.paid_at || order.payment?.verified_at || order.created_at,
      icon: 'fas fa-hourglass-half',
      status: 'inProgress',
    });
  } else if (['shipped', 'delivered', 'completed'].includes(order.status)) {
    events.push({
      title: 'Pesanan Telah Diproses',
      description: 'Penjual telah selesai menyiapkan dan mengemas produk.',
      timestamp: order.paid_at || order.payment?.verified_at || order.created_at,
      icon: 'fas fa-check-circle',
      status: 'completed',
    });
  }

  // 4. Pesanan Dikirim
  if (order.shipped_at) {
    const courier = getCourierDisplayName(order.shipping_service);
    events.push({
      title: 'Pesanan Dikirim',
      description: `Kurir: ${courier}${order.shipping_service_type ? ` (${order.shipping_service_type})` : ''}` +
        (order.tracking_number ? ` • Resi: ${order.tracking_number}` : ''),
      timestamp: order.shipped_at,
      icon: 'fas fa-truck',
      status: 'completed',
    });
  }

  // 5. Pesanan Terkirim
  if (order.delivered_at) {
    events.push({
      title: 'Pesanan Terkirim',
      description: 'Pesanan telah sampai di lokasi tujuan pengiriman.',
      timestamp: order.delivered_at,
      icon: 'fas fa-check-circle',
      status: 'completed',
    });
  }

  // 6. Pesanan Selesai
  if (order.status === 'completed') {
    events.push({
      title: 'Pesanan Selesai',
      description: 'Transaksi selesai. Terima kasih sudah berbelanja!',
      timestamp: order.delivered_at || order.shipped_at || order.created_at,
      icon: 'fas fa-check-double',
      status: 'completed',
    });
  }

  // 7. Pesanan Dibatalkan
  if (order.cancelled_at || order.status === 'cancelled') {
    events.push({
      title: 'Pesanan Dibatalkan',
      description: order.cancellation_reason ? `Alasan: ${order.cancellation_reason}` : 'Pesanan dibatalkan.',
      timestamp: order.cancelled_at || order.created_at,
      icon: 'fas fa-times-circle',
      status: 'failed',
    });
  }

  // 8. Pesanan Kadaluarsa
  if (order.status === 'expired') {
    events.push({
      title: 'Pesanan Kadaluarsa',
      description: 'Batas waktu pembayaran pesanan telah habis.',
      timestamp: order.expired_at || order.created_at,
      icon: 'fas fa-times-circle',
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

  const latestEvent = events.length > 0 ? events[events.length - 1] : null;

  return (
    <div className="bg-white border-[1.5px] border-[var(--cream-dark)] rounded-[var(--radius-md)] overflow-hidden shadow-sm transition-all duration-300" style={{ marginBottom: "5px" }}>
      {/* Accordion Trigger Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between text-left hover:bg-[var(--cream)]/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-[var(--terracotta)]/10 text-[var(--terracotta)] flex items-center justify-center text-sm flex-shrink-0">
            <i className="fas fa-history"></i>
          </div>
          <div className="min-w-0">
            <h4 className="text-sm font-extrabold text-[var(--text-primary)] flex items-center gap-2 flex-wrap">
              <span>Riwayat Status Pesanan</span>
              {latestEvent && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--cream)] text-[var(--text-secondary)] border border-[var(--cream-dark)] truncate max-w-[180px]">
                  {latestEvent.title}
                </span>
              )}
            </h4>
            <p className="text-xs text-[var(--text-muted)] font-medium truncate mt-0.5">
              {isOpen
                ? "Klik untuk menutup riwayat status"
                : latestEvent
                ? `Terakhir: ${latestEvent.title} • ${formatDate(latestEvent.timestamp)}`
                : "Klik untuk melihat linimasa status pesanan"}
            </p>
          </div>
        </div>
        <i
          className={`fas fa-chevron-down text-sm text-[var(--text-muted)] transition-transform duration-300 ml-2 flex-shrink-0 ${
            isOpen ? "transform rotate-180" : ""
          }`}
        ></i>
      </button>

      {/* Accordion Collapsible Content */}
      {isOpen && (
        <div className="p-4 pt-1 border-t border-[var(--cream-dark)]/50">
          <ol className="relative border-l-2 border-[var(--cream-dark)] ml-4 mt-2">
            {events.map((event, index) => {
              const cfg = statusConfig[event.status];
              return (
                <li key={index} className="relative pl-8 pb-6 last:pb-0">
                  <span
                    className={cn(
                      "absolute -left-4 top-0.5 flex items-center justify-center w-8 h-8 rounded-full border border-white ring-4 z-10 shadow-xs",
                      cfg.bg,
                      cfg.ring
                    )}
                  >
                    <i className={cn(event.icon, cfg.icon, "text-xs")} />
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
      )}
    </div>
  );
}