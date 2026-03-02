"use client";

import { useState } from "react";

interface FaqItemProps {
    question: string;
    answer: string;
}

export function FaqItem({ question, answer }: FaqItemProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`faq-item ${isOpen ? "active" : ""}`}>
            <div className="faq-q" onClick={() => setIsOpen(!isOpen)}>
                {question} <span>+</span>
            </div>
            <div className="faq-a">{answer}</div>
        </div>
    );
}
