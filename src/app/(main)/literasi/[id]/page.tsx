import ContactSection from "@/components/landing/Contact";
import ArticleContent from "@/components/literacies/ArticleContent";
import { AnimatedWrapper } from "@/components/shared/AnimateWrapper";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Navbar } from "@/components/shared/Navbar";
import { Metadata } from "next";
import { notFound } from "next/navigation";


// Tipe data untuk detail artikel
export type ArticleDetail = {
    slug: string;
    title: string;
    summary: string;
    imageUrl: string;
    category: {
        name: string;
        slug: string;
    };
    published_at: string;
    reading_time: number; // dalam menit
    views: number;
    contentHtml: string; // Konten artikel dalam format HTML
};

// Data dummy untuk disajikan
const dummyArticleData: ArticleDetail = {
    slug: 'panduan-lengkap-memulai-umkm',
    title: 'Panduan Lengkap Memulai UMKM dari Nol: Dari Ide hingga Eksekusi',
    summary: 'Pelajari langkah-langkah praktis untuk memulai usaha mikro, kecil, dan menengah dari tahap perencanaan hingga implementasi yang sukses.',
    imageUrl: 'https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80',
    category: {
        name: 'Panduan Bisnis',
        slug: 'panduan-bisnis',
    },
    published_at: '2025-08-25T10:00:00Z',
    reading_time: 15,
    views: 2534,
    contentHtml: `
    <h2>Pendahuluan</h2>
    <p>Memulai usaha mikro, kecil, dan menengah (UMKM) bukan hanya tentang memiliki ide bagus, tetapi juga tentang bagaimana mengeksekusi ide tersebut dengan tepat. Banyak calon entrepreneur yang memiliki ide brilian namun tidak tahu bagaimana memulainya.</p>
    <p>Artikel ini akan memandu Anda melalui setiap tahap memulai UMKM, dari riset pasar hingga peluncuran produk pertama.</p>
    
    <h2>1. Riset dan Validasi Ide Bisnis</h2>
    <p>Langkah pertama dalam memulai UMKM adalah memvalidasi ide bisnis Anda. Tidak semua ide yang terdengar bagus akan berhasil di pasar.</p>
    <h3>Analisis Pasar</h3>
    <ul>
        <li><strong>Identifikasi target market:</strong> Siapa yang akan membeli produk/jasa Anda?</li>
        <li><strong>Analisis kompetitor:</strong> Siapa saja pesaing Anda dan apa keunggulan mereka?</li>
        <li><strong>Ukuran pasar:</strong> Seberapa besar peluang pasar untuk produk Anda?</li>
    </ul>
    
    <h2>2. Perencanaan Bisnis</h2>
    <p>Setelah ide Anda tervalidasi, langkah selanjutnya adalah membuat business plan. Ini adalah blueprint untuk kesuksesan bisnis Anda.</p>
    <figure>
        <img src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" alt="Business Planning" style="border-radius: 0.5rem; margin-top: 1rem; margin-bottom: 1rem;" />
        <figcaption style="text-align: center; font-size: 0.875rem; color: #6B7280;">Perencanaan yang matang adalah kunci utama.</figcaption>
    </figure>
    
    <h2>3. Persiapan Legal dan Administrasi</h2>
    <p>Mengurus aspek legal adalah langkah penting yang tidak boleh diabaikan. Dokumen yang perlu Anda siapkan antara lain NIB (Nomor Induk Berusaha) dan NPWP.</p>
    
    <h2>Kesimpulan</h2>
    <p>Memulai UMKM memang memerlukan persiapan yang matang, namun dengan langkah-langkah yang tepat, impian menjadi entrepreneur sukses bisa terwujud. Ingatlah bahwa setiap bisnis besar dimulai dari langkah kecil.</p>
  `,
};

// Fungsi untuk "mengambil" data berdasarkan slug
export const getArticleBySlug = async (slug: string): Promise<ArticleDetail | null> => {
    console.log(`Fetching article for slug: ${slug}`);
    // Dalam aplikasi nyata, di sini Anda akan memanggil database atau CMS
    // Untuk simulasi, kita hanya akan mengembalikan data dummy jika slug-nya cocok
    // if (slug === dummyArticleData.slug) {
    return dummyArticleData;
    // }
    
};

// 1. Fungsi untuk generate SEO Metadata secara dinamis
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const slug = (await  params).id;
  const article = await getArticleBySlug(slug);

  // Jika artikel tidak ditemukan, berikan metadata default
  if (!article) {
    return {
      title: "Artikel Tidak Ditemukan",
      description: "Halaman yang Anda cari tidak tersedia.",
    };
  }

  // Jika artikel ditemukan, buat metadata dinamis
  return {
    title: article.title,
    description: article.summary,
    keywords: ['UMKM', 'Literasi Bisnis', article.category.name, ...article.title.split(' ').slice(0, 5)],
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `/literasi/${article.slug}`,
      siteName: 'Literasi UMKM Anda', // Ganti dengan nama situs Anda
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: 'id_ID',
      type: 'article',
    },
    twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.summary,
        images: [article.imageUrl],
    },
  };
}


type PageProps = {
    params: {
        id: string;
    };
};

export default async function ArticleDetailPage({ params }: PageProps) {
    const { id: slug } = await params;

    // Ambil data artikel di server
    const article = await getArticleBySlug(slug);

    // Jika artikel tidak ditemukan, tampilkan halaman 404
    if (!article) {
        notFound();
    }

    return (
        <div className="">
            <Navbar />
            <Breadcrumb breadcrumbs={[{
                name: "Beranda", link: "/",
            }, {
                name: "Literasi", link: "/literasi",
            }, {
                name: article.title, active: true,
            }]} />


            <ArticleContent article={article} />



            <AnimatedWrapper>
                <ContactSection />
            </AnimatedWrapper>
        </div>
    )
}