"use client"
import Footer from "@/components/layout/Footer";
import { OrderSummary } from "@/components/orders/shared/PaymentStatusCard";
import CountdownTimer from "@/components/payments/CountDownPayment";
import { ComparationCardPayment, PaymentGuideLinePayment, RejectedCardPayment } from "@/components/payments/PaymentAlertCard";
import ConfirmationPage from "@/components/payments/PaymentConfirmationStep";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderPayments } from "@/features/order/hooks";
import { Clock, Hash } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";


export default function PaymentStatusPage() {

    const { id } = useParams<{ id: string }>()

    const { data, isLoading } = useGetOrderPayments(id)

    const order = data?.data;

    const router = useRouter()

    if (!isLoading && order?.payment && order?.payment.status != "rejected") return notFound()

    return (
        <div className="w-full bg-[var(--cream)] min-h-screen">
            <Navbar withMenu={false} />
            <Breadcrumb breadcrumbs={[
                { name: "Beranda", link: "/" },
                { name: "Pesanan", link: "/pesanan" },
                { name: "Status Pesanan", link: `/pembayaran/${id}/status` },
                { name: 'Upload Ulang', active: true }
            ]} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">

                    {!order || isLoading ? (
                        <SkeletonPage />
                    ) : (
                        <div className="space-y-4">
                            <RejectedCardPayment reason={order.payment && order.payment.rejection_reason ? order.payment.rejection_reason : ''} />

                            {/* Order Info Card */}
                            <div className="bg-white rounded-[24px] shadow-md border border-[var(--cream-dark)] overflow-hidden">
                                <div className="bg-gradient-to-r from-[var(--terracotta)] to-[var(--terracotta-dark)] p-6 text-white">
                                    <h3 className="text-base font-bold mb-1">Upload Ulang Bukti Pembayaran</h3>
                                    <div className="flex items-center gap-1.5 text-white/80 text-sm">
                                        <Hash className="w-3.5 h-3.5" />
                                        <span>Pesanan <span className="font-semibold text-white">#{order.order_number}</span></span>
                                    </div>
                                </div>

                                <div className="p-5">
                                    {/* Countdown */}
                                    <div className="flex items-center justify-between bg-[var(--cream)] border border-[var(--saffron)]/30 rounded-xl px-4 py-3 mb-4 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 bg-[var(--saffron)]/10 rounded-xl flex items-center justify-center">
                                                <Clock className="w-4 h-4 text-[var(--saffron)]" />
                                            </div>
                                            <span className="text-[var(--text-secondary)] text-sm font-semibold">Selesaikan sebelum:</span>
                                        </div>
                                        <CountdownTimer targetDate={order.payment_due_at} />
                                    </div>

                                    {/* Order Summary */}
                                    <OrderSummary order={order} />
                                </div>
                            </div>

                            <PaymentGuideLinePayment />

                            {order.payment_status === "rejected" && order.status !== "expired" && (
                                <>
                                    <ConfirmationPage backToPayment={() => router.push(`/pembayaran/${id}/status`)} order={order} id={id} currentStep={"payment"} />
                                    <ComparationCardPayment />
                                </>
                            )}
                        </div>
                    )}

                </div>
            </div>

            <AnimatedWrapper className="mt-15" >
                <Footer />
            </AnimatedWrapper>
        </div>
    )
}




const SkeletonPage = () => {
    return (
        <div className="space-y-4">
            {/* rejected card */}
            <div className="bg-red-50 rounded-2xl border border-red-200 p-5">
                <div className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[55%]" />
                        <Skeleton className="h-3 w-[80%]" />
                        <Skeleton className="h-3 w-[65%]" />
                    </div>
                </div>
            </div>

            {/* order info card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-100 p-5">
                    <Skeleton className="h-5 w-[45%] mb-2" />
                    <Skeleton className="h-4 w-[30%]" />
                </div>
                <div className="p-5 space-y-4">
                    <Skeleton className="h-12 w-full rounded-xl" />
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <Skeleton className="h-4 w-[25%]" />
                        {Array(2).fill(null).map((_, i) => (
                            <div key={i} className="flex justify-between">
                                <Skeleton className="h-4 w-[40%]" />
                                <Skeleton className="h-4 w-[20%]" />
                            </div>
                        ))}
                        <div className="border-t border-gray-200 pt-2 flex justify-between">
                            <Skeleton className="h-5 w-[15%]" />
                            <Skeleton className="h-5 w-[25%]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* guideline */}
            <div className="bg-blue-50 rounded-2xl border border-blue-200 p-5">
                <div className="flex items-start gap-3">
                    <Skeleton className="h-9 w-9 rounded-xl flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-[40%]" />
                        {Array(4).fill(null).map((_, i) => (
                            <Skeleton key={i} className="h-3 w-full" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}