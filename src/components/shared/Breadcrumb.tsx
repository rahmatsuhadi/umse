import Link from "next/link";

interface PropsBredCrumb{
    productData: {
        name: string;
    };
}

export default function Breadcrumb({productData}:PropsBredCrumb) {
    return (<nav className="bg-white border-b px-4 py-3  md:px-8">
        <div className="container mx-auto">
            <div className="flex items-center text-xs sm:text-sm text-gray-600 overflow-x-auto whitespace-nowrap">
                <Link href="/" className="hover:text-primary flex-shrink-0">Beranda</Link>
                <i className="fas fa-chevron-right mx-2 text-gray-400 flex-shrink-0"></i>
                <Link href="/produk" className="hover:text-primary flex-shrink-0">Produk</Link>
                <i className="fas fa-chevron-right mx-2 text-gray-400 flex-shrink-0"></i>
                <span className="text-gray-800 truncate">{productData.name}</span>
            </div>
        </div>
    </nav>)
}