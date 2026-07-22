"use client"
import { Footer } from "@/components/shared/Footer";
import ConfirmationPage from "@/components/payments/PaymentConfirmationStep";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderPayments } from "@/features/order/hooks";
import { notFound, useParams, useRouter } from "next/navigation";

export default function PaymentStatusPage() {
    const { id } = useParams<{ id: string }>()
    const { data, isLoading } = useGetOrderPayments(id)
    const order = data?.data;
    const router = useRouter()

    if (!isLoading) {
        if (!order) return notFound();
        if (order.payment_status !== "rejected" || order.status === "expired") {
            return notFound();
        }
    }

    return (
        <div className="cart-page-wrapper">
            <Navbar withMenu={false} />
            <Breadcrumb breadcrumbs={[
                { name: "Beranda", link: "/" },
                { name: "Pesanan", link: "/pesanan" },
                { name: "Status Pesanan", link: `/pembayaran/${id}/status` },
                { name: 'Upload Ulang', active: true }
            ]} />
            <div className="cart-main-container">
                {/* Page Header */}
                <div style={{ marginBottom: 32 }}>
                    <h1 className="cart-header-title">Upload Ulang Bukti Pembayaran</h1>
                    <p className="cart-header-subtitle">
                        Silakan perbaiki data pembayaran dan unggah kembali bukti transfer yang valid agar pesanan Anda dapat diproses.
                    </p>
                </div>

                {!order || isLoading ? (
                    <SkeletonPage />
                ) : (
                    <ConfirmationPage 
                        backToPayment={() => router.push(`/pembayaran/${id}/status`)} 
                        order={order} 
                        id={id} 
                        currentStep={"confirmation"} 
                        rejectionReason={order.payment && order.payment.rejection_reason ? order.payment.rejection_reason : "Bukti pembayaran tidak jelas/tidak sesuai."}
                    />
                )}
            </div>

            <AnimatedWrapper className="mt-15" >
                <Footer />
            </AnimatedWrapper>
        </div>
    )
}

const SkeletonPage = () => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-7 space-y-6">
                {/* step indicator skeleton */}
                <div className="bg-white rounded-[24px] border border-[var(--cream-dark)] p-6 shadow-sm">
                    <Skeleton className="h-10 w-full rounded-xl" />
                </div>
                {/* form card skeleton */}
                <div className="bg-white rounded-[24px] border border-[var(--cream-dark)] p-6 shadow-sm space-y-6">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-32 w-full rounded-xl" />
                    <div className="space-y-3">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white rounded-[24px] border border-[var(--cream-dark)] p-6 shadow-sm space-y-4">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-20 w-full rounded-xl" />
                    <Skeleton className="h-10 w-full" />
                </div>
            </div>
        </div>
    )
}