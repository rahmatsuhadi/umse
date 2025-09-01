'use client'; // Pastikan ada 'use client'

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
    { link: "/", icon: "fas fa-shopping-basket", text: "Pasar Sleman" },
    { link: "?#store", icon: "fas fa-store", text: "Direktori UMKM" },
    { link: "/pameran", icon: "fas fa-bullhorn", text: "Info Pameran" },
    { link: "/pelatihan", icon: "fas fa-graduation-cap ", text: "Info Pelatihan" },
    { link: "/literasi", icon: "fas fa-book-open ", text: "Literasi UMKM" },
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
        <section className="pb-12 md:pb-20 ">
            <div className="container mx-auto px-4">
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-3"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {features.map((feature, index) => (
                        <Link href={feature.link} key={index}
                        >
                            <motion.div key={index} className="flex flex-col items-center p-2 sm:p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition duration-300 group" variants={itemVariants}>
                                <div
                                    className="bg-orange-100 rounded-full w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 flex items-center justify-center mb-1 sm:mb-3 group-hover:bg-primary-light transition duration-300"
                                >
                                    <i
                                        className={`text-primary text-sm sm:text-lg lg:text-2xl ${feature.icon}`}
                                    ></i>
                                </div>

                                <h3 className="font-semibold text-slate-700">{feature.text}</h3>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}