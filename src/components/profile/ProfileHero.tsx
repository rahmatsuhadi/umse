"use client";

import React from "react";

export const ProfileHero = () => {
    return (
        <div style={{
            background: "#EEF3FF",
            padding: "48px 20px",
            borderBottom: "2px solid rgba(0,0,0,0.06)"
        }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                <h1 style={{
                    fontSize: "clamp(28px,4vw,48px)",
                    fontWeight: 900,
                    color: "#1b2c59",
                    lineHeight: 1.1,
                    margin: 0
                }}>
                    Profil <span style={{ color: "#2C5CF6" }}>Dinas Koperasi &amp; UKM</span> Sleman
                </h1>
                <p style={{ color: "#51608f", marginTop: 8, fontSize: 16 }}>
                    Visi, misi, tugas, struktur organisasi, sejarah singkat, serta kontak layanan
                </p>
            </div>
        </div>
    );
};
