import React from 'react';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format-date'; // Pastikan path ini benar
import { Order } from '@/types'; // Pastikan path ini benar
import { CheckCircle2, XCircle, Hourglass, PackageCheck } from 'lucide-react';

// Definisikan tipe untuk setiap event di timeline
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
  // 1. Membangun daftar event secara dinamis dari data order
  const events: TimelineEvent[] = [];

  // Event: Pesanan Dibuat (selalu ada)
  events.push({
    title: 'Pesanan Dibuat',
    timestamp: order.created_at,
    icon: PackageCheck,
    status: 'completed',
  });

  // Cek jika ada data pembayaran
  if (order.payment) {
    // Event: Pembayaran Diajukan
    events.push({
      title: 'Pembayaran Diajukan',
      description: `Pengirim: ${order.payment.sender_name}`,
      timestamp: order.payment.created_at,
      icon: Hourglass,
      status: 'completed',
    });

    // Event: Hasil Verifikasi (Diterima atau Ditolak)
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
        // Jika pembayaran sudah diajukan tapi belum diverifikasi
        events.push({
            title: 'Menunggu Verifikasi',
            description: 'Pembayaran Anda sedang kami periksa.',
            timestamp: order.payment.created_at, // Gunakan waktu submit sebagai acuan
            icon: Hourglass,
            status: 'inProgress',
        });
    }
  }

  // 2. Render komponen
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Riwayat Pesanan</h3>
      <ol className="relative border-l border-gray-200 dark:border-gray-700 ml-3">
        {events.map((event, index) => (
          <li key={index} className="mb-8 ml-8">
            <span
              className={cn(
                "absolute -left-4 flex items-center justify-center w-8 h-8 rounded-full ring-8 ring-white dark:ring-gray-900",
                event.status === 'completed' && "bg-green-100 dark:bg-green-900",
                event.status === 'failed' && "bg-red-100 dark:bg-red-900",
                event.status === 'inProgress' && "bg-yellow-100 dark:bg-yellow-900",
              )}
            >
              <event.icon
                className={cn(
                  "w-4 h-4",
                  event.status === 'completed' && "text-green-600 dark:text-green-400",
                  event.status === 'failed' && "text-red-600 dark:text-red-400",
                  event.status === 'inProgress' && "text-yellow-600 dark:text-yellow-400",
                )}
              />
            </span>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between'>
              <h4 className="font-semibold text-gray-900 dark:text-white">{event.title}</h4>
              <time className="block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500 sm:mb-0">
                {formatDate(event.timestamp)}
              </time>
            </div>
            {event.description && (
              <p className="text-sm font-normal text-gray-500 dark:text-gray-400">{event.description}</p>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}