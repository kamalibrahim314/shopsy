import React from 'react';
import { Link } from 'react-router-dom';
import { FaTruckFast, FaShieldHalved, FaRotateLeft, FaCreditCard, FaArrowRight } from 'react-icons/fa6';

const Banner = () => {
    return (
        <section className='py-16 bg-gradient-to-r from-amber-50/70 via-slate-50 to-amber-100/40 dark:from-slate-900 dark:via-brand-dark dark:to-slate-900 border-y border-slate-200/70 dark:border-brand-border/70 transition-colors duration-200 overflow-hidden'>
            <div className='container'>
                <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center'>
                    {/* Image section */}
                    <div className='lg:col-span-5 flex justify-center'>
                        <div className='relative max-w-sm sm:max-w-md w-full'>
                            <div className='absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-3xl opacity-20 blur-lg'></div>
                            <div className='relative h-[360px] sm:h-[420px] rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-brand-border bg-slate-100 dark:bg-slate-800'>
                                <img
                                    src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"
                                    alt="Winter Season Apparel"
                                    className='w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700'
                                />
                                <div className='absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 text-xs'>
                                    <p className='font-bold text-primary'>Winter Elegance Edition</p>
                                    <p className='text-slate-300 text-[11px]'>Hand-finished wool blends & thermal warmth</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content section */}
                    <div className='lg:col-span-7 space-y-6 text-center lg:text-left'>
                        <span className='inline-block text-xs font-bold uppercase tracking-widest text-primary'>
                            Exclusive Seasonal Offer
                        </span>

                        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight'>
                            Winter Collection Sale <span className='text-primary'>Up to 50% Off</span>
                        </h2>

                        <p className='text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0'>
                            Refresh your wardrobe with meticulously designed silhouettes, cozy textured knitwear, and timeless outerwear crafted to keep you poised through the season.
                        </p>

                        {/* Fashion Brand Promises */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'>
                            <div className='flex items-center gap-3.5 p-3 rounded-xl bg-white dark:bg-brand-card border border-slate-200/70 dark:border-brand-border shadow-xs'>
                                <div className='w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center text-base flex-shrink-0'>
                                    <FaShieldHalved />
                                </div>
                                <div className='text-left'>
                                    <h4 className='font-bold text-xs sm:text-sm text-slate-900 dark:text-white'>Artisan Quality</h4>
                                    <p className='text-[11px] text-slate-500 dark:text-slate-400'>100% genuine certified fabrics</p>
                                </div>
                            </div>

                            <div className='flex items-center gap-3.5 p-3 rounded-xl bg-white dark:bg-brand-card border border-slate-200/70 dark:border-brand-border shadow-xs'>
                                <div className='w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center text-base flex-shrink-0'>
                                    <FaTruckFast />
                                </div>
                                <div className='text-left'>
                                    <h4 className='font-bold text-xs sm:text-sm text-slate-900 dark:text-white'>Fast Delivery</h4>
                                    <p className='text-[11px] text-slate-500 dark:text-slate-400'>2-4 business days tracked delivery</p>
                                </div>
                            </div>

                            <div className='flex items-center gap-3.5 p-3 rounded-xl bg-white dark:bg-brand-card border border-slate-200/70 dark:border-brand-border shadow-xs'>
                                <div className='w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center text-base flex-shrink-0'>
                                    <FaRotateLeft />
                                </div>
                                <div className='text-left'>
                                    <h4 className='font-bold text-xs sm:text-sm text-slate-900 dark:text-white'>30-Day Returns</h4>
                                    <p className='text-[11px] text-slate-500 dark:text-slate-400'>Hassle-free size & style exchange</p>
                                </div>
                            </div>

                            <div className='flex items-center gap-3.5 p-3 rounded-xl bg-white dark:bg-brand-card border border-slate-200/70 dark:border-brand-border shadow-xs'>
                                <div className='w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center text-base flex-shrink-0'>
                                    <FaCreditCard />
                                </div>
                                <div className='text-left'>
                                    <h4 className='font-bold text-xs sm:text-sm text-slate-900 dark:text-white'>Secure Checkout</h4>
                                    <p className='text-[11px] text-slate-500 dark:text-slate-400'>COD & 256-bit encrypted card</p>
                                </div>
                            </div>
                        </div>

                        <div className='pt-4'>
                            <Link
                                to="/shop?sort=popular"
                                className='inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold px-8 py-3.5 rounded-full text-sm shadow-md hover:scale-[1.02] transition-all duration-200'
                            >
                                <span>Shop The Promotion</span>
                                <FaArrowRight className='text-xs' />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Banner;