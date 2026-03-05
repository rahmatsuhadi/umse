export interface WebSettings {
    site_identity?: {
        app_name?: string;
        app_description?: string;
        logo_url?: string;
        favicon_url?: string;
    };
    contact?: {
        address?: string;
        email?: string;
        phone?: string;
        whatsapp?: string;
        google_maps_url?: string;
    };
    social_media?: {
        facebook_url?: string;
        instagram_url?: string;
        youtube_url?: string;
        tiktok_url?: string;
        twitter_url?: string;
    };
    footer?: {
        copyright_text?: string;
        about_us_summary?: string;
    };
    seo?: {
        meta_title?: string;
        meta_description?: string;
        meta_keywords?: string;
    };
}
