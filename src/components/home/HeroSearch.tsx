"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProducts } from "@/features/products/hooks";

type HeroSlide = {
    bg: string;
    img: string;
    eyebrow: string;
    title: string;
    sub: string;
    cta: string;
    href?: string;
    q?: string;
};

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
    const [apiSlides, setApiSlides] = useState<HeroSlide[]>([]);

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

    const slidesData = apiSlides.length > 0 ? apiSlides : SLIDES;

    const goTo = useCallback((idx: number) => {
        setCurrent((idx + slidesData.length) % slidesData.length);
    }, [slidesData.length]);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrent((c) => (c + 1) % slidesData.length);
        }, 4000);
    }, [slidesData.length]);

    useEffect(() => {
        startTimer();
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [startTimer]);

    useEffect(() => {
        let alive = true;
        const controller = new AbortController();
        const pick = (obj: Record<string, unknown>, keys: string[]): unknown => {
            for (const k of keys) {
                const val = obj?.[k];
                if (val !== undefined && val !== null && val !== "") return val;
            }
            return undefined;
        };
        const load = async () => {
            try {
                const res = await fetch("/api/banners", { signal: controller.signal });
                if (!res.ok) return;
                const json = await res.json();
                const raw = (Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : []) as Record<string, unknown>[];
                const mapped = raw
                    .map((b) => {
                        const bg = (pick(b, ["bg", "background", "background_color", "backgroundColor"]) as string) || "#1B4332";
                        const img = pick(b, ["image", "image_url", "imageUrl", "banner", "banner_url"]) as string | undefined;
                        const eyebrow = (pick(b, ["eyebrow", "label", "tagline"]) as string) || "";
                        const title = (pick(b, ["title", "headline"]) as string) || "";
                        const sub = (pick(b, ["subtitle", "sub", "description"]) as string) || "";
                        const cta = (pick(b, ["cta", "cta_text", "ctaText"]) as string) || "Lihat Selengkapnya →";
                        const href = pick(b, ["href", "link", "url"]) as string | undefined;
                        const q = (pick(b, ["query", "search", "q"]) as string) || "";
                        const slide: HeroSlide = { bg, img: img || "", eyebrow, title, sub, cta, href, q };
                        return img && title ? slide : null;
                    })
                    .filter((s): s is HeroSlide => Boolean(s));
                if (alive && mapped.length > 0) setApiSlides(mapped as HeroSlide[]);
            } catch { }
        };
        load();
        return () => {
            alive = false;
            controller.abort();
        };
    }, []);

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
                            Temukan Produk<br /> <span className="highlight">Unggulan</span><br /> Sleman
                        </h1>
                        <p className="hero-subtitle">
                            Yuk dukung UMKM Sleman untuk tumbuh bersama 
                            <Image
                                src="/slemanmartlogo.png"
                                alt="Sleman Mart"
                                width={120}
                                height={32}
                                className="inline-block align-middle ml-1"
                                style={{ height: '1.2em', width: 'auto' }}
                            />
                        </p>
                        <form className="search-form-big" onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                            <input
                                type="text"
                                placeholder="Cari apapun di sini..."
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
                            {slidesData.map((s, i) => (
                                <div className="carousel-slide" key={i}>
                                    <div className="carousel-slide-bg" style={{ background: s.bg }}>
                                        <Image src={s.img} alt={s.eyebrow} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover" }} />
                                    </div>
                                    <div className="carousel-content">
                                        {/* <div className="carousel-eyebrow">{s.eyebrow}</div> */}
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
                            {slidesData.map((_, i) => (
                                <button
                                    key={i}
                                    className={`carousel-dot ${i === current ? "active" : ""}`}
                                    onClick={(e) => { e.stopPropagation(); goTo(i); }}
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
