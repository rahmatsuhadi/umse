import Link from "next/link";
import React from "react";

interface BreadcrumbProps {
    breadcrumbs: { name: string; link?: string; active?: boolean }[];
}

export default function Breadcrumb({ breadcrumbs }: BreadcrumbProps) {
    return (
        <nav className="border-b px-4 py-3 md:px-8">
            <div className="container mx-auto">
                <div className="flex items-center text-xs sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
                    {breadcrumbs.map((breadcrumb, index) => (
                        <React.Fragment key={index}>
                            {/* Render Link jika ada link */}
                            {breadcrumb.link ? (
                                <Link href={breadcrumb.link} className="hover:text-primary flex-shrink-0">
                                    {breadcrumb.name}
                                </Link>
                            ) : (
                                // Jika tidak ada link, tampilkan nama biasa
                                <span className={`truncate ${breadcrumb.active ? "text-primary" : "text-gray-800"}`}>
                                    {breadcrumb.name}
                                </span>
                            )}
                            {/* Separator */}
                            {index < breadcrumbs.length - 1 && (
                                <i className="fas fa-chevron-right mx-2 text-gray-400 flex-shrink-0"></i>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </nav>
    );
}
