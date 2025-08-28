import CheckoutItem from "@/components/order/Checkout/CheckoutStep";
import Image from "next/image";
import Link from "next/link";

import { motion, AnimatePresence } from 'framer-motion';
import React from "react";
import { CheckoutStep, steps } from "@/components/order/step/steps";
import { StepIndicator } from "@/components/order/step/StepIndicator";
import { animationVariants } from "@/components/order/step/animate";

export default function CheckoutPage() {

    const step: CheckoutStep = "checkout"

    const currentStepIndex = steps.findIndex(s => s.key === step);

    return (
        <div className="bg-gray-50 min-h-[100vh] font-jakarta">
            {/* header */}

            <header className="bg-white shadow-md sticky top-0 z-40 md:px-10">
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
                        </div>

                        <nav className="hidden md:flex items-center space-x-2 text-sm">
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
                        </nav>

                        <Link href="/keranjang" className="text-gray-600 hover:text-primary">
                            <i className="fas fa-arrow-left mr-2"></i>Kembali
                        </Link>
                    </div>
                </div>
            </header>


            {/* main content */}

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto ">

                    <StepIndicator currentStep={step} />

                   <CheckoutItem currentStep={step}/>
                </div>
            </div>
        </div>
    )
}