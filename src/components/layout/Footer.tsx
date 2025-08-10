
export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 sm:py-12">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4">Sleman Mart</h3>
            <p className="text-gray-300 text-sm sm:text-base">
              Platform e-commerce untuk UMKM di Sleman yang mendukung produk
              lokal berkualitas.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm sm:text-base">Link Cepat</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="products.html" className="text-gray-300 hover:text-primary"
                  >Produk</a>
              </li>
              <li>
                <a
                  href="categories.html"
                  className="text-gray-300 hover:text-primary"
                  >Kategori</a>
              </li>
              <li>
                <a href="sellers.html" className="text-gray-300 hover:text-primary"
                  >Penjual</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm sm:text-base">Bantuan</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="help.html" className="text-gray-300 hover:text-primary"
                  >Pusat Bantuan</a>
              </li>
              <li>
                <a href="contact.html" className="text-gray-300 hover:text-primary"
                  >Kontak</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-sm sm:text-base">
              Hubungi Kami
            </h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>Email: info@slemanmart.com</p>
              <p>Telepon: (0274) 123-4567</p>
            </div>
          </div>
        </div>
        <div
          className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-300"
        >
          <p className="text-xs sm:text-sm">
            &copy; 2025 Sleman Mart. Semua hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}