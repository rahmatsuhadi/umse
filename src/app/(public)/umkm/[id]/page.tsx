/* eslint-disable @typescript-eslint/no-explicit-any */
import ContactSection from "@/components/landing/Contact";
import ProductListByStore from "@/components/products/ProductListByStore";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import { Navbar } from "@/components/shared/Navbar";
import { getStoreById } from "@/features/store/api";
import { APP_URL } from "@/lib/envConfig";
import { trimDescription } from "@/lib/seoMetadataUtils";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";



export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        
        const { data: store } = await getStoreById(id);

        // Gambar untuk Open Graph dan Twitter Card
        const ogImageUrl = store.logo_url || '/assets/no-image.jpg';
        const trimmedDescription = trimDescription(store.description);

        return {
            title: store.name,  // Dinamis berdasarkan produk
            description: trimmedDescription,  // Deskripsi produk
            openGraph: {
                title: store.name,
                description: trimmedDescription,
                url: `${APP_URL}/umkm/${store.id}`,  // URL produk
                images: [{
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: store.name || 'Sleman Mart UMKM Store',
                }],
                type: 'website',  // Menunjukkan bahwa ini adalah halaman produk
            },
            twitter: {
                title: store.name,
                description: trimmedDescription,
                images: [{
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: store.name || 'Sleman Mart UMKM Store',
                }],
                card: 'summary_large_image',  // Format Twitter Card yang besar
            },
        };
    } catch (error) {
        if (error instanceof Error)
            console.log(error.message)
        return {
            title: 'Store Tidak Ditemukan',
            description: 'Halaman yang Anda cari tidak ada.',
        };
    }
}



export default async function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;

    let store;
    try {
        const response = await getStoreById(id);
        store = response.data;
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === 'MAINTENANCE_MODE') {
                redirect('/pemeliharaan');
            }
        }
        notFound();
    }

    return (
        <div className="bg-[#FFF9F4] min-h-screen">
            <Navbar />

            <div className="merchant-detail-hero">
                <div
                    className="merchant-detail-cover"
                    id="mdCover"
                    style={{
                        backgroundImage: `url(${store.cover_path || store.logo_url || '/assets/no-image.jpg'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.7)'
                    }}
                ></div>
                <div className="merchant-detail-info" style={{ position: 'relative', marginTop: 0 }}>
                    <div className="merchant-detail-header" style={{ marginTop: 0, paddingTop: '20px' }}>
                        <div
                            className="merchant-detail-avatar"
                            id="mdAvatar"
                            style={{
                                backgroundImage: `url(${store.logo_url || '/assets/no-image.jpg'})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        ></div>
                        <div className="merchant-detail-meta">
                            <h1 id="mdName">{store.name}</h1>
                            <div className="meta-row">
                                <span className="meta-item text-slate-600">📍 <strong id="mdArea">{store.district?.name}</strong></span>
                                {/* <span className="meta-item text-slate-600">⭐ <strong id="mdRating">{store.average_rating}</strong></span> */}
                                <span className="meta-item text-slate-600">📦 <strong id="mdProducts">{store.products_count}</strong> produk</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
                        <StoreWhatsAppButton store={store} />
                        <Link className="btn btn-secondary" href="/umkm">Kembali ke daftar</Link>
                    </div>
                </div>
            </div>

            <div className="merchant-detail-body">
                <div className="merchant-detail-layout">
                    <aside className="merchant-info-panel">
                        {!store.is_open && store.emergency_close_reason && (
                            <div className="relative overflow-hidden bg-gradient-to-b from-rose-50 to-white border border-red-100 rounded-2xl p-6 shadow-sm mb-6 flex flex-col items-center text-center pb-4" 
                            style={{ padding: 20, marginBottom: 16 }}>
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-rose-400 to-red-500"></div>
                                <div className="w-14 h-14 bg-red-100/80 rounded-full flex items-center justify-center text-red-500 mb-4 shadow-sm">
                                    <i className="fas fa-door-closed text-2xl"></i>
                                </div>
                                <h3 className="text-lg font-bold text-red-800 mb-2" style={{ margin: 0 }}>Toko Sedang Tutup</h3>
                                <div className="text-sm text-red-700/90 leading-relaxed bg-red-50/50 px-4 py-2 rounded-lg mt-3 inline-block">
                                    {store.emergency_close_reason}
                                </div>
                            </div>
                        )}
                        <div className="info-card">
                            <h3>Informasi Toko</h3>
                            <div className="info-row">
                                <div className="icon">📍</div>
                                <div id="mdAddress">{store.address}</div>
                            </div>
                            <div className="info-row">
                                <div className="icon">⏰</div>
                                <div id="mdHours">Senin - Sabtu, 08:00 - 17:00</div>
                            </div>
                            <div className="info-row">
                                <div className="icon">📞</div>
                                <div id="mdPhone">{store.user?.phone_number || store.nik}</div>
                            </div>
                            <div className="info-row">
                                <div className="icon">🏷️</div>
                                <div id="mdSince">{new Date(store.created_at).getFullYear()}</div>
                            </div>
                        </div>
                        <div className="info-card">
                            <h3>Tentang Toko</h3>
                            <div id="mdDesc" className="text-sm text-slate-600 leading-relaxed">
                                {store.description}
                            </div>
                        </div>

                        {(store.instagram || store.facebook || store.tiktok) && (
                            <div className="info-card" style={{ marginTop: '20px' }}>
                                <h3>Media Sosial</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', marginTop: '12px' }}>
                                    {store.instagram && (
                                        <a href={store.instagram} target="_blank" rel="noopener noreferrer" className="info-row" style={{ textDecoration: 'none' }}>
                                            <div className="icon">📷</div>
                                            <div className="text-slate-600 hover:text-terracotta transition-colors">Instagram</div>
                                        </a>
                                    )}
                                    {store.facebook && (
                                        <a href={store.facebook} target="_blank" rel="noopener noreferrer" className="info-row" style={{ textDecoration: 'none' }}>
                                            <div className="icon">📘</div>
                                            <div className="text-slate-600 hover:text-terracotta transition-colors">Facebook</div>
                                        </a>
                                    )}
                                    {store.tiktok && (
                                        <a href={store.tiktok} target="_blank" rel="noopener noreferrer" className="info-row" style={{ textDecoration: 'none' }}>
                                            <div className="icon">🎵</div>
                                            <div className="text-slate-600 hover:text-terracotta transition-colors">TikTok</div>
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </aside>
                    <main className="relative z-10 p-6 rounded-2xl  border-[var(--cream-dark)] bg-[var(--cream)]">
                        <div className="products-toolbar" style={{ marginTop: 0 }}>
                            <div className="products-toolbar-left">
                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Produk dari toko ini</span>
                            </div>
                        </div>
                        <div id="mdProductsGrid">
                            <ProductListByStore id={id} store={store} />
                        </div>
                    </main>
                </div>
            </div>

            <AnimatedWrapper>
                <ContactSection />
            </AnimatedWrapper>
        </div>
    )
}

function StoreWhatsAppButton({ store }: { store: any }) {
    const phone = store.user?.phone_number || "";
    const message = `Halo, Saya melihat produk anda dari SlemanMart, saya ingin bertanya tentang suatu hal di toko ${store.name}`;
    const waIcon = (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    );
    // Simple way to handle click for server component or use a client component
    // Since this is in Page.tsx (Server Component), we can use a small Client Component wrapper for the button
    // But for now let's just use a link

    const getLink = (p: string) => {
        let cleaned = p.replace(/[^0-9+]/g, "");
        if (cleaned.startsWith("08")) cleaned = "62" + cleaned.substring(1);
        if (cleaned.startsWith("+62")) cleaned = cleaned.replace("+62", "62");
        return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
    };

    return (
        <a
            href={phone ? getLink(phone) : "#"}
            target="_blank"
            className="btn btn-whatsapp"
            rel="noopener noreferrer"
        >
            <span style={{ fontSize: '18px' }}>{waIcon}</span> Chat via WhatsApp
        </a>
    );
}
