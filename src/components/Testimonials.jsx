import React from 'react';
import Slider from 'react-slick';
import { FaStar, FaQuoteLeft, FaCircleCheck } from 'react-icons/fa6';

const Testimonials = () => {
    const settings = {
        dots: true,
        arrows: false,
        infinite: true,
        speed: 600,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        responsive: [
            {
                breakpoint: 1280,
                settings: {
                    slidesToShow: 3,
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    const testimonialsData = [
        {
            id: 1,
            name: 'Sophia Al-Mansoor',
            location: 'Cairo, Egypt',
            item: 'Double-Breasted Wool Trench Coat',
            image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
            quote: 'The craftsmanship on the wool trench coat is beyond exceptional. The fabric feels identical to Savile Row luxury labels. Delivery arrived in 2 days in immaculate branded packaging.',
        },
        {
            id: 2,
            name: 'Marcus Vance',
            location: 'Alexandria, Egypt',
            item: 'Italian Wool Blazer & Oxford Shirt',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
            quote: 'Finding off-the-rack shirts that fit this cleanly through the shoulders is rare. The combed cotton is breathable and durable. Shopsy is now my go-to sartorial store.',
        },
        {
            id: 3,
            name: 'Elena Rostova',
            location: 'Dubai, UAE',
            item: 'Cashmere Turtleneck & Silk Dress',
            image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
            quote: 'I ordered the cashmere sweater and the silk chiffon dress. The textures are buttery soft and the colors are vibrant and rich. Outstanding customer care as well.',
        },
        {
            id: 4,
            name: 'Omar Farouk',
            location: 'Giza, Egypt',
            item: 'Suede Chelsea Boots',
            image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
            quote: 'These boots exceeded my expectations. The suede is supple, the crepe sole is comfortable for all-day wear, and the sizing guide was spot-on.',
        },
    ];

    return (
        <section className='py-16 bg-slate-50 dark:bg-brand-dark/40 border-b border-slate-200/60 dark:border-brand-border/60 transition-colors duration-200 overflow-hidden'>
            <div className='container'>
                {/* Header section */}
                <div className='text-center max-w-xl mx-auto mb-12'>
                    <span className='inline-block text-xs font-bold uppercase tracking-widest text-primary mb-2'>
                        Client Reviews
                    </span>
                    <h2 className='text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight'>
                        What Our Customers Say
                    </h2>
                    <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2'>
                        Read verified reviews from fashion lovers across the region who trust Shopsy.
                    </p>
                </div>

                {/* Testimonials cards carousel */}
                <div className='pb-4'>
                    <Slider {...settings}>
                        {testimonialsData.map((review) => (
                            <div key={review.id} className='px-3 outline-none'>
                                <div className='bg-white dark:bg-brand-card p-6 sm:p-7 rounded-2xl border border-slate-200/80 dark:border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between h-[300px]'>
                                    {/* Quote and Stars */}
                                    <div className='space-y-3'>
                                        <div className='flex items-center justify-between'>
                                            <div className='flex text-amber-500 text-xs gap-1'>
                                                <FaStar />
                                                <FaStar />
                                                <FaStar />
                                                <FaStar />
                                                <FaStar />
                                            </div>
                                            <FaQuoteLeft className='text-primary/30 text-lg' />
                                        </div>

                                        <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4'>
                                            "{review.quote}"
                                        </p>
                                    </div>

                                    {/* Reviewer Profile */}
                                    <div className='pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3.5'>
                                        <img
                                            src={review.image}
                                            alt={review.name}
                                            className='w-11 h-11 rounded-full object-cover border-2 border-primary flex-shrink-0'
                                        />
                                        <div className='overflow-hidden'>
                                            <div className='flex items-center gap-1.5'>
                                                <h4 className='font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate'>
                                                    {review.name}
                                                </h4>
                                                <FaCircleCheck className='text-primary text-[11px] flex-shrink-0' title="Verified Buyer" />
                                            </div>
                                            <p className='text-[11px] text-slate-400 truncate'>{review.location}</p>
                                            <p className='text-[10px] text-primary/80 font-medium truncate mt-0.5'>{review.item}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;