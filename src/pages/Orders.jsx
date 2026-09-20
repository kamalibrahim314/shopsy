import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaBoxOpen, FaEye, FaArrowRight } from 'react-icons/fa6';
import { useGetMyOrdersQuery } from '../redux/features/orders/ordersApiSlice';

const statusBadgeClasses = {
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    processing: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20',
    shipped: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20',
    delivered: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20',
    cancelled: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20',
};

const Orders = () => {
    const { data, isLoading } = useGetMyOrdersQuery();
    const orders = data?.orders || [];

    if (isLoading) {
        return (
            <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 transition-colors duration-200'>
                <Navbar />
                <main className='flex-1 flex justify-center items-center py-32'>
                    <div className='w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200'>
            <Navbar />

            <main className='flex-1 container py-8 sm:py-12'>
                <div className='mb-8'>
                    <span className='text-xs font-bold uppercase tracking-widest text-primary'>Account History</span>
                    <h1 className='text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1'>
                        My Orders ({orders.length})
                    </h1>
                    <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1'>
                        Track your shipments, review past purchases, and download order details
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className='bg-white dark:bg-brand-card rounded-3xl p-12 text-center border border-slate-200/80 dark:border-brand-border shadow-card max-w-lg mx-auto my-8'>
                        <div className='w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary text-3xl mx-auto mb-5'>
                            <FaBoxOpen />
                        </div>
                        <h2 className='text-xl font-bold text-slate-900 dark:text-white mb-2'>No Orders Found</h2>
                        <p className='text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed'>
                            You haven't placed any orders with us yet. Discover our latest collections and start shopping!
                        </p>
                        <Link
                            to="/shop"
                            className='inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white px-7 py-3 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 shadow-md hover:scale-[1.02]'
                        >
                            <span>Browse Collections</span>
                            <FaArrowRight className='text-xs' />
                        </Link>
                    </div>
                ) : (
                    <div className='space-y-4'>
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className='bg-white dark:bg-brand-card rounded-2xl p-6 shadow-card border border-slate-200/80 dark:border-brand-border flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-primary/40 transition-colors duration-200'
                            >
                                <div className='space-y-2.5 flex-1'>
                                    <div className='flex flex-wrap items-center gap-3'>
                                        <span className='font-bold text-base text-slate-900 dark:text-white'>
                                            Order #{order.orderNumber}
                                        </span>
                                        <span
                                            className={`text-[11px] font-bold uppercase px-3 py-1 rounded-full ${
                                                statusBadgeClasses[order.status] || 'bg-slate-100 text-slate-700'
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>

                                    <p className='text-xs text-slate-500 dark:text-slate-400'>
                                        Placed on: {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>

                                    {/* Preview items */}
                                    <div className='flex items-center gap-2.5 pt-2 overflow-x-auto pb-1'>
                                        {order.items?.map((item) => (
                                            <img
                                                key={item.id}
                                                src={item.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600'}
                                                alt={item.name}
                                                title={`${item.name} (x${item.quantity})`}
                                                className='w-14 h-16 object-cover rounded-xl border border-slate-200 dark:border-brand-border flex-shrink-0 shadow-xs'
                                            />
                                        ))}
                                        <span className='text-xs font-semibold text-slate-500 dark:text-slate-400 pl-2'>
                                            {order.items?.length} item{order.items?.length > 1 ? 's' : ''}
                                        </span>
                                    </div>
                                </div>

                                <div className='flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between w-full md:w-auto gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200/80 dark:border-brand-border'>
                                    <div className='text-left md:text-right'>
                                        <p className='text-xs text-slate-400 font-medium'>Total Amount</p>
                                        <p className='text-2xl font-black text-slate-900 dark:text-primary'>
                                            ${Number(order.totalPrice).toFixed(2)}
                                        </p>
                                    </div>

                                    <Link
                                        to={`/orders/${order.id}`}
                                        className='inline-flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary dark:text-yellow-400 px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-200'
                                    >
                                        <FaEye /> <span>View Details</span>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Orders;
