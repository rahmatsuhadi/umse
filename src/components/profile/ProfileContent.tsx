"use client";

import React from "react";
import Image from "next/image";

const sectionCard: React.CSSProperties = {
    background: "white",
    border: "1.5px solid #F0D5C2",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16
};

const h2Style: React.CSSProperties = {
    fontSize: 18,
    fontWeight: 800,
    marginBottom: 8,
    color: "#1A1008"
} as React.CSSProperties;

const h3Style: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 800,
    marginTop: 12,
    marginBottom: 6,
    color: "#1A1008"
};

const grid2: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 16
};

const eyebrow: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    background: "#FEF3D0",
    border: "1px solid rgba(232,165,48,0.4)",
    color: "#9B6E00",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 10
};

const imgCard: React.CSSProperties = {
    overflow: "hidden",
    borderRadius: 12,
    border: "1.5px solid #F0D5C2",
    background: "#fafafa"
};

const imgStyle: React.CSSProperties = {
    width: "100%",
    height: 220,
    objectFit: "cover",
    display: "block",
    opacity: 0.95
};

const featureGrid: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
    gap: 12,
    marginTop: 12
};

const featureCard: React.CSSProperties = {
    borderRadius: 12,
    padding: 16,
    border: "1.5px solid #F0D5C2",
    display: "flex",
    flexDirection: "column",
    gap: 6,
    fontSize: 14
};

const iconStyle: React.CSSProperties = {
    width: 40,
    height: 40,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18
};

const textSecondary = "#4A3728";

export const ProfileContent = () => {
    return (
        <div>
            {/* Visi & Misi */}
            <section id="visimisi" style={sectionCard} data-section="true">
                <h2 style={h2Style}>Visi dan Misi</h2>
                <div style={grid2}>
                    <div>
                        <div style={eyebrow}>🎯 Arah Pembangunan</div>
                        <h3 style={h3Style}>Visi</h3>
                        <p style={{ color: textSecondary }}>
                            &quot;Terwujudnya Masyarakat Kabupaten Sleman yang Maju, Adil, Makmur, Lestari dan Berkeadaban&quot;.
                        </p>
                    </div>
                    <div style={{ ...imgCard, position: "relative" }}>
                        <Image
                            src="https://images.unsplash.com/photo-1519683109079-d5f539e154b4?w=1000&h=600&fit=crop"
                            alt="Kegiatan pemberdayaan UMKM Sleman"
                            fill
                            style={imgStyle}
                        />
                    </div>
                    <div style={{ gridColumn: "1/-1" }}>
                        <div style={{ ...eyebrow, background: "#D4EFDF", color: "#1b5e20", borderColor: "#A5D6A7" }}>
                            📌 Pilar Misi
                        </div>
                        <h3 style={h3Style}>Misi</h3>
                        <ul style={{ paddingLeft: 18, color: textSecondary, lineHeight: 1.6 }}>
                            <li>Tanda &quot;Belum diverifikasi&quot; berarti akun belum pernah melakukan transaksi yang valid. Meningkatkan pembangunan manusia yang produktif, berkualitas, dan berkepribadian.</li>
                            <li>Meningkatkan kualitas sarana dan prasarana secara berkelanjutan dan berkeadilan.</li>
                            <li>Menjamin akses kesehatan yang adil dan pelestarian lingkungan hidup.</li>
                            <li>Mewujudkan keadilan sosial ekonomi melalui sektor pertanian, UMKM, pariwisata, ekonomi inklusif dan kreatif.</li>
                            <li>Mewujudkan reformasi birokrasi yang bersih, menjunjung tinggi hukum dan hak rakyat.</li>
                            <li>Pemajuan kebudayaan dalam semangat kebhinekaan, toleransi, dan keistimewaan DIY.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Tugas & Fungsi */}
            <section id="tugas" style={sectionCard} data-section="true">
                <h2 style={h2Style}>Tugas Pokok dan Fungsi</h2>
                <div style={grid2}>
                    <div>
                        <h3 style={h3Style}>Tugas Pokok</h3>
                        <p style={{ color: textSecondary }}>
                            Membantu Bupati melaksanakan urusan pemerintahan dan tugas pembantuan di bidang koperasi, usaha kecil dan menengah.
                        </p>
                    </div>
                    <div style={{ ...imgCard, position: "relative" }}>
                        <Image
                            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&h=600&fit=crop"
                            alt="Pelatihan dan pendampingan UMKM"
                            fill
                            style={imgStyle}
                        />
                    </div>
                    <div style={{ gridColumn: "1/-1" }}>
                        <h3 style={h3Style}>Fungsi</h3>
                        <ul style={{ paddingLeft: 18, color: textSecondary, lineHeight: 1.6 }}>
                            <li>Penyusunan rencana kerja dinas.</li>
                            <li>Perumusan kebijakan teknis urusan koperasi dan UKM.</li>
                            <li>Pelaksanaan, pelayanan, pembinaan, dan pengendalian urusan koperasi dan UKM.</li>
                            <li>Evaluasi dan pelaporan pelaksanaan urusan koperasi dan UKM.</li>
                            <li>Pelaksanaan kesekretariatan dinas.</li>
                            <li>Tugas lain dari Bupati sesuai ketentuan peraturan perundang‑undangan.</li>
                        </ul>
                    </div>
                </div>
                <div style={featureGrid}>
                    <div style={{ ...featureCard, background: "#FEF3D0" }}>
                        <div style={{ ...iconStyle, background: "#FFE8A3" }}>🧭</div>
                        <div style={{ fontWeight: 800 }}>Konsultasi UMKM</div>
                        <div style={{ color: textSecondary }}>Pendampingan legalitas, branding, pemasaran, dan akses pasar.</div>
                    </div>
                    <div style={{ ...featureCard, background: "#D4EFDF" }}>
                        <div style={{ ...iconStyle, background: "#BCE7C7" }}>🎓</div>
                        <div style={{ fontWeight: 800 }}>Pelatihan &amp; Inkubasi</div>
                        <div style={{ color: textSecondary }}>Program peningkatan kapasitas pelaku usaha.</div>
                    </div>
                    <div style={{ ...featureCard, background: "#FDE8D8" }}>
                        <div style={{ ...iconStyle, background: "#FFD8C6" }}>💳</div>
                        <div style={{ fontWeight: 800 }}>Fasilitasi Permodalan</div>
                        <div style={{ color: textSecondary }}>Informasi dan jejaring skema pembiayaan UMKM.</div>
                    </div>
                </div>
            </section>

            {/* Struktur Organisasi */}
            <section id="struktur" style={sectionCard} data-section="true">
                <h2 style={h2Style}>Struktur Organisasi</h2>
                <div style={{ background: "white", border: "1.5px solid #F0D5C2", borderRadius: 16, padding: 20 }}>
                    <ul style={{ paddingLeft: 18, color: textSecondary, lineHeight: 1.6 }}>
                        <li>Kepala Dinas.</li>
                        <li>
                            Sekretariat:
                            <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                                <li>Subbagian Umum dan Kepegawaian.</li>
                                <li>Subbagian Keuangan, Perencanaan dan Evaluasi.</li>
                            </ul>
                        </li>
                        <li>
                            Bidang Usaha Mikro:
                            <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                                <li>Tim Kerja Jaringan Usaha Kemitraan.</li>
                                <li>Tim Kerja Jaringan Fasilitasi Layanan dan Pembiayaan.</li>
                                <li>Tim Kerja Jaringan Pengembangan Usaha Mikro.</li>
                            </ul>
                        </li>
                        <li>
                            Bidang Koperasi:
                            <ul style={{ paddingLeft: 18, marginTop: 6 }}>
                                <li>Tim Kerja Pengawasan Koperasi.</li>
                                <li>Tim Kerja Kelembagaan.</li>
                                <li>Tim Kerja Pembinaan Usaha Koperasi.</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Sejarah Singkat */}
            <section id="sejarah" style={sectionCard} data-section="true">
                <h2 style={h2Style}>Sejarah Singkat</h2>
                <div style={{ border: "1.5px solid #F0D5C2", borderRadius: 16, padding: 20 }}>
                    <p style={{ color: textSecondary }}>
                        Dinas yang menangani urusan perindustrian, perdagangan, dan koperasi di Sleman mengalami beberapa perubahan sejak era otonomi daerah. Pada 2016, struktur kelembagaan diubah menjadi dua dinas terpisah: Dinas Perindustrian dan Perdagangan, serta Dinas Koperasi, Usaha Kecil dan Menengah.
                    </p>
                </div>
                <div style={{ ...imgCard, marginTop: 12, position: "relative", height: 220 }}>
                    <Image
                        src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1000&h=600&fit=crop"
                        alt="Kegiatan komunitas pelaku usaha Sleman"
                        fill
                        style={imgStyle}
                    />
                </div>
            </section>

            {/* Kontak & Layanan */}
            <section id="kontak" style={sectionCard} data-section="true">
                <h2 style={h2Style}>Kontak &amp; Layanan</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
                    <div style={{ background: "white", border: "1.5px solid #F0D5C2", borderRadius: 16, padding: 20 }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 8, color: textSecondary }}>
                            <div><strong>Alamat:</strong> Jalan Parasamya Beran, Tridadi, Sleman, DIY 55511</div>
                            <div><strong>Telepon:</strong> (0274) 865473, 868405</div>
                            <div><strong>WhatsApp:</strong> 081338504131</div>
                            <div><strong>Situs:</strong> dinkopukm.slemankab.go.id</div>
                            <div><strong>Email:</strong> dinkop_ukm@slemankab.go.id</div>
                            <div><strong>Waktu Layanan:</strong> Senin–Kamis 08.00–15.30 WIB, Jumat 08.00–14.30 WIB</div>
                        </div>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
                            <a
                                className="btn btn-whatsapp btn-lg"
                                href="https://wa.me/6281338504131?text=Halo%20Dinas%20Koperasi%20%26%20UKM%20Sleman%2C%20saya%20butuh%20informasi%20layanan%20UMKM."
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                💬 Chat CS via WhatsApp
                            </a>
                            <a
                                className="btn btn-secondary btn-lg"
                                href="https://dinkopukm.slemankab.go.id/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                🌐 Kunjungi Website
                            </a>
                        </div>
                    </div>
                    <div style={{ background: "white", border: "1.5px solid #F0D5C2", borderRadius: 16, overflow: "hidden" }}>
                        <iframe
                            title="Lokasi Dinas Koperasi dan UKM Sleman"
                            src="https://www.google.com/maps?q=Jalan%20Parasamya%20Beran%20Tridadi%20Sleman&output=embed"
                            width="100%"
                            height="360"
                            style={{ border: 0, display: "block" }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};
