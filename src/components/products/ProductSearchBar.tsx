import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ProductSearchBar() {

    const router = useRouter();
    const searchParams = useSearchParams();
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);


    const queryParam = searchParams.get("q") || "";

    const [searchQuery, setSearchQuery] = useState(queryParam);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchQuery(value);

        // Hapus timeout sebelumnya jika ada
        if (debounceTimeout) {
            clearTimeout(debounceTimeout);
        }

        // Set timeout baru
        const timeout = setTimeout(() => {
            updateSearchQuery(value);
        }, 3000); 

        setDebounceTimeout(timeout);
    };

    // Fungsi untuk memperbarui query di URL
    const updateSearchQuery = (newQuery: string) => {
        const params = new URLSearchParams(window.location.search);
        if (newQuery) {
            params.set("q", newQuery); // Set query parameter 'q'
        } else {
            params.delete("q"); // Hapus jika kosong
        }

        // Update URL tanpa reload halaman
        router.push(`?${params.toString()}`,{scroll:false});
    };

    const handleSearch = () => {
        updateSearchQuery(searchQuery); // Memperbarui URL ketika pengguna klik ikon atau tekan Enter
    };
    return (
        <div className="flex-1">
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyUp={(e) => {
                        if (e.key === "Enter") handleSearch(); // Trigger pencarian dengan Enter
                    }}
                    placeholder="Cari produk..."
                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                />
                <i
                    className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
                    onClick={handleSearch}
                ></i>
            </div>
        </div>
    )
}