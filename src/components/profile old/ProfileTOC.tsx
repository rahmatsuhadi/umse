"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface TOCSidebarProps {
    sections: { id: string; label: string; num: number }[];
}

export const ProfileTOC = ({ sections }: TOCSidebarProps) => {
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        const handleScroll = () => {
            let current = "";
            for (const section of sections) {
                const element = document.getElementById(section.id);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 120 && rect.bottom > 140) {
                        current = section.id;
                        break;
                    }
                }
            }
            if (current) setActiveSection(current);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll(); // Initial check

        return () => window.removeEventListener("scroll", handleScroll);
    }, [sections]);

    return (
        <aside className="lg:sticky lg:top-20 h-fit bg-white border-[1.5px] border-[#F0D5C2] rounded-[16px] p-3">
            <h3 className="text-[13px] font-[800] text-[#6B4C2A] uppercase tracking-[0.5px] px-2 py-2 mb-1">
                Daftar Isi
            </h3>
            <nav className="flex flex-col gap-1">
                {sections.map((section) => (
                    <Link
                        key={section.id}
                        href={`#${section.id}`}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-[10px] p-[10px_12px] rounded-[12px] no-underline font-[600] text-[14px] transition-all
              ${activeSection === section.id
                                ? "bg-[rgba(200,87,58,0.08)] text-[#F7620A]"
                                : "text-[#4A3728] hover:bg-[rgba(200,87,58,0.08)] hover:text-[#F7620A]"
                            }`}
                    >
                        <span className="w-6 h-6 rounded-[8px] flex items-center justify-center bg-[#E8EEFF] text-[#2741B0] text-[12px] font-[800] shrink-0">
                            {section.num}
                        </span>
                        <span>{section.label}</span>
                    </Link>
                ))}
            </nav>
        </aside>
    );
};
