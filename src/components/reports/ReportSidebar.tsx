import { Report, StatusReport } from "@/types"
import { statusStyles } from "./ReportItemCard"
import { formatDate } from "@/lib/format-date"
import Link from "next/link"

const CONTACT = {
    cs: "+62 895-3590-45706",
    wa: "+62 895-3590-45706",
    // email: "support@slemanmart.com"
}



interface Props {
    report: Report
}
export default function ReportSidebar({ report }: Props) {
    return (
        <div className="space-y-6">
            {/* <!-- Report Info --> */}
            <ReportInfo
                category={report.category}
                created_at={report.created_at}
                updated_at={report.updated_at}
                ticket_number={report.ticket_number}
                status={report.status}
            />
            {/* <!-- Contact Support --> */}
            <ContactSupport />
        </div>
    )
}

const ReportInfo = (
    {
        ticket_number,
        status,
        category,
        created_at,
        updated_at
    }: {
        category: string
        ticket_number: string
        status: StatusReport
        updated_at: string
        created_at: string
    }
) => {
    const currentStatus = statusStyles[status];
    //   const Icon = currentStatus.icon;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Informasi Laporan
            </h3>
            <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Nomor Tiket:</span>
                    <span className="font-medium">#{ticket_number}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Status:</span>
                    <span
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                    >
                        {currentStatus.label}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Kategori:</span>
                    <span className="font-medium capitalize">{category}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Dibuat:</span>
                    <span className="font-medium">{formatDate(created_at)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Update Terakhir:</span>
                    <span className="font-medium">{formatDate(updated_at)}</span>
                </div>
            </div>
        </div>
    )
}


const ContactSupport = () => {
    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Kontak Support
            </h3>
            <div className="space-y-3">
                <div className="flex items-center space-x-3">
                    <i className="fas fa-phone text-green-600"></i>
                    <div>
                        <div className="font-medium text-gray-800">Customer Service</div>
                        <div className="text-sm text-gray-600">{CONTACT.cs}</div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <i className="fab fa-whatsapp text-green-600"></i>
                    <div>
                        <div className="font-medium text-gray-800">WhatsApp</div>
                        <Link target="_blank" className="hover:cursor-pointer" 
                            href={`https://wa.me/${CONTACT.wa.replace(/[+\-\s]/g, '')}?text=Halo%2C%20saya%20butuh%20bantuan%20terkait%20layanan%20Slemanmart.`}>
                        <div className="text-sm text-gray-600">{CONTACT.wa}</div>
                        </Link>
                    </div>
                </div>
                {/* <div className="flex items-center space-x-3">
                    <i className="fas fa-envelope text-blue-600"></i>
                    <div>
                        <div className="font-medium text-gray-800">Email</div>
                        <div className="text-sm text-gray-600">
                            {CONTACT.email}
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}


export function ReportSidebarSkeleton() {
    return (
        <div className="space-y-6">
            {/* <!-- Report Info Skeleton --> */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3 text-sm">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* <!-- Contact Support Skeleton --> */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                            <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="flex-1 space-y-1">
                                <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}