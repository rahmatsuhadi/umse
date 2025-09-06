"use client"
import { useCategories } from "@/features/categories/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SearchBar from "./SearchBar";

const FilterSortModal = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isSortModalOpen, setIsSortModalOpen] = useState(false);
    const [minPrice, setMinPrice] = useState<number | string>('');
    const [maxPrice, setMaxPrice] = useState<number | string>('');

    const categoriesParams = searchParams.get('category')?.split(',') || [];


    const [selectedCategories, setSelectedCategories] = useState<string[]>(categoriesParams);
    const [selectedSort, setSelectedSort] = useState<string>('');

    const { data } = useCategories();

    const categories = data?.data || []

    // 1. useEffect BARU untuk mengatur sort default di URL
    useEffect(() => {
        const currentSort = searchParams.get('sort');
        // Jika tidak ada parameter 'sort' di URL
        if (!currentSort) {
            const params = new URLSearchParams(searchParams.toString());
            params.set('sort', '-created_at'); // Atur nilai default
            // Gunakan router.replace agar tidak menambah riwayat browser
            router.replace(`?${params.toString()}`, { scroll: false });
        }
    }, [searchParams, router]);

    // 2. useEffect BARU untuk menyinkronkan state dengan URL
    useEffect(() => {
        const categories = searchParams.get('category')?.split(',') || [];
        const sort = searchParams.get('sort') || '-created_at'; // Gunakan default jika tidak ada

        setSelectedCategories(categories);
        setSelectedSort(sort);
        // Set state harga juga dari URL jika ada
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');

    }, [searchParams]);

    const toggleCategory = (slug: string) => {
        setSelectedCategories((prev) =>
            prev.includes(slug)
                ? prev.filter((item) => item !== slug)
                : [...prev, slug]
        );
    };


    const filterModalRef = useRef<HTMLDivElement>(null);
    const sortModalRef = useRef<HTMLDivElement>(null);

    const openFilterModal = () => setIsFilterModalOpen(true);
    const closeFilterModal = () => setIsFilterModalOpen(false);
    const openSortModal = () => setIsSortModalOpen(true);
    const closeSortModal = () => setIsSortModalOpen(false);

    const resetFilter = () => {
        setMinPrice('');
        setMaxPrice('');
    };



    useEffect(() => {
        const categories = searchParams.get('category')?.split(',') || [];
        setSelectedCategories(categories);
    }, [searchParams]);

    const applyFilter = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedCategories.length > 0) {
            params.set('category', selectedCategories.join(','));
        } else {
            params.delete('category');
        }

        // Set new values
        if (minPrice) params.set('minPrice', String(minPrice));
        else params.delete('minPrice');

        if (maxPrice) params.set('maxPrice', String(maxPrice));
        else params.delete('maxPrice');

        // Update the URL
        router.replace(`?${params.toString()}`, { scroll: false });
        closeFilterModal();
    };

    const applySorting = () => {
        const params = new URLSearchParams(searchParams.toString());

        if (selectedSort) {
            params.set('sort', selectedSort);
        } else {
            params.delete('sort');
        }

        router.push(`?${params.toString()}`, { scroll: false });
        closeSortModal();
    };

    // Handle click outside to close modals
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (filterModalRef.current && !filterModalRef.current.contains(event.target as Node)) {
                setIsFilterModalOpen(false);
            }

            if (sortModalRef.current && !sortModalRef.current.contains(event.target as Node)) {
                setIsSortModalOpen(false);
            }
        };

        // Add event listener on mount
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up event listener on unmount
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const sortOptions = [
        { value: '-total_sales', label: 'Terpopuler' },
        { value: '-created_at', label: 'Terbaru' },
        { value: 'price', label: 'Harga Rendah' },
        { value: '-price', label: 'Harga Tinggi' },
        { value: '-average_rating', label: 'Rating Tertinggi' },
        { value: 'name', label: 'Nama A-Z' },
    ];

    return (
        <>

            {/* <!-- Search Bar - Top Section --> */}
            <section className="py-3  border-b ">
                <div className="container mx-auto px-4 ">
                    <div className="flex items-center gap-3">
                        {/* <!-- Search Bar --> */}
                        <SearchBar />

                        {/* <!-- Filter Icon --> */}
                        <button
                            onClick={openFilterModal}
                            id="filterBtn"
                            className="p-2 sm:p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
                        >
                            <i className="fas fa-filter text-gray-600"></i>
                        </button>

                        {/* <!-- Sort Icon --> */}
                        <button
                            onClick={openSortModal}
                            id="sortBtn"
                            className="p-2 sm:p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
                        >
                            <i className="fas fa-sort-amount-down text-gray-600"></i>
                        </button>
                    </div>
                </div>
            </section>


            {/* Filter Modal */}
            <div
                ref={filterModalRef}
                className={`fixed inset-0 bg-black/20 bg-opacity-70 z-50 flex items-end sm:items-center justify-center transition-opacity duration-300 ${isFilterModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}

            >
                <div className={`bg-white shadow border rounded-t-lg sm:rounded-lg w-full sm:max-w-md max-h-[80vh] overflow-y-auto transition-transform duration-500 transform ${isFilterModalOpen ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Filter Produk</h3>
                            <button
                                onClick={closeFilterModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <div className="p-4 space-y-4">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
                            <div className="space-y-2">
                                {categories?.map((category) => (
                                    <label key={category.slug} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={selectedCategories.includes(category.slug)}
                                            onChange={() => toggleCategory(category.slug)}
                                            className="rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">{category.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Rentang Harga</label>
                            <div className="flex md:flex-row flex-col md:items-center space-x-2">
                                <input
                                    type="number"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    placeholder="Min"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                                <span className="text-gray-500">-</span>
                                <input
                                    type="number"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    placeholder="Max"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <div className="flex space-x-3">
                            <button
                                onClick={resetFilter}
                                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition duration-300"
                            >
                                Reset
                            </button>
                            <button
                                onClick={applyFilter}
                                className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300"
                            >
                                Terapkan
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sort Modal */}
            <div
                ref={sortModalRef}
                className={`fixed inset-0 bg-black/20 bg-opacity-70 z-50 flex items-end sm:items-center justify-center transition-opacity duration-300 ${isSortModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}

            >
                <div className={`bg-white shadow border rounded-t-lg sm:rounded-lg w-full sm:max-w-md max-h-[80vh] overflow-y-auto transition-transform duration-500 transform ${isSortModalOpen ? 'translate-y-0' : 'translate-y-full'}`}>

                    {/* <div className="bg-white rounded-t-lg sm:rounded-lg w-full sm:max-w-sm"> */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Urutkan Produk</h3>
                            <button
                                onClick={closeSortModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                    </div>

                    <div className="p-4">
                        <div className="space-y-3">
                            {sortOptions.map((item, i) => (

                                <label className="flex items-center" key={i}>
                                    <input
                                        type="radio"
                                        name="sort"
                                        value={item.value}
                                        checked={selectedSort === item.value}
                                        onChange={(e) => setSelectedSort(e.target.value)}
                                        className="border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-3 text-sm text-gray-700">{item.label}</span>
                                </label>
                            ))}


                        </div>
                    </div>

                    <div className="p-4 border-t border-gray-200">
                        <button
                            onClick={applySorting}
                            className="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition duration-300"
                        >
                            Terapkan
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterSortModal;