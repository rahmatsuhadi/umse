"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Package, Store } from "lucide-react";

const bottomNavLinks = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Eksplor", href: "/explore", icon: Compass },
    { name: "Produk", href: "/produk", icon: Package },
    { name: "UMKM", href: "/umkm", icon: Store },
];

export function BottomNav() {
    const pathname = usePathname();

    // Hide BottomNav on certain pages if needed, e.g., product detail pages
    // depending on 'path'. But for now, display everywhere.

    return (
        <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white z-[60] h-[70px] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] rounded-t-xl pb-safe">
            <div className="grid grid-cols-4 w-full h-full max-w-md mx-auto px-2">
                {bottomNavLinks.map((link) => {
                    const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                    // Handle root path strictly
                    const isReallyActive = link.href === "/" ? pathname === "/" : isActive;
                    const Icon = link.icon;
                    return (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all ${isReallyActive ? "text-primary font-bold scale-105" : "text-gray-500 hover:text-primary scale-100"
                                }`}
                        >
                            <Icon className={`w-6 h-6 ${isReallyActive ? 'fill-primary/10 stroke-[2.5px]' : 'stroke-2'}`} />
                            <span className="text-[10px] sm:text-[11px] leading-tight text-center">
                                {link.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
