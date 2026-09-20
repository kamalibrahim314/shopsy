import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdSearch } from 'react-icons/io';
import { FaCaretDown, FaCartShopping, FaUser, FaArrowRightFromBracket, FaBars, FaXmark } from 'react-icons/fa6';
import DarkMode from './DarkMode';
import { useSelector } from 'react-redux';
import { useGetCartQuery } from '../redux/features/cart/cartApiSlice';
import { useLogoutMutation, useGetMeQuery } from '../redux/features/auth/authApiSlice';

const Navbar = ({ handlePopup }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { isAuthenticated, user } = useSelector((state) => state.auth);
    useGetMeQuery(undefined, { skip: !isAuthenticated });
    const { data: cartData } = useGetCartQuery(undefined, { skip: !isAuthenticated });
    const [logoutApi] = useLogoutMutation();

    const totalCartItems = cartData?.cart?.totalItems || 0;

    const handleSearch = (e) => {
        if (e.key === 'Enter' || e.type === 'click') {
            if (searchTerm.trim()) {
                navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
                setMobileMenuOpen(false);
            }
        }
    };

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
            setUserDropdownOpen(false);
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const menu = [
        { id: 1, name: 'Home', link: '/' },
        { id: 2, name: 'Shop All', link: '/shop' },
        { id: 3, name: "Women's Wear", link: '/shop?category=women-wear' },
        { id: 4, name: "Men's Collection", link: '/shop?category=men-wear' },
        { id: 5, name: 'Kids & Teens', link: '/shop?category=kids-wear' },
        { id: 6, name: 'Footwear', link: '/shop?category=footwear' },
        { id: 7, name: 'Accessories', link: '/shop?category=accessories' },
    ];

    const dropdownLinks = [
        { id: 1, name: 'Trending Now', link: '/shop?isTrending=true' },
        { id: 2, name: 'Best Sellers', link: '/shop?sort=popular' },
        { id: 3, name: 'Top Rated', link: '/shop?isTopRated=true' },
        { id: 4, name: 'Special Sale', link: '/shop?sort=price-asc' },
    ];

    return (
        <header className='sticky top-0 z-40 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md border-b border-slate-200/80 dark:border-brand-border shadow-xs transition-colors duration-200'>
            {/* Upper navbar */}
            <div className='container py-2.5 sm:py-3 flex justify-between items-center gap-4'>
                {/* Brand Logo */}
                <div className='flex items-center gap-3'>
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className='lg:hidden text-slate-700 dark:text-slate-200 text-lg p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800'
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <FaXmark /> : <FaBars />}
                    </button>

                    <Link to="/" className='flex items-center gap-2 font-black text-2xl sm:text-3xl tracking-tight text-slate-900 dark:text-white'>
                        <img src={logo} alt="Shopsy Logo" className='w-9 h-9 object-contain' />
                        <span>Shopsy<span className='text-primary'>.</span></span>
                    </Link>
                </div>

                {/* Center search bar (Desktop) */}
                <div className='hidden md:flex flex-1 max-w-md mx-4'>
                    <div className='relative w-full'>
                        <input
                            type="text"
                            placeholder="Search suits, trench coats, sneakers, dresses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                            className='w-full rounded-full border border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-brand-card px-4 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-xs transition-all'
                        />
                        <button
                            onClick={handleSearch}
                            className='absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors text-base'
                            aria-label="Search"
                        >
                            <IoMdSearch />
                        </button>
                    </div>
                </div>

                {/* Right utility actions */}
                <div className='flex items-center gap-2.5 sm:gap-3.5'>
                    {/* Cart button */}
                    <Link
                        to="/cart"
                        className='relative bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white px-3 sm:px-4 py-1.5 rounded-full flex items-center gap-2 shadow-xs transition-transform duration-200 hover:scale-[1.02]'
                    >
                        <FaCartShopping className='text-sm sm:text-base' />
                        <span className='hidden sm:inline text-xs font-bold'>Bag</span>
                        {totalCartItems > 0 && (
                            <span className='absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs animate-pulse'>
                                {totalCartItems}
                            </span>
                        )}
                    </Link>

                    {/* Authentication state */}
                    {isAuthenticated && user ? (
                        <div className='relative'>
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className='flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-brand-card hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors text-xs font-semibold'
                            >
                                <FaUser className='text-primary text-xs' />
                                <span className='hidden md:inline max-w-[90px] truncate'>{user.name?.split(' ')[0]}</span>
                                <FaCaretDown className={`text-[10px] transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {userDropdownOpen && (
                                <div
                                    onMouseLeave={() => setUserDropdownOpen(false)}
                                    className='absolute right-0 top-full mt-2 w-52 bg-white dark:bg-brand-card rounded-2xl shadow-xl py-2 z-50 border border-slate-100 dark:border-brand-border text-xs'
                                >
                                    <div className='px-4 py-2.5 border-b border-slate-100 dark:border-brand-border'>
                                        <p className='font-bold text-slate-900 dark:text-white truncate'>{user.name}</p>
                                        <p className='text-[11px] text-slate-400 truncate'>{user.email}</p>
                                        {user.role === 'admin' && (
                                            <span className='inline-block bg-primary/20 text-secondary dark:text-primary text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5'>
                                                Admin Privilege
                                            </span>
                                        )}
                                    </div>

                                    <Link
                                        to="/profile"
                                        onClick={() => setUserDropdownOpen(false)}
                                        className='block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium'
                                    >
                                        My Profile & Addresses
                                    </Link>
                                    <Link
                                        to="/orders"
                                        onClick={() => setUserDropdownOpen(false)}
                                        className='block px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium'
                                    >
                                        My Orders & Tracking
                                    </Link>
                                    {user.role === 'admin' && (
                                        <Link
                                            to="/admin"
                                            onClick={() => setUserDropdownOpen(false)}
                                            className='block px-4 py-2 hover:bg-amber-50 dark:hover:bg-amber-950/30 text-secondary dark:text-primary font-bold'
                                        >
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className='w-full text-left px-4 py-2.5 hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 flex items-center gap-2 border-t border-slate-100 dark:border-brand-border mt-1 font-semibold'
                                    >
                                        <FaArrowRightFromBracket className='text-xs' />
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className='bg-primary/15 hover:bg-primary/25 text-secondary dark:text-primary border border-primary/30 px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200'
                        >
                            Sign In
                        </Link>
                    )}

                    {/* Dark Mode Switch */}
                    <div>
                        <DarkMode />
                    </div>
                </div>
            </div>

            {/* Mobile Search Bar */}
            <div className='md:hidden container pb-2.5'>
                <div className='relative w-full'>
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        className='w-full rounded-full border border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-brand-card px-4 py-2 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-primary'
                    />
                    <button
                        onClick={handleSearch}
                        className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm'
                    >
                        <IoMdSearch />
                    </button>
                </div>
            </div>

            {/* Lower Navigation (Desktop) */}
            <nav className='hidden lg:block border-t border-slate-100 dark:border-brand-border/60'>
                <div className='container flex items-center justify-center'>
                    <ul className='flex items-center gap-1 py-1.5 text-xs font-semibold tracking-wide'>
                        {menu.map((item) => (
                            <li key={item.id}>
                                <Link
                                    to={item.link}
                                    className='inline-block px-3.5 py-1.5 rounded-full text-slate-700 dark:text-slate-200 hover:text-primary dark:hover:text-primary hover:bg-primary/10 transition-all duration-200'
                                >
                                    {item.name}
                                </Link>
                            </li>
                        ))}

                        {/* Dropdown Menu */}
                        <li className='group relative cursor-pointer'>
                            <div className='flex items-center gap-1 px-3.5 py-1.5 rounded-full text-slate-700 dark:text-slate-200 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-200'>
                                <span>Featured Drops</span>
                                <FaCaretDown className='text-[10px] transition-transform duration-200 group-hover:rotate-180' />
                            </div>
                            <ul className='absolute left-0 top-full mt-1 w-48 bg-white dark:bg-brand-card p-1.5 rounded-2xl shadow-xl border border-slate-100 dark:border-brand-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 space-y-0.5 z-50'>
                                {dropdownLinks.map((sub) => (
                                    <li key={sub.id}>
                                        <Link
                                            to={sub.link}
                                            className='block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-primary/15 hover:text-primary transition-colors text-xs font-medium'
                                        >
                                            {sub.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div className='lg:hidden fixed inset-0 top-[110px] bg-black/60 z-50 backdrop-blur-xs'>
                    <div className='bg-white dark:bg-brand-card w-[280px] h-full p-6 space-y-4 shadow-2xl overflow-y-auto border-r border-slate-200 dark:border-brand-border'>
                        <h3 className='text-xs font-bold uppercase tracking-wider text-slate-400'>
                            Explore Collections
                        </h3>
                        <ul className='space-y-1 text-sm font-medium'>
                            {menu.map((item) => (
                                <li key={item.id}>
                                    <Link
                                        to={item.link}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className='block py-2 px-3 rounded-xl text-slate-800 dark:text-slate-100 hover:bg-primary/15 hover:text-primary transition-colors'
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        <div className='pt-4 border-t border-slate-100 dark:border-brand-border'>
                            <h3 className='text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>
                                Featured
                            </h3>
                            <ul className='space-y-1 text-xs font-medium'>
                                {dropdownLinks.map((sub) => (
                                    <li key={sub.id}>
                                        <Link
                                            to={sub.link}
                                            onClick={() => setMobileMenuOpen(false)}
                                            className='block py-2 px-3 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-primary/15 hover:text-primary'
                                        >
                                            {sub.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;