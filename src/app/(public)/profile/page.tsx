import { Navbar } from "@/components/shared/Navbar";
import { Metadata } from "next";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { ProfileTOC } from "@/components/profile/ProfileTOC";
import { ProfileContent } from "@/components/profile/ProfileContent";

export const metadata: Metadata = {
    title: "Profil — Sleman Mart",
    description: "Visi, misi, tugas, struktur organisasi, sejarah singkat, serta kontak layanan Dinas Koperasi & UKM Sleman",
};

const TOC_SECTIONS = [
    { id: "visimisi", label: "Visi & Misi", num: 1 },
    { id: "tugas", label: "Tugas & Fungsi", num: 2 },
    { id: "struktur", label: "Struktur Organisasi", num: 3 },
    { id: "sejarah", label: "Sejarah Singkat", num: 4 },
    { id: "kontak", label: "Kontak & Layanan", num: 5 },
];

export default function ProfilePage() {
    return (
        <main style={{ minHeight: "100vh", background: "#FFF9F4" }}>
            <Navbar />

            <ProfileHero />

            <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
                <div className="profile-layout" style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
                    <ProfileTOC sections={TOC_SECTIONS} />
                    <main>
                        <ProfileContent />
                    </main>
                </div>
            </div>

            <style>{`
                @media (max-width: 960px) {
                    .profile-layout {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </main>
    );
}