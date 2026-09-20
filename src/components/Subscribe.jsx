import React, { useState } from 'react';
import { FaPaperPlane, FaCheck } from 'react-icons/fa6';

const Subscribe = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 5000);
        }
    };

    return (
        <section className='py-16 transition-colors duration-200'>
            <div className='container'>
                <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-brand-dark to-slate-900 text-white p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl'>
                    {/* Decorative ambient gold glow */}
                    <div className='absolute -top-24 -right-24 w-80 h-80 bg-primary/20 rounded-full blur-3xl pointer-events-none'></div>
                    <div className='absolute -bottom-24 -left-24 w-80 h-80 bg-secondary/15 rounded-full blur-3xl pointer-events-none'></div>

                    <div className='relative max-w-2xl mx-auto text-center space-y-5'>
                        <span className='inline-block text-xs font-bold uppercase tracking-widest text-primary'>
                            The Shopsy Insider Club
                        </span>

                        <h2 className='text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight'>
                            Get 15% Off Your First Order
                        </h2>

                        <p className='text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed'>
                            Subscribe to receive exclusive access to private capsule drops, seasonal lookbooks, and VIP promotional events.
                        </p>

                        {subscribed ? (
                            <div className='bg-primary/20 border border-primary/40 text-primary py-3 px-6 rounded-full inline-flex items-center gap-2 text-sm font-bold'>
                                <FaCheck />
                                <span>Thank you for subscribing! Check your inbox for your code.</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2'>
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='flex-1 rounded-full bg-slate-800/80 border border-slate-700 px-5 py-3.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary backdrop-blur-sm'
                                />
                                <button
                                    type="submit"
                                    className='bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-md hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2 flex-shrink-0'
                                >
                                    <span>Subscribe</span>
                                    <FaPaperPlane className='text-xs' />
                                </button>
                            </form>
                        )}

                        <div className='flex flex-wrap justify-center items-center gap-6 pt-4 text-[11px] text-slate-400'>
                            <span>✓ Instant 15% Discount</span>
                            <span>✓ No Spam Guaranteed</span>
                            <span>✓ Unsubscribe Anytime</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Subscribe;