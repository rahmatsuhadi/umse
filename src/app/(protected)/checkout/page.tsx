
import React from "react";
import { StepIndicator } from "@/components/orders/step/StepIndicator";
import { CheckoutStep, steps } from "@/components/checkouts/lib";
import CheckoutHeader from "@/components/checkouts/CheckoutHeader";
import CheckoutItem from "@/components/checkouts/CheckoutItemPageStep";

export default function CheckoutPage() {

    const step: CheckoutStep = "checkout"

    const currentStepIndex = steps.findIndex(s => s.key === step);

    return (
        <div className="bg-gray-50 min-h-[100vh] font-jakarta">
            {/* header */}
           
            <CheckoutHeader currentStep={step} index={currentStepIndex} />

            {/* main content */}

            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto ">

                    <StepIndicator currentStep={step} />

                    <CheckoutItem currentStep={step} />
                </div>
            </div>
        </div>
    )
}