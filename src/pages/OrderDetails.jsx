import React from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaCircleCheck, FaTruckFast, FaClock, FaArrowLeft, FaCheck } from 'react-icons/fa6';
import { useGetOrderByIdQuery } from '../redux/features/orders/ordersApiSlice';

const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];

const OrderDetails = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const isSuccessJustNow = searchParams.get('success') === 'true';

    const { data, isLoading, isError } = useGetOrderByIdQuery(id);
    const order = data?.order;

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

    if (isError || !order) {
        return (
            <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 transition-colors duration-200'>
                <Navbar />
                <main className='flex-1 container text-center py-24'>
                    <h2 className='text-2xl font-black text-slate-900 dark:text-white mb-2'>Order Not Found</h2>
                    <p className='text-xs sm:text-sm text-slate-500 mb-6'>We could not locate this order in our records.</p>
                    <Link
                        to="/orders"
                        className='bg-primary text-slate-950 font-bold px-7 py-3 rounded-full text-xs hover:bg-secondary hover:text-white transition-colors inline-block'
                    >
                        Return to My Orders
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const currentStepIndex = statusSteps.indexOf(order.status);
    const isCancelled = order.status === 'cancelled';
    const address = order.shippingAddress || {};

    return (
        <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200'>
            <Navbar />

            <main className='flex-1 container py-8 sm:py-12'>
                <Link
                    to="/orders"
                    className='inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary mb-6 transition-colors dark:text-slate-400'
                >
                    <FaArrowLeft className='text-[10px]' /> Back to My Orders
                </Link>

                {isSuccessJustNow && (
                    <div className='bg-emerald-500/10 border border-emerald-500/30 p-6 rounded-2xl mb-8 flex items-center gap-4 text-emerald-800 dark:text-emerald-300'>
                        <FaCircleCheck className='text-3xl text-emerald-600 dark:text-emerald-400 flex-shrink-0' />
                        <div>
                            <h2 className='text-base sm:text-lg font-bold'>
                                Thank You! Your Order Has Been Confirmed.
                            </h2>
                            <p className='text-xs text-emerald-700/80 dark:text-emerald-400/80 mt-0.5'>
                                We have received your order and our styling team is preparing it for shipment.
                            </p>
                        </div>
                    </div>
                )}

                {/* Order Header */}
                <div className='bg-white dark:bg-brand-card rounded-2xl p-6 shadow-card border border-slate-200/80 dark:border-brand-border mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
                    <div>
                        <span className='text-[11px] font-bold uppercase tracking-wider text-slate-400'>Order Reference</span>
                        <h1 className='text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-0.5'>
                            #{order.orderNumber}
                        </h1>
                        <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                            Placed on {new Date(order.createdAt).toLocaleString('en-US', {
                                dateStyle: 'medium',
                                timeStyle: 'short',
                            })}
                        </p>
                    </div>

                    <div className='text-left sm:text-right'>
                        <span className='text-[11px] font-bold uppercase tracking-wider text-slate-400'>Current Status</span>
                        <div className='mt-1'>
                            <span
                                className={`text-xs font-bold uppercase px-3.5 py-1.5 rounded-full inline-block ${
                                    isCancelled
                                        ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                                        : order.status === 'delivered'
                                        ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                }`}
                            >
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Tracking Progress Stepper */}
                {!isCancelled && (
                    <div className='bg-white dark:bg-brand-card rounded-2xl p-6 sm:p-8 shadow-card border border-slate-200/80 dark:border-brand-border mb-6'>
                        <h2 className='text-xs font-bold uppercase tracking-wider text-slate-400 mb-8'>
                            Fulfillment Journey
                        </h2>
                        <div className='relative flex items-center justify-between max-w-2xl mx-auto px-4'>
                            {/* Connecting Gray Base Line */}
                            <div className='absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-brand-border z-0'></div>
                            {/* Connecting Active Color Line */}
                            <div
                                className='absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-primary to-secondary z-0 transition-all duration-500'
                                style={{
                                    width: `calc(${Math.max(0, (currentStepIndex / (statusSteps.length - 1)) * 100)}% - 32px)`,
                                }}
                            ></div>

                            {statusSteps.map((step, idx) => {
                                const isCompleted = idx <= currentStepIndex;
                                return (
                                    <div key={step} className='relative z-10 flex flex-col items-center'>
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors duration-300 ${
                                                isCompleted
                                                    ? 'bg-primary text-slate-950 shadow-md font-black'
                                                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                                            }`}
                                        >
                                            {isCompleted ? <FaCheck /> : idx + 1}
                                        </div>
                                        <span className='capitalize text-xs font-semibold mt-2.5 text-slate-700 dark:text-slate-300'>
                                            {step}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
                    {/* Left: Purchased Items List */}
                    <div className='lg:col-span-2 space-y-6'>
                        <div className='bg-white dark:bg-brand-card rounded-2xl p-6 shadow-card border border-slate-200/80 dark:border-brand-border'>
                            <h2 className='text-base font-bold text-slate-900 dark:text-white mb-4'>Purchased Pieces</h2>
                            <div className='divide-y divide-slate-100 dark:divide-brand-border'>
                                {order.items?.map((item) => (
                                    <div key={item.id} className='py-4 flex items-center justify-between gap-4 first:pt-0 last:pb-0'>
                                        <div className='flex items-center gap-4'>
                                            <img
                                                src={item.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600'}
                                                alt={item.name}
                                                className='w-16 h-20 object-cover rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-brand-border flex-shrink-0'
                                            />
                                            <div>
                                                <h3 className='font-bold text-sm text-slate-900 dark:text-white'>{item.name}</h3>
                                                <div className='text-xs text-slate-500 dark:text-slate-400 flex gap-3 mt-1'>
                                                    {item.size && <span>Size: <strong>{item.size}</strong></span>}
                                                    {item.color && <span>Color: <strong>{item.color}</strong></span>}
                                                </div>
                                                <p className='text-xs text-slate-400 mt-1'>
                                                    Qty: {item.quantity} &times; ${Number(item.price).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                        <span className='font-bold text-slate-900 dark:text-white text-sm'>
                                            ${(Number(item.price) * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping & Payment details */}
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
                            <div className='bg-white dark:bg-brand-card rounded-2xl p-6 shadow-card border border-slate-200/80 dark:border-brand-border'>
                                <h3 className='font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3'>
                                    <FaTruckFast className='text-primary' /> Delivery Address
                                </h3>
                                <p className='text-sm font-bold text-slate-900 dark:text-white'>{address.fullName}</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>{address.street}</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400'>{address.city}, {address.state} {address.postalCode}</p>
                                <p className='text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium'>Phone: {address.phone}</p>
                            </div>

                            <div className='bg-white dark:bg-brand-card rounded-2xl p-6 shadow-card border border-slate-200/80 dark:border-brand-border'>
                                <h3 className='font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3'>
                                    <FaClock className='text-primary' /> Payment Details
                                </h3>
                                <p className='text-sm font-bold text-slate-900 dark:text-white uppercase'>
                                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card'}
                                </p>
                                <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>
                                    Payment Status: <strong className='capitalize text-slate-800 dark:text-slate-200'>{order.paymentStatus}</strong>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Payment Calculation Breakdown */}
                    <div className='col-span-1'>
                        <div className='bg-white dark:bg-brand-card rounded-2xl p-6 shadow-card border border-slate-200/80 dark:border-brand-border space-y-4'>
                            <h2 className='text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-brand-border pb-3'>
                                Order Summary
                            </h2>

                            <div className='space-y-3 text-xs sm:text-sm'>
                                <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                    <span>Items Subtotal</span>
                                    <span className='font-semibold'>${Number(order.itemsPrice).toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                    <span>Shipping</span>
                                    <span className='font-semibold'>
                                        {Number(order.shippingPrice) === 0 ? (
                                            <span className='text-emerald-500 font-bold uppercase'>Free</span>
                                        ) : (
                                            `$${Number(order.shippingPrice).toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                    <span>Tax (5%)</span>
                                    <span className='font-semibold'>${Number(order.taxPrice).toFixed(2)}</span>
                                </div>

                                <div className='border-t border-slate-100 dark:border-brand-border pt-4 flex justify-between items-baseline'>
                                    <span className='font-bold text-sm text-slate-900 dark:text-white'>Grand Total</span>
                                    <span className='text-2xl font-black text-slate-900 dark:text-primary'>
                                        ${Number(order.totalPrice).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OrderDetails;
