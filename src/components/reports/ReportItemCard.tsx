import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format-date';
import { Briefcase, CheckCircle2, Clock, Hourglass, MailQuestion, MessageSquare, XCircle } from 'lucide-react';
import { Report } from '@/types';

// Objek untuk styling status agar lebih dinamis
export const statusStyles = {
  open: { label: 'Terbuka', icon: MailQuestion, color: 'blue' },
  pending: { label: 'Menunggu Respon', icon: MessageSquare, color: 'cyan' },
  'in_progress': { label: 'Sedang Diproses', icon: Hourglass, color: 'yellow' },
  resolved: { label: 'Selesai', icon: CheckCircle2, color: 'green' },
  closed: { label: 'Ditutup', icon: XCircle, color: 'red' },
};


type ReportItemCardProps = {
  report: Report;
};

export default function ReportItemCard({ report }: ReportItemCardProps) {
  const currentStatus = statusStyles[report.status] ;
  const Icon = currentStatus.icon;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className={cn(
                  `w-12 h-12 rounded-lg flex items-center justify-center`,
                  `bg-${currentStatus.color}-100`
                )}>
                <Icon className={cn(`text-${currentStatus.color}-600`)} size={24} />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                <span className="text-sm font-mono text-slate-500">{report.ticket_number}</span>
                <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    `bg-${currentStatus.color}-100 text-${currentStatus.color}-800`
                  )}>
                  {currentStatus.label}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{report.title}</h3>
              <p className="text-gray-600 mb-2 text-sm capitalize">Kategori: {report.category}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="flex items-center"><Clock size={14} className="mr-1.5" />Dibuat: {formatDate(report.created_at)}</span>
                {report.status=="in_progress" && (
                  <span className="flex items-center"><Briefcase size={14} className="mr-1.5" />Ditangani: {formatDate(report.updated_at)}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center self-end lg:self-center">
          <Link href={`/laporan/${report.id}?ticket=${report.ticket_number}`}
            className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 text-sm font-semibold">
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}



export function ReportItemCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            {/* Icon Box */}
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-slate-200" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {/* Ticket & Status */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-5 w-20 bg-slate-200 rounded-full" />
              </div>

              {/* Title */}
              <div className="h-5 w-40 bg-slate-200 rounded mb-2" />

              {/* Category */}
              <div className="h-4 w-28 bg-slate-200 rounded mb-2" />

              {/* Dates */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                <div className="h-4 w-32 bg-slate-200 rounded" />
                <div className="h-4 w-28 bg-slate-200 rounded" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center self-end lg:self-center">
          <div className="h-9 w-28 bg-slate-200 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

