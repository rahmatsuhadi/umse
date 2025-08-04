'use client'; // Pastikan ada 'use client'

import { motion } from 'framer-motion';
import { Store, Building2, Info, GraduationCap, BarChart } from 'lucide-react';
import Image from 'next/image';

const features = [
  { link: "/icon/cart-user.svg", icon: Store, text: "Pasar Sleman" },
  { link: "/icon/store.svg", icon: Building2, text: "Direktori UMKM" },
  { link: "/icon/announce.svg", icon: Info, text: "Info Pameran" },
  { link: "/icon/video-present.svg", icon: GraduationCap, text: "Info Pelatihan" },
  { link: "/icon/book-search.svg", icon: BarChart, text: "Literasi UMKM" },
];
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Jeda antar kemunculan ikon
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

export default function FeaturesSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-5 md:gap-16 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div key={index} className="flex flex-col items-center  border-black/20 border shadow-sm  rounded-xl p-6" variants={itemVariants}>
              <div className="flex items-center justify-centermb-4 h-20">
                {/* <feature.icon className="w-10 h-10 text-pink-600" /> */}
                <Image src={feature.link} alt={feature.text} width={100} height={100}/>
              </div>
              <h3 className="font-semibold text-slate-700">{feature.text}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}