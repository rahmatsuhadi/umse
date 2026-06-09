"use client"
import { Footer } from "@/components/shared/Footer";
import { OrderTimeline } from "@/components/orders/OrderTimeLine";
import PaymentHeader from "@/components/orders/shared/PaymentHeader";
import PaymentStatusCard from "@/components/orders/shared/PaymentStatusCard";
import RejectionModal from "@/components/payments/PaymentRejectModal";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderPayments } from "@/features/order/hooks";
import { RefreshCw } from "lucide-react";
import { useParams, useRouter } from "next/navigation";



export default function PaymentStatusPage() {

    const { id } = useParams<{ id: string }>()

    const { data, isLoading } = useGetOrderPayments(id)

    const order = data?.data;

    const router = useRouter();

    return (
        <div className="cart-page-wrapper">
            <Navbar />

            <main className="cart-main-container">
                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 className="cart-header-title">
                        Status Pembayaran
                    </h1>
                    <p className="cart-header-subtitle">
                        Pantau status verifikasi pembayaran dan detail riwayat transaksi pesanan Anda di Sleman Mart.
                    </p>
                </div>

                <div className="max-w-2xl mx-auto">
                    {!order || isLoading ? (
                        <SkeletonPage />
                    ) : (
                        <>
                            <PaymentHeader orderId={order.order_number} date={order.payment ? order.payment.created_at : null} />
                            <PaymentStatusCard status={{ status: order.payment_status, label: order.status_label }}
                                order={order} />

                            <OrderTimeline order={order} />

                            {order.payment && order.payment.status == "rejected" && (
                                <div className="cart-sidebar-panel bg-white p-6 mt-4">
                                    <p className="text-sm text-[var(--text-secondary)] font-medium mb-4">Bukti pembayaran Anda ditolak. Silakan upload ulang atau lihat alasan penolakan.</p>
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <RejectionModal
                                            reason={order.payment.rejection_reason ?? ''}
                                            onUploadAgain={() => router.replace(`/pembayaran/${order.id}/upload-ulang`)}
                                        />
                                        <Button
                                            onClick={() => router.replace(`/pembayaran/${order.id}/upload-ulang`)}
                                            className="btn btn-primary"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Ulangi Pembayaran
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    )
}




const SkeletonPage = () => {
    return (
        <div className="space-y-4">
            {/* payment header */}
            <div className="bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] border border-[var(--cream-dark)] p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="w-full space-y-2">
                        <Skeleton className="h-5 w-[40%]" />
                        <Skeleton className="h-4 w-[30%]" />
                    </div>
                    <Skeleton className="h-8 w-32 rounded-[var(--radius-sm)]" />
                </div>
            </div>

            {/* status card */}
            <div className="bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] border border-[var(--cream-dark)] overflow-hidden">
                <div className="p-5 border-b border-[var(--cream-dark)]/30">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-[var(--radius-sm)]" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-5 w-[35%]" />
                            <Skeleton className="h-4 w-[55%]" />
                        </div>
                    </div>
                </div>
                <div className="p-5">
                    <div className="bg-[var(--cream)] rounded-[var(--radius-sm)] border border-[var(--cream-dark)]/50 p-4 space-y-3">
                        <Skeleton className="h-4 w-[25%]" />
                        {Array(2).fill(null).map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <Skeleton className="h-4 w-[40%]" />
                                <Skeleton className="h-4 w-[20%]" />
                            </div>
                        ))}
                        <div className="border-t border-[var(--cream-dark)] pt-2 flex justify-between">
                            <Skeleton className="h-5 w-[15%]" />
                            <Skeleton className="h-5 w-[25%]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* timeline */}
            <div className="bg-white rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] border border-[var(--cream-dark)] p-5">
                <div className="flex items-center gap-2 mb-5">
                    <Skeleton className="h-8 w-8 rounded-[var(--radius-sm)]" />
                    <Skeleton className="h-5 w-32" />
                </div>
                <div className="space-y-6 ml-4">
                    {Array(2).fill(null).map((_, i) => (
                        <div key={i} className="ml-6 flex justify-between">
                            <div className="space-y-1.5">
                                <Skeleton className="h-4 w-36" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                            <Skeleton className="h-3 w-24" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}