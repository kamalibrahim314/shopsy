import React from 'react';
import { FaStar, FaCartPlus } from 'react-icons/fa6';
import { Link, useNavigate } from 'react-router-dom';
import { useGetProductsQuery } from '../redux/features/products/productsApiSlice';
import { useAddToCartMutation } from '../redux/features/cart/cartApiSlice';
import { useSelector } from 'react-redux';

const Products = ({
    title = "New Season Arrivals",
    subtitle = "Curated For You",
    category,
    limit = 10,
    sort = "newest",
}) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const { data, isLoading, isError } = useGetProductsQuery({
        limit,
        category,
        sort,
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
            navigate(`/products/${product.id}`);
        }
    };

    return (
        <section className='py-16 transition-colors duration-200'>
            <div className='container'>
                {/* Header section */}
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10'>
                    <div>
                        <span className='text-xs font-bold uppercase tracking-widest text-primary block mb-1'>
                            {subtitle}
                        </span>
                        <h2 className='text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight'>
                            {title}
                        </h2>
                    </div>

                    <Link
                        to="/shop"
                        className='text-xs sm:text-sm font-bold text-primary hover:text-primary-dark dark:hover:text-amber-400 transition-colors flex items-center gap-1.5'
                    >
                        Explore All Products &rarr;
                    </Link>
                </div>

                {/* Body section */}
                {isLoading ? (
                    <div className='flex justify-center items-center py-20'>
                        <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
                    </div>
                ) : isError ? (
                    <div className='text-center py-12 text-slate-400 text-sm'>
                        Could not load collection at this time. Please try again.
                    </div>
                ) : products.length === 0 ? (
                    <div className='text-center py-12 text-slate-400 text-sm'>
                        No items found in this section.
                    </div>
                ) : (
                    <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6'>
                        {products.map((product) => {
                            const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800';
                            return (
                                <Link
                                    to={`/products/${product.id}`}
                                    key={product.id}
                                    className='group bg-white dark:bg-brand-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col'
                                >
                                    {/* Image container with fixed aspect ratio */}
                                    <div className='relative h-[220px] sm:h-[260px] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center'>
                                        <img
                                            src={mainImage}
                                            alt={product.name}
                                            className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500'
                                        />

                                        {product.discountPrice && (
                                            <span className='absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs'>
                                                Sale
                                            </span>
                                        )}

                                        {product.stock <= 0 && (
                                            <div className='absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center'>
                                                <span className='text-white text-xs font-bold uppercase tracking-wider px-3 py-1 bg-red-600 rounded-md'>
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}

                                        {/* Quick Add Button */}
                                        {product.stock > 0 && (
                                            <button
                                                onClick={(e) => handleQuickAdd(e, product)}
                                                className='absolute bottom-3 right-3 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-primary hover:text-slate-900 p-2.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200'
                                                title="Add to Bag"
                                            >
                                                <FaCartPlus className='text-xs' />
                                            </button>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <div className='p-4 flex-1 flex flex-col justify-between space-y-2'>
                                        <div>
                                            <span className='text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1'>
                                                {product.category?.name || "Apparel"}
                                            </span>
                                            <h3 className='font-bold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-primary transition-colors'>
                                                {product.name}
                                            </h3>
                                        </div>

                                        <div className='pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between'>
                                            <div className='flex items-center gap-1 text-amber-500 text-xs'>
                                                <FaStar className='text-[11px]' />
                                                <span className='font-bold text-slate-700 dark:text-slate-300 text-xs'>
                                                    {product.rating || '4.8'}
                                                </span>
                                            </div>

                                            <div className='flex items-baseline gap-1.5'>
                                                {product.discountPrice && (
                                                    <span className='text-[11px] text-slate-400 line-through'>
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
                )}
            </div>
        </section>
    );
};

export default Products;