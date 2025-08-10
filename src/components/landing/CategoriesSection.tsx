import { Utensils, Shirt, Gem, Palette, Heater, Sofa } from 'lucide-react';

const categories = [
  { icon: Utensils, text: "Kuliner Siap Saji" },
  { icon: Palette, text: "Kain dan Canting" },
  { icon: Gem, text: "Aksesoris" },
  { icon: Shirt, text: "Fashion dan Aksesoris" },
  { icon: Heater, text: "Olahan Rempah/Minuman" },
  { icon: Sofa, text: "Olahan Makanan dan Kerajinan" },
];

export default function CategoriesSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Kategori Pilihan</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <div key={index} className="flex flex-col items-center p-4 border rounded-lg hover:shadow-md hover:border-primary/80 transition-all cursor-pointer">
              <category.icon className="w-8 h-8 text-primary mb-2" />
              
              <p className="text-center text-xs md:text-sm font-medium text-slate-700">{category.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}