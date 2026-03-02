"use client";

import React from "react";

export const ProfileHero = () => {
    return (
        <div className="bg-gradient-to-br from-[#EEF3FF] to-[#F5F8FF] py-12 px-5 border-b-2 border-black/[0.06]">
            <div className="max-w-[1200px] mx-auto">
                <h1 className="text-[clamp(28px,4vw,48px)] font-[900] text-[#1b2c59] leading-[1.1]">
                    Profil <span className="text-[#2C5CF6]">Dinas Koperasi & UKM</span> Sleman
                </h1>
                <p className="text-[#51608f] mt-2 text-lg">
                    Visi, misi, tugas, struktur organisasi, sejarah singkat, serta kontak layanan
                </p>
            </div>
        </div>
    );
};
