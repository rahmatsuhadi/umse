import Link from "next/link";

interface PropsBredCrumb {
    currentPage: string;
    active?: boolean
}

export default function Breadcrumb({ currentPage, active = false }: PropsBredCrumb) {
    return (<nav className=" border-b px-4 py-3  md:px-8">
        <div className="container mx-auto">
            <div className="flex items-center text-xs sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
                <Link href="/" className="hover:text-primary flex-shrink-0">Beranda</Link>
                {/* <i className="fas fa-chevron-right mx-2 text-gray-400 flex-shrink-0"></i> */}
                {/* <Link href="/" className="hover:text-primary flex-shrink-0">Produk</Link> */}
                <i className="fas fa-chevron-right mx-2 text-gray-400 flex-shrink-0"></i>
                <span className={`truncate ${active ? "text-primary" : "text-gray-800"}`}>{currentPage}</span>
            </div>
        </div>
    </nav>)
}