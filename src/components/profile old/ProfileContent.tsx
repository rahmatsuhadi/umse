"use client";

import React from "react";

export const ProfileContent = () => {
    return (
        <div className="flex flex-col gap-4">
            {/* Visi & Misi */}
            <section id="visimisi" className="bg-white border-[1.5px] border-[#F0D5C2] rounded-[16px] p-5">
                <h2 className="text-[18px] font-[900] mb-2 text-[#1A1008]">Visi dan Misi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-[#FEF3D0] border border-[#e8a530]/40 text-[#9B6E00] px-3 py-[6px] rounded-full text-[12px] font-[800] mb-[10px]">
                            🎯 Arah Pembangunan
                        </div>
                        <h3 className="text-[15px] font-[800] mt-3 mb-[6px] text-[#1A1008]">Visi</h3>
                        <p className="text-[#4A3728]">
                            “Terwujudnya Masyarakat Kabupaten Sleman yang Maju, Adil, Makmur, Lestari dan Berkeadaban”.
                        </p>
                    </div>
                    <div className="overflow-hidden rounded-[12px] border-[1.5px] border-[#F0D5C2] bg-[#fafafa]">
                        <img
                            src="https://images.unsplash.com/photo-1519683109079-d5f539e154b4?w=1000&h=600&fit=crop"
                            alt="Kegiatan pemberdayaan UMKM Sleman"
                            className="w-full h-[220px] object-cover block opacity-95"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <div className="inline-flex items-center gap-2 bg-[#D4EFDF] border border-[#A5D6A7] text-[#1b5e20] px-3 py-[6px] rounded-full text-[12px] font-[800] mb-[10px]">
                            📌 Pilar Misi
                        </div>
                        <h3 className="text-[15px] font-[800] mt-3 mb-[6px] text-[#1A1008]">Misi</h3>
                        <ul className="pl-[18px] text-[#4A3728] leading-[1.6] list-disc">
                            <li>Meningkatkan pembangunan manusia yang produktif, berkualitas, dan berkepribadian.</li>
                            <li>Meningkatkan kualitas sarana dan prasarana secara berkelanjutan dan berkeadilan.</li>
                            <li>Menjamin akses kesehatan yang adil dan pelestarian lingkungan hidup.</li>
                            <li>Mewujudkan keadilan sosial ekonomi melalui sektor pertanian, UMKM, pariwisata, ekonomi inklusif dan kreatif.</li>
                            <li>Mewujudkan reformasi birokrasi yang bersih, menjunjung tinggi hukum dan hak rakyat.</li>
                            <li>Pemajuan kebudayaan dalam semangat kebhinekaan, toleransi, dan keistimewaan DIY.</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Tugas Pokok & Fungsi */}
            <section id="tugas" className="bg-white border-[1.5px] border-[#F0D5C2] rounded-[16px] p-5">
                <h2 className="text-[18px] font-[900] mb-2 text-[#1A1008]">Tugas Pokok dan Fungsi</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="text-[15px] font-[800] mt-3 mb-[6px] text-[#1A1008]">Tugas Pokok</h3>
                        <p className="text-[#4A3728]">
                            Membantu Bupati melaksanakan urusan pemerintahan dan tugas pembantuan di bidang koperasi, usaha kecil dan menengah.
                        </p>
                    </div>
                    <div className="overflow-hidden rounded-[12px] border-[1.5px] border-[#F0D5C2] bg-[#fafafa]">
                        <img
                            src="https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1000&h=600&fit=crop"
                            alt="Pelatihan dan pendampingan UMKM"
                            className="w-full h-[220px] object-cover block opacity-95"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <h3 className="text-[15px] font-[800] mt-3 mb-[6px] text-[#1A1008]">Fungsi</h3>
                        <ul className="pl-[18px] text-[#4A3728] leading-[1.6] list-disc">
                            <li>Penyusunan rencana kerja dinas.</li>
                            <li>Perumusan kebijakan teknis urusan koperasi dan UKM.</li>
                            <li>Pelaksanaan, pelayanan, pembinaan, dan pengendalian urusan koperasi dan UKM.</li>
                            <li>Evaluasi dan pelaporan pelaksanaan urusan koperasi dan UKM.</li>
                            <li>Pelaksanaan kesekretariatan dinas.</li>
                            <li>Tugas lain dari Bupati sesuai ketentuan peraturan perundang-undangan.</li>
                        </ul>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                    <div className="rounded-[12px] p-4 border-[1.5px] border-[#F0D5C2] flex flex-col gap-[6px] text-[14px] bg-[#FEF3D0]">
                        <div className="w-10 h-10 rounded-[10px] bg-[#FFE8A3] flex items-center justify-center text-[18px]">🧭</div>
                        <div className="font-[800] text-[#1A1008]">Konsultasi UMKM</div>
                        <div className="text-[#4A3728]">Pendampingan legalitas, branding, pemasaran, dan akses pasar.</div>
                    </div>
                    <div className="rounded-[12px] p-4 border-[1.5px] border-[#F0D5C2] flex flex-col gap-[6px] text-[14px] bg-[#D4EFDF]">
                        <div className="w-10 h-10 rounded-[10px] bg-[#BCE7C7] flex items-center justify-center text-[18px]">🎓</div>
                        <div className="font-[800] text-[#1A1008]">Pelatihan & Inkubasi</div>
                        <div className="text-[#4A3728]">Program peningkatan kapasitas pelaku usaha.</div>
                    </div>
                    <div className="rounded-[12px] p-4 border-[1.5px] border-[#F0D5C2] flex flex-col gap-[6px] text-[14px] bg-[#FDE8D8]">
                        <div className="w-10 h-10 rounded-[10px] bg-[#FFD8C6] flex items-center justify-center text-[18px]">💳</div>
                        <div className="font-[800] text-[#1A1008]">Fasilitasi Permodalan</div>
                        <div className="text-[#4A3728]">Informasi dan jejaring skema pembiayaan UMKM.</div>
                    </div>
                </div>
            </section>

            {/* Struktur Organisasi */}
            <section id="struktur" className="bg-white border-[1.5px] border-[#F0D5C2] rounded-[16px] p-5">
                <h2 className="text-[18px] font-[900] mb-2 text-[#1A1008]">Struktur Organisasi</h2>
                <div className="p-5 border-[1.5px] border-[#F0D5C2] rounded-[16px] bg-white">
                    <ul className="pl-[18px] text-[#4A3728] leading-[1.6] list-disc space-y-2">
                        <li>Kepala Dinas.</li>
                        <li>Sekretariat:
                            <ul className="pl-[18px] mt-[6px] list-[circle]">
                                <li>Subbagian Umum dan Kepegawaian.</li>
                                <li>Subbagian Keuangan, Perencanaan dan Evaluasi.</li>
                            </ul>
                        </li>
                        <li>Bidang Usaha Mikro:
                            <ul className="pl-[18px] mt-[6px] list-[circle]">
                                <li>Tim Kerja Jaringan Usaha Kemitraan.</li>
                                <li>Tim Kerja Jaringan Fasilitasi Layanan dan Pembiayaan.</li>
                                <li>Tim Kerja Jaringan Pengembangan Usaha Mikro.</li>
                            </ul>
                        </li>
                        <li>Bidang Koperasi:
                            <ul className="pl-[18px] mt-[6px] list-[circle]">
                                <li>Tim Kerja Pengawasan Koperasi.</li>
                                <li>Tim Kerja Kelembagaan.</li>
                                <li>Tim Kerja Pembinaan Usaha Koperasi.</li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </section>

            {/* Sejarah Singkat */}
            <section id="sejarah" className="bg-white border-[1.5px] border-[#F0D5C2] rounded-[16px] p-5">
                <h2 className="text-[18px] font-[900] mb-2 text-[#1A1008]">Sejarah Singkat</h2>
                <div className="border-[1.5px] border-[#F0D5C2] rounded-[16px] p-5 mb-3 bg-white">
                    <p className="text-[#4A3728]">
                        Dinas yang menangani urusan perindustrian, perdagangan, dan koperasi di Sleman mengalami beberapa perubahan sejak era otonomi daerah. Pada 2016, struktur kelembagaan diubah menjadi dua dinas terpisah: Dinas Perindustrian dan Perdagangan, serta Dinas Koperasi, Usaha Kecil dan Menengah.
                    </p>
                </div>
                <div className="overflow-hidden rounded-[12px] border-[1.5px] border-[#F0D5C2] bg-[#fafafa]">
                    <img
                        src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1000&h=600&fit=crop"
                        alt="Kegiatan komunitas pelaku usaha Sleman"
                        className="w-full h-[220px] object-cover block opacity-95"
                    />
                </div>
            </section>

            {/* Kontak & Layanan */}
            <section id="kontak" className="bg-white border-[1.5px] border-[#F0D5C2] rounded-[16px] p-5">
                <h2 className="text-[18px] font-[900] mb-2 text-[#1A1008]">Kontak & Layanan</h2>
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white border-[1.5px] border-[#F0D5C2] rounded-[16px] p-5">
                        <div className="flex flex-col gap-2 text-[#4A3728]">
                            <div><strong>Alamat:</strong> Jalan Parasamya Beran, Tridadi, Sleman, DIY 55511</div>
                            <div><strong>Telepon:</strong> (0274) 865473, 868405</div>
                            <div><strong>WhatsApp:</strong> 081338504131</div>
                            <div><strong>Situs:</strong> dinkopukm.slemankab.go.id</div>
                            <div><strong>Email:</strong> dinkop_ukm@slemankab.go.id</div>
                            <div><strong>Waktu Layanan:</strong> Senin–Kamis 08.00–15.30 WIB, Jumat 08.00–14.30 WIB</div>

                            <div className="flex flex-wrap gap-3 mt-4">
                                <a
                                    href="https://wa.me/6281338504131?text=Halo%20Dinas%20Koperasi%20%26%20UKM%20Sleman%2C%20saya%20butuh%20informasi%20layanan%20UMKM."
                                    target="_blank"
                                    rel="noopener"
                                    className="bg-[#25D366] text-white px-6 py-3 rounded-[16px] font-[700] text-[14px] hover:bg-[#1da851] transition-all shadow-md hover:-translate-y-[1px]"
                                >
                                    💬 Chat CS via WhatsApp
                                </a>
                                <a
                                    href="https://dinkopukm.slemankab.go.id/"
                                    target="_blank"
                                    rel="noopener"
                                    className="bg-[#F0D5C2] text-[#1A1008] border-2 border-[#F0D5C2] px-6 py-3 rounded-[16px] font-[700] text-[14px] hover:border-[#F7620A] hover:text-[#F7620A] transition-all"
                                >
                                    🌐 Kunjungi Website
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border-[1.5px] border-[#F0D5C2] rounded-[16px] overflow-hidden">
                        <iframe
                            title="Lokasi Dinas Koperasi dan UKM Sleman"
                            src="https://www.google.com/maps?q=Jalan%20Parasamya%20Beran%20Tridadi%20Sleman&output=embed"
                            width="100%"
                            height="360"
                            style={{ border: 0 }}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </section>
        </div>
    );
};
