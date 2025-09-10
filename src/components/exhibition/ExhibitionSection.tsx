"use client"

import { motion } from 'framer-motion'; // 1. Impor motion dari framer-motion
import ExhibitionCard from './ExhibitionCard';
// import Pagination from '../shared/Pagination';



// 2. Definisikan varian animasi untuk container dan item
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, // Jeda animasi antar kartu (dalam detik)
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 }, // Mulai dari bawah & transparan
  visible: { opacity: 1, y: 0 }, // Muncul ke posisi normal
};


export default function ExhibitionSection() {
  return (
    <div >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {[12, 1, 1,].map((item, index) => (
          <motion.div key={index} variants={itemVariants}>
            <ExhibitionCard />
          </motion.div>
        ))}
      </motion.div>
      {/* <Pagination /> */}
    </div>
  )
}