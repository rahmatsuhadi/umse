"use client"
import Footer from "@/components/layout/Footer";
import { ComparationCardPayment, PaymentGuideLinePayment, RejectedCardPayment } from "@/components/order/Payment/CardPaymentAlert";
import ConfirmationPage from "@/components/order/Payment/ConfirmationStep";
import CountdownTimer, { calculateTimeLeft } from "@/components/order/Payment/CountDownPayment";
import  { OrderSummary } from "@/components/order/shared/PaymentStatusCard";
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

    const countdown = calculateTimeLeft(order?.payment_due_at ?? new Date().toISOString())

    if (!isLoading && order?.payment && order?.payment.status != "rejected") return notFound()

    return (
        <div className=" w-full bg-gray-50">
            <Navbar withMenu={false} />
            <Breadcrumb breadcrumbs={[
                { name: "Beranda", link: "/" },
                { name: "Pesanan", link: "/pesanan" },
                { name: "Status Pesanan", link: `/pembayaran/${id}/status` },
                { name: 'Upload Ulang', active: true }
            ]} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">

                    {!order || isLoading ? (
                        <SkeletonPage />
                    ) : (
                        <>
                            <RejectedCardPayment reason={order.payment && order.payment.rejection_reason ? order.payment.rejection_reason : ''} />

                            <div className="bg-white rounded-lg shadow-md mb-6 p-6">
                                <div className="flex flex-col mb-4">
                                    <h3 className="text-xl font-bold">Upload Ulang Bukti Pembayaran</h3>
                                    <div className="my-2">
                                        <h3>Pesanan <span className="text-primary font-bold">#{order.order_number}</span></h3>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <h4>Selesaikan pembayaran sebelum</h4>
                                        <CountdownTimer targetDate={order.payment_due_at} />
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <OrderSummary order={order} />
                            </div>

                            <PaymentGuideLinePayment />
                            {order.status != "expired" || !!!countdown && (
                                <>
                                    <ConfirmationPage backToPayment={() => router.push(`/pembayaran/${id}/status`)} paidTotal={order.total.value} id={id} currentStep={"payment"} />
                                    <ComparationCardPayment />
                                </>
                            )}
                        </>
                    )}

                </div>
            </div >

            <AnimatedWrapper className="mt-15" >
                <Footer />
            </AnimatedWrapper>
        </div >
    )
}




const SkeletonPage = () => {
    return (
        <div className="">
            {/* payment header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="w-full">
                        <Skeleton className="h-5 mb-4 w-[30%]" />

                        <Skeleton className="h-5 mb-2 w-[40%]" />
                        <Skeleton className="h-3 mb-2 w-[20%]" />
                    </div>
                    <div className="mt-4 md:mt-0">
                        <Skeleton className="h-5 w-32" />
                    </div>
                </div>
            </div>

            {/* payment header */}

            {/* status */}
            <div className="bg-white rounded-lg shadow-md mb-6 p-6">
                <div className="flex items-center mb-4">
                    <Skeleton className="h-12 w-12 mr-4 rounded-full" />
                    <div className="w-full">
                        <Skeleton className="h-6 w-[20%] mb-3" />
                        <Skeleton className="h-6 w-[50%] " />
                    </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <Skeleton className="h-4 w-[18%] mb-3" />
                    {Array(2).fill(null).map((_, index) => (
                        <div key={index} className="flex justify-between mb-1">
                            <Skeleton className="h-6 w-[24%] mr-3" />
                            <Skeleton className="h-6 w-[14%] " />
                        </div>
                    ))}
                    <div className="flex justify-between mb-3">
                        <Skeleton className="h-6 w-16 mr-3 " />
                        <Skeleton className="h-6 w-32 " />
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between font-bold">
                        <Skeleton className="h-6 w-14 mb-3 ml-2" />
                        <Skeleton className="h-6 w-[10%] mb-3" />
                    </div>
                </div>
            </div>
            {/* status */}


        </div>
    )
}