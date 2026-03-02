"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useProducts } from "@/features/products/hooks";

const SLIDES = [
    {
        bg: "#1B4332",
        img: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&h=600&fit=crop",
        eyebrow: "🔥 Promo Minggu Ini",
        title: "Batik Tulis Prambanan\nDiskon hingga 30%!",
        sub: "Koleksi eksklusif motif candi. Stok terbatas!",
        cta: "Lihat Koleksi →",
        q: "Batik Prambanan",
    },
    {
        bg: "#7B2D00",
        img: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=900&h=600&fit=crop",
        eyebrow: "⭐ Produk Unggulan",
        title: "Kuliner Autentik Sleman\nLangsung dari Dapur Lokal",
        sub: "Tempe bacem, gudeg, bakpia & lebih banyak lagi.",
        cta: "Jelajahi Kuliner →",
        q: "Kuliner",
    },
    {
        bg: "#1A3A5C",
        img: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=900&h=600&fit=crop",
        eyebrow: "🌋 Kopi Lereng Merapi",
        title: "Arabika Single Origin\nKetinggian 1000 mdpl",
        sub: "Dipetik langsung oleh petani lokal Pakem, Sleman.",
        cta: "Pesan Sekarang →",
        q: "Kopi Merapi",
    },
    {
        bg: "#3D2B1F",
        img: "https://images.unsplash.com/photo-1498049860654-af1a5fed0d78?w=900&h=600&fit=crop",
        eyebrow: "🎪 Festival UMKM 2025",
        title: "200+ UMKM Sleman\ndalam Satu Platform",
        sub: "Kerajinan anyaman, batik, kuliner & produk lokal terbaik.",
        cta: "Lihat Semua Toko →",
        q: "",
        href: "/umkm",
    },
];

const HERO_TAGS = [
    { label: "🌿 Tempe Mlati", q: "Tempe Mlati" },
    { label: "🎨 Batik Prambanan", q: "Batik Prambanan" },
    { label: "🥮 Bakpia", q: "Bakpia" },
    { label: "🎋 Kerajinan Bambu", q: "Kerajinan Bambu" },
    { label: "🍲 Gudeg", q: "Gudeg" },
];

export function HeroSearch() {
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [current, setCurrent] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch popular products to build dynamic tags
    const { data: popularData, isLoading: isLoadingPopular } = useProducts({ per_page: 10, sort: "-products_count" });
    const popularProducts = popularData?.data || [];

    // Create unique random tags using the popular product names
    const uniqueNames = Array.from(new Set(popularProducts.map(p => p.name))).slice(0, 5);
    const heroIcons = ["🌿", "🎨", "🥮", "🎋", "🍲", "☕", "🛍️"];
    const dynamicTags = uniqueNames.map((name, i) => ({
        label: `${heroIcons[i % heroIcons.length]} ${name}`,
        q: name,
    }));

    const tagsToDisplay = dynamicTags.length > 0 ? dynamicTags : HERO_TAGS;

    const goTo = useCallback((idx: number) => {
        setCurrent((idx + SLIDES.length) % SLIDES.length);
    }, []);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrent((c) => (c + 1) % SLIDES.length);
        }, 4000);
    }, []);

    useEffect(() => {
        startTimer();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [startTimer]);

    const handleSearch = (q?: string) => {
        const val = q ?? query;
        if (val.trim()) router.push(`/explore?q=${encodeURIComponent(val.trim())}`);
    };

    return (
        <>
            <section className="home-hero">
                <div className="hero-pattern"></div>
                <div className="hero-layout">
                    {/* Left: Text + Search */}
                    <div className="hero-left">
                        <div className="hero-eyebrow">
                            <span>📍</span> Sleman, Daerah Istimewa Yogyakarta
                        </div>
                        <h1 className="hero-title">
                            Temukan Produk<br />Lokal <span className="highlight">Terbaik</span><br />di Sleman
                        </h1>
                        <p className="hero-subtitle">
                            Dari warung ke jari — mendukung UMKM lokal Sleman untuk tumbuh bersama komunitas.
                        </p>
                        <form className="search-form-big" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                            <input
                                type="text"
                                placeholder="Cari produk, toko, makanan, kerajinan..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                style={{ padding: "24px 28px", fontSize: "17px", width: "100%" }}
                            />
                            <button type="submit" style={{ padding: "16px 32px" }}>Cari Sekarang</button>
                        </form>
                        <div className="hero-tags">
                            {isLoadingPopular ? (
                                <div style={{ display: "flex", gap: "8px" }}>
                                    {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ width: 100, height: 32, background: "rgba(255,255,255,0.1)", borderRadius: 50, animation: "pulse 1.5s infinite" }} />)}
                                </div>
                            ) : tagsToDisplay.map((tag) => (
                                <span
                                    key={tag.q}
                                    className="hero-tag"
                                    onClick={() => handleSearch(tag.q)}
                                >
                                    {tag.label}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Right: Promo Carousel */}
                    <div
                        className="promo-carousel"
                        onMouseEnter={() => { if (timerRef.current) clearInterval(timerRef.current); }}
                        onMouseLeave={startTimer}
                    >
                        <div
                            className="carousel-track"
                            style={{
                                transform: `translateX(-${current * 100}%)`,
                                transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                        >
                            {SLIDES.map((s, i) => (
                                <div className="carousel-slide" key={i}>
                                    <div className="carousel-slide-bg" style={{ background: s.bg }}>
                                        <img src={s.img} alt={s.eyebrow} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                                    </div>
                                    <div className="carousel-content">
                                        <div className="carousel-eyebrow">{s.eyebrow}</div>
                                        <div className="carousel-title" style={{ whiteSpace: "pre-line" }}>{s.title}</div>
                                        <div className="carousel-sub">{s.sub}</div>
                                        <button
                                            className="carousel-cta"
                                            onClick={() => s.href ? router.push(s.href) : handleSearch(s.q)}
                                        >
                                            {s.cta}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Arrows */}
                        <button className="carousel-arrow prev" onClick={(e) => { e.stopPropagation(); goTo(current - 1); }}>&#8249;</button>
                        <button className="carousel-arrow next" onClick={(e) => { e.stopPropagation(); goTo(current + 1); }}>&#8250;</button>

                        {/* Dots */}
                        <div className="carousel-dots">
                            {SLIDES.map((_, i) => (
                                <button
                                    key={i}
                                    className={i === current ? "active" : ""}
                                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
                                    style={{
                                        width: i === current ? 22 : 7,
                                        height: 7,
                                        borderRadius: i === current ? 4 : "50%",
                                        background: i === current ? "white" : "rgba(255,255,255,0.4)",
                                        border: "none",
                                        padding: 0,
                                        margin: "0 3px",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                    }}
                                ></button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            <div className="batik-divider"></div>
        </>
    );
}
