"use client"
import Footer from "@/components/layout/Footer";
import { OrderTimeline } from "@/components/orders/OrderTimeLine";
import PaymentHeader from "@/components/orders/shared/PaymentHeader";
import PaymentStatusCard from "@/components/orders/shared/PaymentStatusCard";
import RejectionModal from "@/components/payments/PaymentRejectModal";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetOrderPayments } from "@/features/order/hooks";
import { useParams, useRouter } from "next/navigation";


export default function PaymentStatusPage() {

    const { id } = useParams<{ id: string }>()

    const { data, isLoading } = useGetOrderPayments(id)

    const order = data?.data;

    const router = useRouter();

    return (
        <div className=" w-full">
            <Navbar withMenu={false} />
            <Breadcrumb breadcrumbs={[
                { name: "Beranda", link: "/" },
                { name: "Pesanan", link: "/pesanan" },
                { name: "Status Pesanan", active: true }
            ]} />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">

                    {!order || isLoading ? (
                        <SkeletonPage />
                    ) : (
                        <>
                            <PaymentHeader orderId={order.order_number} date={order.payment.created_at} />
                            <PaymentStatusCard status={{ status: order.payment_status, label: order.status_label }}
                                order={order} />

                            <OrderTimeline order={order} />

                            {order.payment && order.payment.status == "rejected" && (
                                <div className="flex items-center gap-2 flex-wrap">
                                    <RejectionModal
                                        reason={order.payment.rejection_reason ?? ''}
                                        onUploadAgain={() => router.replace(`/pembayaran/${order.id}/upload-ulang`)}
                                    />
                                    <Button onClick={() => router.replace(`/pembayaran/${order.id}/upload-ulang`)}
                                        className=" text-white py-5 px-5 font-medium transition duration-300  hover:cursor-pointer ">Ulangi Pembayaran</Button>
                                </div>
                            )}



                        </>
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