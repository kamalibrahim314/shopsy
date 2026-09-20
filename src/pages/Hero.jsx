import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaWandMagicSparkles } from 'react-icons/fa6';

const Hero = ({ handlePopup }) => {
    const slides = [
        {
            id: 1,
            tag: "Autumn / Winter 2026 Collection",
            title: "Timeless Tailoring & Modern Luxury",
            subtitle: "Discover statement wool trench coats, Grade-A cashmere knitwear, and effortless silhouettes crafted for the discerning wardrobe.",
            image: "https://images.unsplash.com/photo-1539533018447-63fcce667883?w=800&auto=format&fit=crop&q=80",
            link: "/shop?category=women-wear",
            cta: "Explore Women's",
            badge: "New Season",
        },
        {
            id: 2,
            tag: "Men's Sartorial Collection",
            title: "Sharp Tailoring & Refined Essentials",
            subtitle: "Unmatched elegance meets modern comfort. Explore our Italian wool blazers, crisp combed cotton oxfords, and raw selvedge denim.",
            image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80",
            link: "/shop?category=men-wear",
            cta: "Shop Men's",
            badge: "Trending",
        },
        {
            id: 3,
            tag: "Seasonal Flash Offer",
            title: "Up to 50% Off Iconic Fashion Pieces",
            subtitle: "Elevate your daily presence with curated leather goods, artisan boots, and designer sunglasses at exclusive limited-time prices.",
            image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80",
            link: "/shop?sort=popular",
            cta: "Shop The Sale",
            badge: "Limited Time",
        },
    ];

    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 700,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 5000,
        pauseOnHover: true,
        cssEase: 'cubic-bezier(0.4, 0, 0.2, 1)',
    };

    return (
        <div className='relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-slate-50 to-white dark:from-slate-900/60 dark:via-brand-dark dark:to-brand-dark transition-colors duration-200 border-b border-slate-200/60 dark:border-brand-border/60'>
            {/* Subtle luxury ambient glow */}
            <div className='absolute -top-32 -right-32 w-96 h-96 bg-primary/15 dark:bg-primary/10 rounded-full blur-3xl pointer-events-none'></div>
            <div className='absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/10 dark:bg-secondary/5 rounded-full blur-3xl pointer-events-none'></div>

            <div className='container py-8 sm:py-12 lg:py-16'>
                <Slider {...settings}>
                    {slides.map((slide) => (
                        <div key={slide.id} className='outline-none'>
                            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center'>
                                {/* Left Content */}
                                <div className='lg:col-span-7 space-y-5 text-center lg:text-left order-2 lg:order-1'>
                                    <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 dark:bg-primary/20 text-secondary dark:text-primary text-xs font-bold tracking-wide uppercase shadow-xs'>
                                        <FaWandMagicSparkles className='text-[10px]' />
                                        <span>{slide.tag}</span>
                                    </div>

                                    <h1 className='text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15]'>
                                        {slide.title}
                                    </h1>

                                    <p className='text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed'>
                                        {slide.subtitle}
                                    </p>

                                    <div className='flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3'>
                                        <Link
                                            to={slide.link}
                                            className='bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold px-7 py-3.5 rounded-full text-sm sm:text-base shadow-lg hover:shadow-glow hover:scale-[1.02] transition-all duration-200 flex items-center gap-2'
                                        >
                                            <span>{slide.cta}</span>
                                            <FaArrowRight className='text-xs' />
                                        </Link>

                                        <button
                                            onClick={handlePopup}
                                            className='bg-white dark:bg-brand-card hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-brand-border font-semibold px-6 py-3.5 rounded-full text-sm sm:text-base shadow-xs transition-all duration-200'
                                        >
                                            Express Order
                                        </button>
                                    </div>

                                    {/* Stats preview */}
                                    <div className='grid grid-cols-3 gap-4 pt-6 border-t border-slate-200/80 dark:border-slate-800 max-w-md mx-auto lg:mx-0 text-center lg:text-left'>
                                        <div>
                                            <div className='text-lg sm:text-2xl font-black text-slate-900 dark:text-white'>500+</div>
                                            <div className='text-[11px] text-slate-500 dark:text-slate-400 font-medium'>Apparel Styles</div>
                                        </div>
                                        <div>
                                            <div className='text-lg sm:text-2xl font-black text-slate-900 dark:text-white'>100%</div>
                                            <div className='text-[11px] text-slate-500 dark:text-slate-400 font-medium'>Certified Cotton</div>
                                        </div>
                                        <div>
                                            <div className='text-lg sm:text-2xl font-black text-slate-900 dark:text-white'>4.9★</div>
                                            <div className='text-[11px] text-slate-500 dark:text-slate-400 font-medium'>Client Rating</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Image */}
                                <div className='lg:col-span-5 order-1 lg:order-2 flex justify-center'>
                                    <div className='relative max-w-sm sm:max-w-md w-full'>
                                        {/* Decorative frame */}
                                        <div className='absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/20 rounded-3xl transform rotate-3 scale-102 blur-xs'></div>
                                        <div className='relative h-[340px] sm:h-[440px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-brand-border bg-slate-100 dark:bg-brand-card'>
                                            <img
                                                src={slide.image}
                                                alt={slide.title}
                                                className='w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700'
                                            />
                                            <span className='absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-white/20 shadow-md'>
                                                {slide.badge}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </Slider>
            </div>
        </div>
    );
};

export default Hero;