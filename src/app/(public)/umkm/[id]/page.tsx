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
                        backgroundImage: `url(${store.logo_url || '/assets/no-image.jpg'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        filter: 'brightness(0.7)'
                    }}
                ></div>
                <div className="merchant-detail-info">
                    <div className="merchant-detail-header">
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
                                <span className="meta-item text-slate-600">⭐ <strong id="mdRating">{store.average_rating}</strong></span>
                                <span className="meta-item text-slate-600">📦 <strong id="mdProducts">{store.products_count}</strong> produk</span>
                                <span className="meta-item text-slate-600">👥 <strong id="mdFollowers">0</strong> mengikuti</span>
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
                    </aside>
                    <main className="relative z-10 p-6 rounded-2xl  border-[var(--cream-dark)] bg-[var(--cream)]">
                        <div className="products-toolbar" style={{ marginTop: 0 }}>
                            <div className="products-toolbar-left">
                                <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Produk dari toko ini</span>
                            </div>
                        </div>
                        <div id="mdProductsGrid">
                            <ProductListByStore id={id} />
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
    const message = `Halo, saya ingin bertanya tentang suatu hal di toko ${store.name}`;

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
            <span style={{ fontSize: '18px' }}>💬</span> Chat via WhatsApp
        </a>
    );
}
