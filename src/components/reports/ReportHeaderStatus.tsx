import { StatusReport } from "@/types";
import { statusStyles } from "./ReportItemCard";
import { formatDate } from "@/lib/format-date";

interface ReportHeaderProps{
    ticket_number:string
    status: StatusReport
    title:string
    created_at:string
    category:string
}

export default function ReportHeaderStatus(report: ReportHeaderProps) {

      const currentStatus = statusStyles[report.status] ;
      const Icon = currentStatus.icon;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div
                className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0"
            >
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <span className="text-lg font-mono text-gray-600">#{report.ticket_number}</span>
                        <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800"
                        >
                            {currentStatus.label}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                       {report.title}
                    </h1>
                    <p className="text-gray-600 capitalize">
                      {`Kategori: ${report.category} • Dibuat ${formatDate(report.created_at)}`}
                    </p>
                </div>
            </div>
        </div>
    )
}



export function ReportHeaderStatusSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse w-full ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div>
          {/* Ticket number + badge */}
          <div className="flex items-center space-x-3 mb-2">
            <div className="h-5 w-28 bg-gray-200 rounded"></div>
            <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
          </div>

          {/* Title */}
          <div className="h-7 w-64 bg-gray-200 rounded mb-2"></div>

          {/* Sub info (kategori + waktu) */}
          <div className="h-4 w-52 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
