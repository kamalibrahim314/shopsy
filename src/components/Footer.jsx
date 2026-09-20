import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import {
    FaFacebookF,
    FaInstagram,
    FaXTwitter,
    FaTiktok,
    FaLocationDot,
    FaPhone,
    FaEnvelope,
    FaShieldHalved,
    FaTruckFast,
    FaRotateLeft,
} from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className='bg-slate-900 dark:bg-[#070b13] text-slate-300 border-t border-slate-800 transition-colors duration-200'>
            {/* Top Value Propositions */}
            <div className='border-b border-slate-800/80 py-8'>
                <div className='container grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left'>
                    <div className='flex items-center justify-center sm:justify-start gap-4'>
                        <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl flex-shrink-0'>
                            <FaTruckFast />
                        </div>
                        <div>
                            <h4 className='font-bold text-white text-sm'>Express Worldwide Delivery</h4>
                            <p className='text-xs text-slate-400 mt-0.5'>Complimentary shipping on orders over $500</p>
                        </div>
                    </div>

                    <div className='flex items-center justify-center sm:justify-start gap-4'>
                        <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl flex-shrink-0'>
                            <FaRotateLeft />
                        </div>
                        <div>
                            <h4 className='font-bold text-white text-sm'>30-Day Hassle-Free Returns</h4>
                            <p className='text-xs text-slate-400 mt-0.5'>Seamless exchange or instant full refund</p>
                        </div>
                    </div>

                    <div className='flex items-center justify-center sm:justify-start gap-4'>
                        <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-xl flex-shrink-0'>
                            <FaShieldHalved />
                        </div>
                        <div>
                            <h4 className='font-bold text-white text-sm'>Authentic Certified Apparel</h4>
                            <p className='text-xs text-slate-400 mt-0.5'>100% premium quality fabrics guaranteed</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Links Area */}
            <div className='container py-12'>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10'>
                    {/* Brand column */}
                    <div className='lg:col-span-2 space-y-4'>
                        <Link to="/" className='flex items-center gap-2.5 text-2xl font-black tracking-tight text-white'>
                            <img src={logo} alt="Shopsy Logo" className='w-9 h-9 object-contain' />
                            <span>Shopsy<span className='text-primary'>.</span></span>
                        </Link>
                        <p className='text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm'>
                            Your premier contemporary fashion house. We craft modern silhouettes, luxurious fabrics, and timeless outerwear designed for effortless individuality.
                        </p>

                        <div className='space-y-2 pt-2 text-xs text-slate-400'>
                            <div className='flex items-center gap-2.5'>
                                <FaLocationDot className='text-primary text-sm flex-shrink-0' />
                                <span>123 Fashion Boulevard, Downtown Cairo, Egypt</span>
                            </div>
                            <div className='flex items-center gap-2.5'>
                                <FaPhone className='text-primary text-sm flex-shrink-0' />
                                <span>+20 100 000 0001 (9 AM - 10 PM)</span>
                            </div>
                            <div className='flex items-center gap-2.5'>
                                <FaEnvelope className='text-primary text-sm flex-shrink-0' />
                                <span>support@shopsy-fashion.com</span>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className='flex items-center gap-3 pt-2'>
                            <a href="#instagram" aria-label="Instagram" className='w-9 h-9 rounded-full bg-slate-800 hover:bg-primary hover:text-slate-900 transition-all duration-200 flex items-center justify-center text-sm text-slate-300'>
                                <FaInstagram />
                            </a>
                            <a href="#facebook" aria-label="Facebook" className='w-9 h-9 rounded-full bg-slate-800 hover:bg-primary hover:text-slate-900 transition-all duration-200 flex items-center justify-center text-sm text-slate-300'>
                                <FaFacebookF />
                            </a>
                            <a href="#twitter" aria-label="X (Twitter)" className='w-9 h-9 rounded-full bg-slate-800 hover:bg-primary hover:text-slate-900 transition-all duration-200 flex items-center justify-center text-sm text-slate-300'>
                                <FaXTwitter />
                            </a>
                            <a href="#tiktok" aria-label="TikTok" className='w-9 h-9 rounded-full bg-slate-800 hover:bg-primary hover:text-slate-900 transition-all duration-200 flex items-center justify-center text-sm text-slate-300'>
                                <FaTiktok />
                            </a>
                        </div>
                    </div>

                    {/* Navigation 1: Shop */}
                    <div className='space-y-3'>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-white'>Shop Collections</h4>
                        <ul className='space-y-2 text-xs sm:text-sm text-slate-400'>
                            <li>
                                <Link to="/shop?category=women-wear" className='hover:text-primary transition-colors'>Women's Apparel</Link>
                            </li>
                            <li>
                                <Link to="/shop?category=men-wear" className='hover:text-primary transition-colors'>Men's Tailoring</Link>
                            </li>
                            <li>
                                <Link to="/shop?category=kids-wear" className='hover:text-primary transition-colors'>Kids & Teens</Link>
                            </li>
                            <li>
                                <Link to="/shop?category=footwear" className='hover:text-primary transition-colors'>Footwear & Shoes</Link>
                            </li>
                            <li>
                                <Link to="/shop?category=accessories" className='hover:text-primary transition-colors'>Leather Accessories</Link>
                            </li>
                            <li>
                                <Link to="/shop?isTrending=true" className='text-primary hover:underline font-medium'>Trending New Arrivals</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Navigation 2: Customer Support */}
                    <div className='space-y-3'>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-white'>Customer Care</h4>
                        <ul className='space-y-2 text-xs sm:text-sm text-slate-400'>
                            <li>
                                <Link to="/orders" className='hover:text-primary transition-colors'>Track My Order</Link>
                            </li>
                            <li>
                                <Link to="/profile" className='hover:text-primary transition-colors'>Account Settings</Link>
                            </li>
                            <li>
                                <Link to="/cart" className='hover:text-primary transition-colors'>Shopping Bag</Link>
                            </li>
                            <li>
                                <span className='cursor-pointer hover:text-primary transition-colors'>Shipping & Customs</span>
                            </li>
                            <li>
                                <span className='cursor-pointer hover:text-primary transition-colors'>Size & Fit Guide</span>
                            </li>
                            <li>
                                <span className='cursor-pointer hover:text-primary transition-colors'>Help Center & FAQs</span>
                            </li>
                        </ul>
                    </div>

                    {/* Navigation 3: Company */}
                    <div className='space-y-3'>
                        <h4 className='text-xs font-bold uppercase tracking-wider text-white'>Our House</h4>
                        <ul className='space-y-2 text-xs sm:text-sm text-slate-400'>
                            <li>
                                <span className='cursor-pointer hover:text-primary transition-colors'>The Shopsy Story</span>
                            </li>
                            <li>
                                <span className='cursor-pointer hover:text-primary transition-colors'>Sustainable Materials</span>
                            </li>
                            <li>
                                <span className='cursor-pointer hover:text-primary transition-colors'>Atelier & Craftsmanship</span>
                            </li>
                            <li>
                                <span className='cursor-pointer hover:text-primary transition-colors'>Careers & Internships</span>
                            </li>
                            <li>
                                <span className='cursor-pointer hover:text-primary transition-colors'>Privacy Policy</span>
                            </li>
                            <li>
                                <span className='cursor-pointer hover:text-primary transition-colors'>Terms & Conditions</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom copyright bar */}
            <div className='border-t border-slate-800/80 py-6 text-xs text-slate-500'>
                <div className='container flex flex-col sm:flex-row items-center justify-between gap-4'>
                    <p>© {new Date().getFullYear()} Shopsy Fashion House. All rights reserved.</p>
                    <div className='flex items-center gap-6'>
                        <span className='hover:text-slate-300 cursor-pointer transition-colors'>Privacy Policy</span>
                        <span className='hover:text-slate-300 cursor-pointer transition-colors'>Terms of Service</span>
                        <span className='hover:text-slate-300 cursor-pointer transition-colors'>Security</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;