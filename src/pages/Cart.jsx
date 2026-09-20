import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaTrash, FaCartShopping, FaArrowRight, FaShieldHalved, FaTruckFast } from 'react-icons/fa6';
import {
    useGetCartQuery,
    useUpdateCartQuantityMutation,
    useRemoveFromCartMutation,
    useClearCartMutation,
} from '../redux/features/cart/cartApiSlice';
import { useSelector } from 'react-redux';

const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const { data, isLoading } = useGetCartQuery(undefined, { skip: !isAuthenticated });
    const [updateQuantity, { isLoading: isUpdating }] = useUpdateCartQuantityMutation();
    const [removeItem, { isLoading: isRemoving }] = useRemoveFromCartMutation();
    const [clearCart, { isLoading: isClearing }] = useClearCartMutation();

    if (!isAuthenticated) {
        return (
            <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 transition-colors duration-200'>
                <Navbar />
                <main className='flex-1 container flex flex-col justify-center items-center py-24 text-center'>
                    <div className='w-20 h-20 bg-primary/15 rounded-3xl flex items-center justify-center text-primary text-3xl mb-5 shadow-xs'>
                        <FaCartShopping />
                    </div>
                    <h2 className='text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mb-2'>Sign In to Your Account</h2>
                    <p className='text-xs sm:text-sm text-slate-500 max-w-sm mb-6 leading-relaxed'>
                        Sign in to synchronize your saved shopping bag, review orders, and proceed with express checkout.
                    </p>
                    <Link
                        to="/login?redirect=/cart"
                        className='bg-gradient-to-r from-primary to-secondary text-white px-8 py-3.5 rounded-full font-bold shadow-md hover:scale-[1.02] duration-200 text-sm'
                    >
                        Sign In / Register
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark'>
                <Navbar />
                <main className='flex-1 flex justify-center items-center py-32'>
                    <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
                </main>
                <Footer />
            </div>
        );
    }

    const cart = data?.cart;
    const items = cart?.items || [];
    const itemsPrice = cart?.totalPrice || 0;
    const shippingPrice = itemsPrice > 500 || itemsPrice === 0 ? 0.00 : 35.00;
    const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    const handleQuantity = async (item, delta) => {
        const newQty = item.quantity + delta;
        if (newQty <= 0) {
            await removeItem(item.id);
        } else if (newQty <= item.availableStock) {
            await updateQuantity({ itemId: item.id, quantity: newQty });
        }
    };

    return (
        <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 transition-colors duration-200'>
            <Navbar />

            <main className='flex-1 container py-8 sm:py-12'>
                <div className='flex items-baseline justify-between mb-8'>
                    <div>
                        <span className='text-xs font-bold uppercase tracking-widest text-primary'>Review Bag</span>
                        <h1 className='text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1'>
                            Shopping Bag ({cart?.totalItems || 0})
                        </h1>
                    </div>

                    {items.length > 0 && (
                        <button
                            onClick={() => clearCart()}
                            disabled={isClearing}
                            className='text-xs text-red-500 hover:text-red-700 font-bold hover:underline'
                        >
                            Clear All
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className='bg-white dark:bg-brand-card rounded-3xl p-12 text-center border border-slate-200/80 dark:border-brand-border shadow-card max-w-lg mx-auto my-12'>
                        <div className='w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 text-3xl mx-auto mb-5'>
                            <FaCartShopping />
                        </div>
                        <h2 className='text-xl font-black text-slate-900 dark:text-white mb-2'>Your Bag is Empty</h2>
                        <p className='text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed'>
                            Explore our latest tailoring, knitwear, and seasonal outerwear arrivals to find your next staple piece.
                        </p>
                        <Link
                            to="/shop"
                            className='inline-block bg-primary text-slate-950 px-8 py-3 rounded-full font-bold text-xs hover:bg-primary-dark hover:text-white transition-all shadow-xs'
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start'>
                        {/* Cart Items List */}
                        <div className='lg:col-span-8 space-y-4'>
                            <div className='bg-white dark:bg-brand-card rounded-3xl p-5 sm:p-7 shadow-card border border-slate-200/80 dark:border-brand-border divide-y divide-slate-100 dark:divide-slate-800'>
                                {items.map((item) => {
                                    const productImg = item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800';
                                    return (
                                        <div key={item.id} className='py-5 first:pt-0 last:pb-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5'>
                                            <div className='flex items-center gap-4'>
                                                <Link to={`/products/${item.productId}`}>
                                                    <img
                                                        src={productImg}
                                                        alt={item.product?.name}
                                                        className='w-20 h-26 object-cover object-top rounded-2xl bg-slate-100 dark:bg-slate-800 flex-shrink-0'
                                                    />
                                                </Link>

                                                <div className='space-y-1.5'>
                                                    <Link
                                                        to={`/products/${item.productId}`}
                                                        className='font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-primary transition-colors line-clamp-1'
                                                    >
                                                        {item.product?.name}
                                                    </Link>

                                                    <div className='text-xs text-slate-500 dark:text-slate-400 flex flex-wrap gap-2'>
                                                        {item.size && (
                                                            <span className='bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold text-slate-700 dark:text-slate-300'>
                                                                Size: {item.size}
                                                            </span>
                                                        )}
                                                        {item.color && (
                                                            <span className='bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md font-semibold text-slate-700 dark:text-slate-300'>
                                                                Color: {item.color}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <div className='text-sm font-extrabold text-slate-900 dark:text-white'>
                                                        ${Number(item.price).toFixed(2)}
                                                    </div>

                                                    {!item.isAvailable && (
                                                        <div className='text-[11px] text-red-500 font-bold'>
                                                            Only {item.availableStock} units left in stock!
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Quantity & Item Totals */}
                                            <div className='flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800'>
                                                <div className='flex items-center border border-slate-200 dark:border-brand-border rounded-xl bg-slate-50 dark:bg-slate-800'>
                                                    <button
                                                        disabled={isUpdating}
                                                        onClick={() => handleQuantity(item, -1)}
                                                        className='px-3 py-1.5 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200'
                                                    >
                                                        -
                                                    </button>
                                                    <span className='px-3 text-xs font-bold text-slate-900 dark:text-white'>{item.quantity}</span>
                                                    <button
                                                        disabled={isUpdating || item.quantity >= item.availableStock}
                                                        onClick={() => handleQuantity(item, 1)}
                                                        className='px-3 py-1.5 text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40'
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <span className='font-black text-base text-slate-900 dark:text-white min-w-[80px] text-right'>
                                                    ${item.lineTotal.toFixed(2)}
                                                </span>

                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    disabled={isRemoving}
                                                    className='text-slate-400 hover:text-red-500 text-sm transition-colors p-1.5'
                                                    title="Remove Item"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Summary Card */}
                        <div className='lg:col-span-4'>
                            <div className='bg-white dark:bg-brand-card rounded-3xl p-6 shadow-card border border-slate-200/80 dark:border-brand-border space-y-5 sticky top-24'>
                                <h2 className='text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3'>
                                    Order Summary
                                </h2>

                                <div className='space-y-3 text-xs sm:text-sm'>
                                    <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                        <span>Subtotal ({cart?.totalItems} pieces)</span>
                                        <span className='font-bold text-slate-900 dark:text-white'>${itemsPrice.toFixed(2)}</span>
                                    </div>
                                    <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                        <span>Express Shipping</span>
                                        <span className='font-bold'>
                                            {shippingPrice === 0 ? (
                                                <span className='text-emerald-500 font-extrabold uppercase text-xs'>Free</span>
                                            ) : (
                                                `$${shippingPrice.toFixed(2)}`
                                            )}
                                        </span>
                                    </div>
                                    <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                        <span>Sales Tax (5%)</span>
                                        <span className='font-bold text-slate-900 dark:text-white'>${taxPrice.toFixed(2)}</span>
                                    </div>

                                    {/* Shipping Progress bar */}
                                    {itemsPrice < 500 && itemsPrice > 0 && (
                                        <div className='p-3 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200/60 dark:border-amber-800/40 text-[11px] text-amber-800 dark:text-amber-300 flex items-center gap-2'>
                                            <FaTruckFast className='text-primary text-sm flex-shrink-0' />
                                            <span>Add <strong>${(500 - itemsPrice).toFixed(2)}</strong> more for <strong>Free Express Shipping</strong></span>
                                        </div>
                                    )}

                                    <div className='border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-baseline'>
                                        <span className='font-black text-base text-slate-900 dark:text-white'>Estimated Total</span>
                                        <span className='text-2xl font-black text-slate-900 dark:text-white'>
                                            ${totalPrice.toFixed(2)}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate('/checkout')}
                                    className='w-full bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition duration-200 shadow-md hover:scale-[1.01] text-sm'
                                >
                                    <span>Proceed to Checkout</span>
                                    <FaArrowRight className='text-xs' />
                                </button>

                                <div className='flex items-center justify-center gap-2 text-xs text-slate-400 pt-1'>
                                    <FaShieldHalved className='text-primary' />
                                    <span>256-Bit Encrypted & Secure Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Cart;
