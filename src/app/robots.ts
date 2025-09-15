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
                '/proifle',
                '/literasi',
                '/pameran',
                '/pelatihan',

            ],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}