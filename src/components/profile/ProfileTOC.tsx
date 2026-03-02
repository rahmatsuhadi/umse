"use client";

import React, { useEffect, useState } from "react";

interface TOCSection {
    id: string;
    label: string;
    num: number;
}

interface ProfileTOCProps {
    sections: TOCSection[];
}

export const ProfileTOC = ({ sections }: ProfileTOCProps) => {
    const [activeSection, setActiveSection] = useState<string>("");

    useEffect(() => {
        const onScroll = () => {
            let current = "";
            for (const section of sections) {
                const el = document.getElementById(section.id);
                if (el) {
                    const r = el.getBoundingClientRect();
                    if (r.top <= 120 && r.bottom > 140) {
                        current = section.id;
                        break;
                    }
                }
            }
            if (current) setActiveSection(current);
        };

        document.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
        return () => document.removeEventListener("scroll", onScroll);
    }, [sections]);

    const handleClick = (id: string) => {
        setActiveSection(id);
    };

    return (
        <aside style={{
            position: "sticky",
            top: 80,
            height: "fit-content",
            background: "white",
            border: "1.5px solid #F0D5C2",
            borderRadius: 16,
            padding: 12
        }}>
            <h3 style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#6B4C2A",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                padding: "8px 8px 6px",
                margin: 0
            }}>
                Daftar Isi
            </h3>
            <nav>
                {sections.map((section) => {
                    const isActive = activeSection === section.id;
                    return (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            onClick={() => handleClick(section.id)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                                padding: "10px 12px",
                                borderRadius: 12,
                                textDecoration: "none",
                                color: isActive ? "#F7620A" : "#4A3728",
                                fontWeight: 600,
                                fontSize: 14,
                                background: isActive ? "rgba(200,87,58,0.08)" : "transparent",
                                transition: "all 0.15s"
                            }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLAnchorElement).style.background = "rgba(200,87,58,0.08)";
                                    (e.currentTarget as HTMLAnchorElement).style.color = "#F7620A";
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                                    (e.currentTarget as HTMLAnchorElement).style.color = "#4A3728";
                                }
                            }}
                        >
                            <span style={{
                                width: 24,
                                height: 24,
                                borderRadius: 8,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#E8EEFF",
                                color: "#2741B0",
                                fontSize: 12,
                                fontWeight: 800,
                                flexShrink: 0
                            }}>
                                {section.num}
                            </span>
                            <span>{section.label}</span>
                        </a>
                    );
                })}
            </nav>
        </aside>
    );
};
