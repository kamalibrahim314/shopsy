import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

const Popup = ({ popup, setPopup }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setPopup(false);
        navigate('/shop');
    };

    return (
        <>
            {popup && (
                <div className='Popup'>
                    <div className='h-screen w-screen fixed top-0 left-0 bg-black/60 z-50 backdrop-blur-xs flex items-center justify-center p-4'>
                        <div className='w-full max-w-sm bg-white dark:bg-brand-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 dark:border-brand-border animate-scale-up'>
                            {/* header */}
                            <div className='flex items-center justify-between mb-4'>
                                <div>
                                    <span className='text-[11px] font-bold uppercase tracking-wider text-primary'>Fast Checkout</span>
                                    <h1 className='text-xl font-black text-slate-900 dark:text-white'>Order Now</h1>
                                </div>
                                <button
                                    onClick={() => setPopup(false)}
                                    className='text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 transition-colors'
                                >
                                    <IoCloseOutline className='text-2xl' />
                                </button>
                            </div>
                            {/* form */}
                            <form onSubmit={handleSubmit} className='space-y-3'>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='Your Full Name'
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className='w-full rounded-xl border border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-brand-dark px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary'
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder='Email Address'
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className='w-full rounded-xl border border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-brand-dark px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary'
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder='Shipping Destination City'
                                        required
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        className='w-full rounded-xl border border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-brand-dark px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary'
                                    />
                                </div>
                                <div className='pt-2'>
                                    <button
                                        type="submit"
                                        className='w-full bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white rounded-full py-3 px-4 font-bold text-xs sm:text-sm shadow-md hover:scale-[1.01] transition-transform'
                                    >
                                        Explore & Order Now
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Popup;