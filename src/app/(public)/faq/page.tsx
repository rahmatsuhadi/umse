"use client";

import { Navbar } from "@/components/shared/Navbar";
import ContactSection from "@/components/landing/Contact";
import { useFaqs, FAQ } from "@/features/faq/hooks";
import { FaqItem as SharedFaqItem } from "@/components/shared/FaqItem";

export default function FaqPage() {
    const { data: faqsData, isLoading } = useFaqs();
    const faqs = faqsData?.data || [];

    const groupedFaqs = faqs.reduce((acc, faq) => {
        if (!acc[faq.topic]) {
            acc[faq.topic] = [];
        }
        acc[faq.topic].push(faq);
        return acc;
    }, {} as Record<string, FAQ[]>);

    return (
        <div>
            <Navbar />

            <div id="page-faq">
                <div className="guide-hero">
                    <div className="guide-hero-inner">
                        <h1>❓ Sering Ditanyakan</h1>
                        <p>Temukan jawaban atas pertanyaan umum mengenai penggunaan platform SlemanMart.</p>
                    </div>
                </div>

                <div className="guide-body">
                    {isLoading ? (
                        <div className="empty-state-msg">Memuat FAQ...</div>
                    ) : Object.keys(groupedFaqs).length > 0 ? (
                        (Object.entries(groupedFaqs) as [string, FAQ[]][]).map(([topic, topicFaqs]) => (
                            <div className="guide-section" key={topic}>
                                <h2>{topic}</h2>
                                <div className="faq-list">
                                    {topicFaqs.map((faq: FAQ) => (
                                        <SharedFaqItem key={faq.id} question={faq.question} answer={faq.answer} />
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state-msg">Belum ada FAQ yang tersedia.</div>
                    )}
                </div>
            </div>

            <ContactSection />
        </div>
    );
}
