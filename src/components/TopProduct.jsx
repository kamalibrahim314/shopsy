import React from 'react';
import { FaStar, FaEye, FaBagShopping } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../redux/features/products/productsApiSlice';
import { useAddToCartMutation } from '../redux/features/cart/cartApiSlice';
import { useSelector } from 'react-redux';

const TopProduct = ({ handlePopup }) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const { data, isLoading } = useGetProductsQuery({
        isTopRated: true,
        limit: 3,
    });

    const [addToCartApi] = useAddToCartMutation();

    const products = data?.products || [];

    const handleQuickAdd = async (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await addToCartApi({
                productId: product.id,
                quantity: 1,
                size: product.sizes?.[0] || 'M',
                color: product.colors?.[0] || 'Default',
            }).unwrap();
            navigate('/cart');
        } catch (err) {
            console.error('Quick add failed:', err);
            navigate(`/products/${product.id}`);
        }
    };

    return (
        <section className='py-16 bg-slate-50 dark:bg-brand-dark/50 border-b border-slate-200/60 dark:border-brand-border/60 transition-colors duration-200'>
            <div className='container'>
                {/* Header section */}
                <div className='text-center max-w-2xl mx-auto mb-12'>
                    <span className='inline-block text-xs font-bold uppercase tracking-widest text-primary mb-2'>
                        Signature Craftsmanship
                    </span>
                    <h2 className='text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight'>
                        Best Selling Highlights
                    </h2>
                    <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed'>
                        Our most celebrated garments, distinguished by artisanal tailoring, fine fabrics, and timeless styling.
                    </p>
                </div>

                {/* Body section */}
                {isLoading ? (
                    <div className='flex justify-center items-center py-16'>
                        <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {products.map((product, idx) => {
                            const image = product.images?.[0] || 'https://images.unsplash.com/photo-1539533018447-63fcce667883?w=800';
                            return (
                                <div
                                    key={product.id}
                                    className='group bg-white dark:bg-brand-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col'
                                >
                                    {/* Image frame */}
                                    <div className='relative h-[320px] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center'>
                                        <img
                                            src={image}
                                            alt={product.name}
                                            className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500'
                                        />

                                        {/* Badges */}
                                        <div className='absolute top-3 left-3 flex flex-col gap-1.5'>
                                            <span className='bg-primary text-slate-900 font-extrabold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm'>
                                                Top Rated #{idx + 1}
                                            </span>
                                            {product.discountPrice && (
                                                <span className='bg-red-500 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full'>
                                                    Sale
                                                </span>
                                            )}
                                        </div>

                                        {/* Hover Overlay Button */}
                                        <div className='absolute inset-0 bg-slate-900/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 p-4'>
                                            <Link
                                                to={`/products/${product.id}`}
                                                className='bg-white text-slate-900 p-3 rounded-full hover:scale-110 transition-transform shadow-lg'
                                                title="View Details"
                                            >
                                                <FaEye />
                                            </Link>
                                            <button
                                                onClick={(e) => handleQuickAdd(e, product)}
                                                className='bg-primary text-slate-900 p-3 rounded-full hover:scale-110 transition-transform shadow-lg'
                                                title="Add to Bag"
                                            >
                                                <FaBagShopping />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content Details */}
                                    <div className='p-6 flex-1 flex flex-col justify-between space-y-4'>
                                        <div>
                                            <div className='flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5'>
                                                <span className='font-semibold uppercase tracking-wider text-primary'>
                                                    {product.category?.name || "Clothing"}
                                                </span>
                                                <div className='flex items-center gap-1 text-amber-500'>
                                                    <FaStar className='text-xs' />
                                                    <span className='font-bold text-slate-800 dark:text-slate-200'>{product.rating || '4.9'}</span>
                                                    <span className='text-[10px] text-slate-400'>({product.numReviews || 50})</span>
                                                </div>
                                            </div>

                                            <Link to={`/products/${product.id}`}>
                                                <h3 className='font-bold text-base sm:text-lg text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors'>
                                                    {product.name}
                                                </h3>
                                            </Link>

                                            <p className='text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed'>
                                                {product.description}
                                            </p>
                                        </div>

                                        <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between'>
                                            <div>
                                                <span className='text-[10px] uppercase text-slate-400 block font-medium'>Price</span>
                                                <div className='flex items-baseline gap-2'>
                                                    <span className='text-xl font-extrabold text-slate-900 dark:text-white'>
                                                        ${Number(product.discountPrice || product.price).toFixed(2)}
                                                    </span>
                                                    {product.discountPrice && (
                                                        <span className='text-xs text-slate-400 line-through'>
                                                            ${Number(product.price).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <Link
                                                to={`/products/${product.id}`}
                                                className='bg-slate-100 hover:bg-primary dark:bg-slate-800 dark:hover:bg-primary text-slate-800 dark:text-slate-200 hover:text-slate-900 dark:hover:text-slate-900 font-bold text-xs px-4 py-2.5 rounded-full transition-all duration-200'
                                            >
                                                Select Options
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
};

export default TopProduct;