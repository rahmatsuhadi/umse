import Link from 'next/link';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/format-date';
import { Briefcase, CheckCircle2, Clock, Hourglass, MailQuestion, MessageSquare, XCircle } from 'lucide-react';

// Tipe untuk data satu laporan (sesuaikan dengan API Anda)
export type Report = {
  id: string;
  ticketNumber: string;
  title: string;
  category: string;
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  assignedTo: string;
};

// Objek untuk styling status agar lebih dinamis
const statusStyles = {
  open: { label: 'Terbuka', icon: MailQuestion, color: 'blue' },
  'in-progress': { label: 'Sedang Diproses', icon: Hourglass, color: 'yellow' },
  waiting: { label: 'Menunggu Respon', icon: MessageSquare, color: 'cyan' },
  resolved: { label: 'Selesai', icon: CheckCircle2, color: 'green' },
  closed: { label: 'Ditutup', icon: XCircle, color: 'red' },
};

type ReportItemCardProps = {
  report: Report;
};

export default function ReportItemCard({ report }: ReportItemCardProps) {
  const currentStatus = statusStyles[report.status];
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
                <span className="text-sm font-mono text-slate-500">{report.ticketNumber}</span>
                <span className={cn(
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    `bg-${currentStatus.color}-100 text-${currentStatus.color}-800`
                  )}>
                  {currentStatus.label}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">{report.title}</h3>
              <p className="text-gray-600 mb-2 text-sm">Kategori: {report.category}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
                <span className="flex items-center"><Clock size={14} className="mr-1.5" />Dibuat: {formatDate(report.createdAt)}</span>
                <span className="flex items-center"><Briefcase size={14} className="mr-1.5" />Ditangani: {report.assignedTo}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center self-end lg:self-center">
          <Link href={`/laporan/${report.id}?ticket=${report.ticketNumber}`}
            className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-300 text-sm font-semibold">
            Lihat Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
