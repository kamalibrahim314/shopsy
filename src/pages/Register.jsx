import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logo from '../assets/logo.png';
import { useRegisterMutation } from '../redux/features/auth/authApiSlice';
import { useSelector } from 'react-redux';

const Register = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';

    const [registerApi, { isLoading }] = useRegisterMutation();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [errorMsg, setErrorMsg] = useState(null);

    React.useEffect(() => {
        if (isAuthenticated) {
            navigate(redirectPath, { replace: true });
        }
    }, [isAuthenticated, navigate, redirectPath]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setErrorMsg('Password must be at least 6 characters long');
            return;
        }

        try {
            await registerApi({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            }).unwrap();

            navigate(redirectPath, { replace: true });
        } catch (err) {
            setErrorMsg(err?.data?.message || 'Registration failed. Please check your details.');
        }
    };

    return (
        <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200'>
            <Navbar />

            <main className='flex-1 container flex items-center justify-center py-12 sm:py-16'>
                <div className='w-full max-w-md bg-white dark:bg-brand-card p-8 sm:p-10 rounded-3xl shadow-card border border-slate-200/80 dark:border-brand-border'>
                    <div className='text-center mb-8'>
                        <img src={logo} alt="Shopsy" className='w-12 mx-auto mb-3' />
                        <h1 className='text-2xl font-black text-slate-900 dark:text-white tracking-tight'>Create Account</h1>
                        <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1'>
                            Join Shopsy for exclusive luxury pieces and express checkout
                        </p>
                    </div>

                    {errorMsg && (
                        <div className='bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 p-3 rounded-2xl text-xs mb-6 text-center font-semibold'>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                Full Name
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className='w-full rounded-xl border border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-brand-dark px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                Email Address
                            </label>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className='w-full rounded-xl border border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-brand-dark px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                Phone Number (Optional)
                            </label>
                            <input
                                type="tel"
                                placeholder="+201000000000"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className='w-full rounded-xl border border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-brand-dark px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="At least 6 characters"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className='w-full rounded-xl border border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-brand-dark px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                            />
                        </div>

                        <div>
                            <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                required
                                placeholder="Repeat your password"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                className='w-full rounded-xl border border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-brand-dark px-4 py-3 text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all'
                            />
                        </div>

                        <div className='pt-2'>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className='w-full bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white py-3.5 rounded-full font-bold shadow-md hover:scale-[1.01] duration-200 text-xs sm:text-sm disabled:opacity-50'
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className='mt-6 text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400'>
                        Already have an account?{' '}
                        <Link
                            to={`/login${redirectPath !== '/' ? `?redirect=${redirectPath}` : ''}`}
                            className='text-primary font-bold hover:underline'
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Register;
