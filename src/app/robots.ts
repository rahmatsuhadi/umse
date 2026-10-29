import { APP_URL } from '@/lib/envConfig';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = APP_URL
    return {
        rules: {
            userAgent: '*',
            disallow: [
                '/',
            ],
            allow: [
                '/produk',
                '/umkm',
                '/profile',
                '/proifle',
                '/literasi',
                '/pameran',
                '/pelatihan',
                '/privacy-policy',
                '/kebijakan-privasi',
                '/terms-conditions',
                '/terms-of-service',
                '/syarat-ketentuan',
                '/faq',
                '/panduan-pembeli',
                '/panduan-merchant',

            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}