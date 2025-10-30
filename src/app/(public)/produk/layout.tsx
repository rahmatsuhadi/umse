import Image from "next/image";
import Link from "next/link";

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="">
        <header className="bg-white shadow-md sticky top-0">
          <div className="container mx-auto px-4 ">
            <div className="flex items-center justify-between min-h-16 py-2">
              <div className="flex items-center">
                <Image
                  src="/logo_kab_sleman.png"
                  alt="Slemanmart Logo"
                  width={45}
                  height={45}
                />

                <div className="flex-shrink-0 ml-4">
                  <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/slemanmartlogo.png"
                      alt="Slemanmart Logo"
                      width={150}
                      height={150}
                    />
                  </Link>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-4">
                <Link
                  href="/"
                  className="text-primary hover:text-primary-dark text-sm sm:text-base flex items-center"
                >
                  <i className="fas fa-arrow-left mr-1"></i>
                  <span className="hidden sm:inline">Kembali ke Produk</span>
                  <span className="sm:hidden">Kembali</span>
                </Link>
                <Link
                  href="/"
                  className="text-primary hover:text-primary-dark text-sm sm:text-base flex items-center"
                >
                  <i className="fas fa-home mr-1"></i>
                  <span className="hidden sm:inline">Beranda</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* ===== Breadcrumb ===== */}
      </div>
      {children}
    </div>
  );
}
