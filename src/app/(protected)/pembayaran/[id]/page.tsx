"use client"

import React, { useState } from "react";
import { StepIndicator } from "@/components/orders/step/StepIndicator";
import { notFound, useParams } from "next/navigation";
import { useGetOrderPayments } from "@/features/order/hooks";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { CheckoutStep, steps } from "@/components/checkouts/lib";
import CheckoutHeader from "@/components/checkouts/CheckoutHeader";
import PaymentStep from "@/components/payments/PaymentPageStep";
import ConfirmationPage from "@/components/payments/PaymentConfirmationStep";

export default function PaymentPage() {
    const { id } = useParams<{ id: string }>()

    const [step, setStep] = useState<CheckoutStep>("payment")


    const { data, isLoading } = useGetOrderPayments(id)

    const order = data?.data


    const currentStepIndex = steps.findIndex(s => s.key === step);


    const renderContent = () => {
        if (isLoading && !!!order) {
            return <LoadingSpinner text="Sedang memuat detail pesanan..." />
        }
        else if(!order && !isLoading){
            return notFound()
        }
        else if(order && !isLoading){
            if (step == "payment") {
                return (
                    <PaymentStep order={order} currentStep={step} onConfirmation={() => setStep("confirmation")} />
    
                )
            }
            else {
                return (
                    <ConfirmationPage paidTotal={order.total.value} id={id} currentStep={step} backToPayment={() => setStep("payment")} />
    
                )
            }
        }


    }

    return (
        <div className="bg-gray-50 min-h-[100vh] font-jakarta">
            {/* header */}

            {/* <header className="bg-white shadow-md sticky top-0 z-40 md:px-10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex-shrink-0">
                            <Link href="/" className="flex items-center gap-2">
                                <Image
                                    src="/slemanmartlogo.png"
                                    alt="Slemanmart Logo"
                                    width={80}
                                    height={80}
                                />
                            </Link>
                        </div> */}

            {/* <nav className="hidden md:flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-gray-600 hover:text-primary">Beranda</Link>
                            <i className="fas fa-chevron-right text-gray-400 text-xs"></i>

                            <Link href="/keranjang" className="text-gray-600 hover:text-primary">Keranjang</Link>

                            {steps.slice(0, currentStepIndex + 1).map((s, index) => (
                                <React.Fragment key={index}>
                                    <i className="fas fa-chevron-right text-gray-400 text-xs"></i>
                                    <span className={s.key === step ? "text-primary font-medium" : "text-gray-600"}>
                                        {s.label}
                                    </span>
                                </React.Fragment>
                            ))}
                        </nav> */}

            <CheckoutHeader currentStep={step} index={currentStepIndex} />

            {/* <button onClick={() => router.back()} className="text-gray-600 hover:cursor-pointer hover:text-primary">
                            <i className="fas fa-arrow-left mr-2"></i>Kembali

                        </button>
                    </div> */}
            {/* </div>
            </header> */}


            {/* main content */}

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto ">

                    <StepIndicator currentStep={step} />
                    {renderContent()}


                </div>
            </div>
        </div>
    )
}