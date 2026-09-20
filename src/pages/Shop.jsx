import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaStar, FaFilter, FaXmark } from 'react-icons/fa6';
import {
    useGetProductsQuery,
    useGetCategoriesQuery,
} from '../redux/features/products/productsApiSlice';

const Shop = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentCategory = searchParams.get('category') || '';
    const currentSearch = searchParams.get('search') || '';
    const currentSort = searchParams.get('sort') || 'newest';
    const currentIsTrending = searchParams.get('isTrending');
    const currentIsTopRated = searchParams.get('isTopRated');
    const currentPage = parseInt(searchParams.get('page') || '1');

    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const { data: categoriesData } = useGetCategoriesQuery();
    const categories = categoriesData?.categories || [];

    const { data: productsData, isLoading, isFetching } = useGetProductsQuery({
        category: currentCategory,
        search: currentSearch,
        sort: currentSort,
        isTrending: currentIsTrending,
        isTopRated: currentIsTopRated,
        page: currentPage,
        limit: 12,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
    });

    const products = productsData?.products || [];
    const totalPages = productsData?.totalPages || 1;

    const handleCategoryChange = (slug) => {
        const newParams = new URLSearchParams(searchParams);
        if (!slug || slug === 'all') {
            newParams.delete('category');
        } else {
            newParams.set('category', slug);
        }
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const handleSortChange = (sortValue) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('sort', sortValue);
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const handlePageChange = (newPage) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', newPage.toString());
        setSearchParams(newParams);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const clearAllFilters = () => {
        setMinPrice('');
        setMaxPrice('');
        setSearchParams({});
    };

    return (
        <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 transition-colors duration-200'>
            <Navbar />

            {/* Shop Page Banner */}
            <div className='bg-white dark:bg-brand-card border-b border-slate-200/80 dark:border-brand-border py-8'>
                <div className='container'>
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                        <div>
                            <span className='text-xs font-bold uppercase tracking-widest text-primary'>
                                Ready-to-Wear Catalog
                            </span>
                            <h1 className='text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1 capitalize'>
                                {currentCategory
                                    ? currentCategory.replace('-', ' ')
                                    : currentSearch
                                    ? `Results for "${currentSearch}"`
                                    : 'All Collections'}
                            </h1>
                            <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1'>
                                Showing {productsData?.count || 0} pieces available in stock
                            </p>
                        </div>

                        {/* Controls */}
                        <div className='flex items-center gap-3 w-full md:w-auto justify-between md:justify-end'>
                            <button
                                onClick={() => setMobileFilterOpen(true)}
                                className='md:hidden flex items-center gap-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-brand-border px-4 py-2 rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs'
                            >
                                <FaFilter className='text-primary' /> Filters
                            </button>

                            <div className='flex items-center gap-2 text-xs'>
                                <label className='text-slate-500 dark:text-slate-400 font-semibold whitespace-nowrap'>
                                    Sort:
                                </label>
                                <select
                                    value={currentSort}
                                    onChange={(e) => handleSortChange(e.target.value)}
                                    className='bg-white dark:bg-brand-card border border-slate-200 dark:border-brand-border rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-primary shadow-xs'
                                >
                                    <option value="newest">New Arrivals</option>
                                    <option value="popular">Most Popular</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className='flex-1 container py-8'>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
                    {/* Desktop Sidebar Filters */}
                    <aside className='hidden md:block col-span-1 space-y-6'>
                        {/* Categories List */}
                        <div className='bg-white dark:bg-brand-card p-5 rounded-2xl border border-slate-200/80 dark:border-brand-border shadow-card'>
                            <h3 className='font-bold text-xs uppercase tracking-wider text-slate-400 mb-3'>
                                Collections
                            </h3>
                            <ul className='space-y-1.5 text-xs sm:text-sm'>
                                <li>
                                    <button
                                        onClick={() => handleCategoryChange('all')}
                                        className={`w-full text-left py-2 px-3 rounded-xl transition-all font-medium ${
                                            !currentCategory
                                                ? 'bg-primary text-slate-950 font-bold shadow-xs'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        }`}
                                    >
                                        All Apparel
                                    </button>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            onClick={() => handleCategoryChange(cat.slug)}
                                            className={`w-full text-left py-2 px-3 rounded-xl transition-all font-medium ${
                                                currentCategory === cat.slug
                                                    ? 'bg-primary text-slate-950 font-bold shadow-xs'
                                                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Range Filter */}
                        <div className='bg-white dark:bg-brand-card p-5 rounded-2xl border border-slate-200/80 dark:border-brand-border shadow-card'>
                            <h3 className='font-bold text-xs uppercase tracking-wider text-slate-400 mb-3'>
                                Price Filter ($)
                            </h3>
                            <div className='flex items-center gap-2 mb-4'>
                                <input
                                    type="number"
                                    placeholder='Min'
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className='w-full border border-slate-200 dark:border-brand-border dark:bg-slate-800 dark:text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary'
                                />
                                <span className='text-slate-400'>-</span>
                                <input
                                    type="number"
                                    placeholder='Max'
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className='w-full border border-slate-200 dark:border-brand-border dark:bg-slate-800 dark:text-white rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-primary'
                                />
                            </div>
                            <button
                                onClick={clearAllFilters}
                                className='w-full text-center text-xs text-primary hover:underline font-semibold py-1'
                            >
                                Reset Filters
                            </button>
                        </div>
                    </aside>

                    {/* Mobile Drawer Filter */}
                    {mobileFilterOpen && (
                        <div className='fixed inset-0 bg-black/60 z-50 flex justify-end backdrop-blur-xs'>
                            <div className='w-[280px] bg-white dark:bg-brand-card h-full p-6 overflow-y-auto space-y-6 shadow-2xl'>
                                <div className='flex items-center justify-between border-b dark:border-slate-800 pb-4'>
                                    <h2 className='text-base font-bold text-slate-900 dark:text-white'>Filter Products</h2>
                                    <button
                                        onClick={() => setMobileFilterOpen(false)}
                                        className='text-slate-500 hover:text-slate-800 dark:hover:text-white text-lg'
                                    >
                                        <FaXmark />
                                    </button>
                                </div>
                                <div>
                                    <h3 className='font-bold text-xs uppercase tracking-wider text-slate-400 mb-3'>Categories</h3>
                                    <ul className='space-y-1.5 text-xs font-medium'>
                                        <li>
                                            <button
                                                onClick={() => { handleCategoryChange('all'); setMobileFilterOpen(false); }}
                                                className={`w-full text-left py-2 px-3 rounded-xl ${!currentCategory ? 'bg-primary text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                                            >
                                                All Apparel
                                            </button>
                                        </li>
                                        {categories.map((cat) => (
                                            <li key={cat.id}>
                                                <button
                                                    onClick={() => { handleCategoryChange(cat.slug); setMobileFilterOpen(false); }}
                                                    className={`w-full text-left py-2 px-3 rounded-xl ${currentCategory === cat.slug ? 'bg-primary text-slate-950 font-bold' : 'text-slate-700 dark:text-slate-300'}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <button
                                    onClick={() => { clearAllFilters(); setMobileFilterOpen(false); }}
                                    className='w-full bg-primary text-slate-950 py-2.5 rounded-full text-xs font-bold'
                                >
                                    Reset Filters
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className='col-span-1 md:col-span-3'>
                        {isLoading || isFetching ? (
                            <div className='flex justify-center items-center py-28'>
                                <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
                            </div>
                        ) : products.length === 0 ? (
                            <div className='text-center py-20 bg-white dark:bg-brand-card rounded-2xl p-8 border border-slate-200/80 dark:border-brand-border shadow-card'>
                                <p className='text-base font-bold text-slate-900 dark:text-white mb-2'>No apparel pieces found</p>
                                <p className='text-xs text-slate-500 mb-6'>Try broadening your filters or searching for another keyword.</p>
                                <button
                                    onClick={clearAllFilters}
                                    className='bg-primary text-slate-950 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-primary-dark hover:text-white transition-colors'
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            <div>
                                <div className='grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6'>
                                    {products.map((product) => {
                                        const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800';
                                        return (
                                            <Link
                                                to={`/products/${product.id}`}
                                                key={product.id}
                                                className='group bg-white dark:bg-brand-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col'
                                            >
                                                <div className='relative h-[240px] sm:h-[280px] overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center'>
                                                    <img
                                                        src={mainImage}
                                                        alt={product.name}
                                                        className='h-full w-full object-cover object-top group-hover:scale-105 duration-500 transition-transform'
                                                    />
                                                    {product.discountPrice && (
                                                        <span className='absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full shadow-xs'>
                                                            Sale
                                                        </span>
                                                    )}
                                                    {product.stock <= 0 && (
                                                        <div className='absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center'>
                                                            <span className='text-white font-bold text-xs uppercase tracking-wider px-3 py-1 bg-red-600 rounded-md'>
                                                                Out of Stock
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className='p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3'>
                                                    <div>
                                                        <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1'>
                                                            {product.category?.name || 'Fashion'}
                                                        </span>
                                                        <h3 className='font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors'>
                                                            {product.name}
                                                        </h3>
                                                    </div>

                                                    <div className='pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
                                                        <div className='flex items-center gap-1 text-amber-500 text-xs'>
                                                            <FaStar className='text-[11px]' />
                                                            <span className='font-bold text-slate-700 dark:text-slate-300 text-xs'>
                                                                {product.rating || '4.8'}
                                                            </span>
                                                        </div>

                                                        <div className='flex items-baseline gap-1.5'>
                                                            {product.discountPrice && (
                                                                <span className='text-xs line-through text-slate-400'>
                                                                    ${Number(product.price).toFixed(2)}
                                                                </span>
                                                            )}
                                                            <span className='text-sm sm:text-base font-extrabold text-slate-900 dark:text-white'>
                                                                ${Number(product.discountPrice || product.price).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className='flex justify-center items-center gap-2 mt-12'>
                                        <button
                                            disabled={currentPage <= 1}
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            className='px-4 py-2 border border-slate-200 dark:border-brand-border rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        >
                                            &larr; Prev
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => handlePageChange(p)}
                                                className={`w-9 h-9 rounded-full text-xs font-bold ${
                                                    currentPage === p
                                                        ? 'bg-primary text-slate-950 font-black shadow-xs'
                                                        : 'border border-slate-200 dark:border-brand-border text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <button
                                            disabled={currentPage >= totalPages}
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            className='px-4 py-2 border border-slate-200 dark:border-brand-border rounded-full text-xs font-bold text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800'
                                        >
                                            Next &rarr;
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Shop;
