"use client"
import { useEffect, useRef, useState } from "react";

const FilterSortModal = () => {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isSortModalOpen, setIsSortModalOpen] = useState(false);
    const [minPrice, setMinPrice] = useState<number | string>('');
    const [maxPrice, setMaxPrice] = useState<number | string>('');

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

    const applyFilter = () => {
        console.log('Filter applied');
    };

    const applySorting = () => {
        console.log('Sorting applied');
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

    return (
        <>

            {/* <!-- Search Bar - Top Section --> */}
            <section className="py-3  border-b ">
                <div className="container mx-auto px-4 ">
                    <div className="flex items-center gap-3">
                        {/* <!-- Search Bar --> */}
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Cari produk..."
                                    className="w-full pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                                />
                                <i
                                    className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                ></i>
                            </div>
                        </div>

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
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Semua Kategori</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Makanan & Minuman</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Fashion & Aksesoris</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Kerajinan Tangan</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Kecantikan & Kesehatan</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Pertanian Organik</span>
                                </label>
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
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="popular"
                                    className="border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-3 text-sm text-gray-700">Terpopuler</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="newest"
                                    className="border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-3 text-sm text-gray-700">Terbaru</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="price-low"
                                    className="border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-3 text-sm text-gray-700">Harga Terendah</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="price-high"
                                    className="border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-3 text-sm text-gray-700">Harga Tertinggi</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="rating"
                                    className="border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-3 text-sm text-gray-700">Rating Tertinggi</span>
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="name"
                                    className="border-gray-300 text-primary focus:ring-primary"
                                />
                                <span className="ml-3 text-sm text-gray-700">Nama A-Z</span>
                            </label>
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