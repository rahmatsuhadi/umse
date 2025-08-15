

const categories = [
  { icon: "fas fa-utensils", text: "Kuliner Siap Saji" },
  { icon: "fas fa-cookie-bite", text: "Kain dan Canting" },
  { icon: "fas fa-handshake", text: "Aksesoris" },
  { icon: "fas fa-tshirt", text: "Fashion dan Aksesoris" },
  { icon: "fas fa-snowflake", text: "Olahan Kemasan dan Frozen" },
  { icon: "fas fa-box", text: "Olahan Makanan dan Kerajinan" },
];

export default function CategoriesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Kategori Pilihan</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center p-3 sm:p-4 bg-orange-50 hover:bg-orange-100 rounded-lg border border-orange-200 hover:border-primary transition duration-300 group cursor-pointer">
              {/* <category.icon className="w-8 h-8 text-primary mb-2" /> */}
              <div
                className="bg-primary rounded-lg w-10 h-8 sm:w-12 sm:h-10 flex items-center justify-center mb-2"
              >
                <i className={`${category.icon} text-white text-sm sm:text-base`}></i>
              </div>
              <h3
                className="text-xs sm:text-sm font-medium text-gray-800 text-center leading-tight"
              >
                {category.text}
              </h3>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}