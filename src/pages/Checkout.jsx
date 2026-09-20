import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaCheck, FaMoneyBillWave, FaCreditCard, FaLock, FaPlus } from 'react-icons/fa6';
import { useGetCartQuery } from '../redux/features/cart/cartApiSlice';
import { useGetAddressesQuery, useCreateAddressMutation } from '../redux/features/users/usersApiSlice';
import { useCreateOrderMutation } from '../redux/features/orders/ordersApiSlice';

const Checkout = () => {
    const navigate = useNavigate();

    const { data: cartData, isLoading: isCartLoading } = useGetCartQuery();
    const { data: addressData, isLoading: isAddressLoading } = useGetAddressesQuery();
    const [createAddressApi] = useCreateAddressMutation();
    const [createOrderApi, { isLoading: isOrdering }] = useCreateOrderMutation();

    const addresses = React.useMemo(() => addressData?.addresses || [], [addressData]);
    const cart = cartData?.cart;
    const items = cart?.items || [];

    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [errorMsg, setErrorMsg] = useState(null);

    const [showNewAddressModal, setShowNewAddressModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Egypt',
        isDefault: true,
    });

    React.useEffect(() => {
        if (addresses.length > 0 && !selectedAddressId) {
            const def = addresses.find((a) => a.isDefault) || addresses[0];
            setSelectedAddressId(def.id);
        }
    }, [addresses, selectedAddressId]);

    const handleNewAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await createAddressApi(newAddress).unwrap();
            setSelectedAddressId(res.address.id);
            setShowNewAddressModal(false);
            setNewAddress({
                fullName: '',
                phone: '',
                street: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'Egypt',
                isDefault: false,
            });
        } catch (err) {
            setErrorMsg(err?.data?.message || 'Failed to add address');
        }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddressId) {
            setErrorMsg('Please select or add a shipping address');
            return;
        }

        setErrorMsg(null);
        try {
            const res = await createOrderApi({
                addressId: selectedAddressId,
                paymentMethod,
            }).unwrap();

            navigate(`/orders/${res.order.id}?success=true`);
        } catch (err) {
            setErrorMsg(err?.data?.message || 'Failed to place order. Please try again.');
        }
    };

    if (isCartLoading || isAddressLoading) {
        return (
            <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark'>
                <Navbar />
                <main className='flex-1 flex justify-center items-center py-32'>
                    <div className='w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin'></div>
                </main>
                <Footer />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark'>
                <Navbar />
                <main className='flex-1 container text-center py-24'>
                    <h2 className='text-2xl font-black text-slate-900 dark:text-white mb-2'>No Items in Bag</h2>
                    <p className='text-xs sm:text-sm text-slate-500 mb-6'>Your shopping bag is currently empty.</p>
                    <Link
                        to="/shop"
                        className='bg-primary text-slate-950 font-bold px-7 py-3 rounded-full text-xs hover:bg-primary-dark hover:text-white transition-colors'
                    >
                        Browse Collections
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const itemsPrice = cart?.totalPrice || 0;
    const shippingPrice = itemsPrice > 500 ? 0.00 : 35.00;
    const taxPrice = Number((itemsPrice * 0.05).toFixed(2));
    const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));

    return (
        <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 transition-colors duration-200'>
            <Navbar />

            <main className='flex-1 container py-8 sm:py-12'>
                <div className='mb-8'>
                    <span className='text-xs font-bold uppercase tracking-widest text-primary'>Finalize Purchase</span>
                    <h1 className='text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1'>
                        Secure Checkout
                    </h1>
                </div>

                {errorMsg && (
                    <div className='bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 p-4 rounded-2xl text-xs sm:text-sm font-semibold mb-6'>
                        {errorMsg}
                    </div>
                )}

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start'>
                    {/* Left: Shipping & Payment Steps */}
                    <div className='lg:col-span-8 space-y-6'>
                        {/* 1. Shipping Address */}
                        <div className='bg-white dark:bg-brand-card p-6 rounded-3xl shadow-card border border-slate-200/80 dark:border-brand-border space-y-4'>
                            <div className='flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800'>
                                <h2 className='text-base font-black text-slate-900 dark:text-white flex items-center gap-2.5'>
                                    <span className='w-6 h-6 rounded-full bg-primary text-slate-950 text-xs font-black flex items-center justify-center'>1</span>
                                    Shipping Destination
                                </h2>
                                <button
                                    onClick={() => setShowNewAddressModal(true)}
                                    className='text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1.5'
                                >
                                    <FaPlus className='text-[10px]' /> Add Address
                                </button>
                            </div>

                            {addresses.length === 0 ? (
                                <div className='text-center py-8 border border-dashed rounded-2xl border-slate-200 dark:border-brand-border'>
                                    <p className='text-xs text-slate-500 mb-3'>No saved addresses found.</p>
                                    <button
                                        onClick={() => setShowNewAddressModal(true)}
                                        className='bg-primary text-slate-950 text-xs px-5 py-2 rounded-full font-bold'
                                    >
                                        Add New Address
                                    </button>
                                </div>
                            ) : (
                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr.id}
                                            onClick={() => setSelectedAddressId(addr.id)}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                                selectedAddressId === addr.id
                                                    ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-xs'
                                                    : 'border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className='flex items-center justify-between mb-1.5'>
                                                <span className='font-bold text-xs sm:text-sm text-slate-900 dark:text-white'>{addr.fullName}</span>
                                                {selectedAddressId === addr.id && (
                                                    <span className='w-5 h-5 rounded-full bg-primary text-slate-950 flex items-center justify-center text-[10px]'>
                                                        <FaCheck />
                                                    </span>
                                                )}
                                            </div>
                                            <p className='text-xs text-slate-500 dark:text-slate-400'>{addr.street}</p>
                                            <p className='text-xs text-slate-500 dark:text-slate-400'>{addr.city}, {addr.state} {addr.postalCode}</p>
                                            <p className='text-xs text-slate-700 dark:text-slate-300 mt-2 font-semibold'>{addr.phone}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 2. Payment Method */}
                        <div className='bg-white dark:bg-brand-card p-6 rounded-3xl shadow-card border border-slate-200/80 dark:border-brand-border space-y-4'>
                            <h2 className='text-base font-black text-slate-900 dark:text-white flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800'>
                                <span className='w-6 h-6 rounded-full bg-primary text-slate-950 text-xs font-black flex items-center justify-center'>2</span>
                                Payment Method
                            </h2>

                            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                <div
                                    onClick={() => setPaymentMethod('cod')}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all ${
                                        paymentMethod === 'cod'
                                            ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-xs'
                                            : 'border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                                    }`}
                                >
                                    <div className='w-10 h-10 rounded-xl bg-primary/15 text-primary flex items-center justify-center text-lg flex-shrink-0'>
                                        <FaMoneyBillWave />
                                    </div>
                                    <div>
                                        <p className='font-bold text-xs sm:text-sm text-slate-900 dark:text-white'>Cash on Delivery</p>
                                        <p className='text-[11px] text-slate-500'>Pay when order is received at your door</p>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('card')}
                                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center gap-4 transition-all ${
                                        paymentMethod === 'card'
                                            ? 'border-primary bg-primary/5 dark:bg-primary/10 shadow-xs'
                                            : 'border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300'
                                    }`}
                                >
                                    <div className='w-10 h-10 rounded-xl bg-secondary/15 text-secondary flex items-center justify-center text-lg flex-shrink-0'>
                                        <FaCreditCard />
                                    </div>
                                    <div>
                                        <p className='font-bold text-xs sm:text-sm text-slate-900 dark:text-white'>Credit / Debit Card</p>
                                        <p className='text-[11px] text-slate-500'>Encrypted direct online payment</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Items Review */}
                        <div className='bg-white dark:bg-brand-card p-6 rounded-3xl shadow-card border border-slate-200/80 dark:border-brand-border space-y-4'>
                            <h2 className='text-base font-black text-slate-900 dark:text-white flex items-center gap-2.5 pb-2 border-b border-slate-100 dark:border-slate-800'>
                                <span className='w-6 h-6 rounded-full bg-primary text-slate-950 text-xs font-black flex items-center justify-center'>3</span>
                                Order Bag Breakdown ({items.length} garments)
                            </h2>

                            <div className='divide-y divide-slate-100 dark:divide-slate-800'>
                                {items.map((item) => (
                                    <div key={item.id} className='py-3.5 flex items-center justify-between text-xs sm:text-sm'>
                                        <div className='flex items-center gap-3.5'>
                                            <img
                                                src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800'}
                                                alt=""
                                                className='w-12 h-15 object-cover object-top rounded-xl bg-slate-100 dark:bg-slate-800'
                                            />
                                            <div>
                                                <p className='font-bold text-slate-900 dark:text-white'>{item.product?.name}</p>
                                                <p className='text-[11px] text-slate-500'>
                                                    Qty: {item.quantity} {item.size && `• Size: ${item.size}`} {item.color && `• Color: ${item.color}`}
                                                </p>
                                            </div>
                                        </div>
                                        <span className='font-bold text-slate-900 dark:text-white'>
                                            ${item.lineTotal.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Sticky Summary */}
                    <div className='lg:col-span-4'>
                        <div className='bg-white dark:bg-brand-card p-6 rounded-3xl shadow-card border border-slate-200/80 dark:border-brand-border sticky top-24 space-y-5'>
                            <h2 className='text-base font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3'>
                                Total Checkout
                            </h2>

                            <div className='space-y-3 text-xs sm:text-sm'>
                                <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                    <span>Items Subtotal</span>
                                    <span className='font-bold text-slate-900 dark:text-white'>${itemsPrice.toFixed(2)}</span>
                                </div>
                                <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                    <span>Shipping</span>
                                    <span className='font-bold'>
                                        {shippingPrice === 0 ? (
                                            <span className='text-emerald-500 font-extrabold uppercase text-xs'>Free</span>
                                        ) : (
                                            `$${shippingPrice.toFixed(2)}`
                                        )}
                                    </span>
                                </div>
                                <div className='flex justify-between text-slate-600 dark:text-slate-300'>
                                    <span>Sales Tax (5%)</span>
                                    <span className='font-bold text-slate-900 dark:text-white'>${taxPrice.toFixed(2)}</span>
                                </div>

                                <div className='border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between items-baseline'>
                                    <span className='font-black text-base text-slate-900 dark:text-white'>Grand Total</span>
                                    <span className='text-2xl font-black text-slate-900 dark:text-white'>
                                        ${totalPrice.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={isOrdering}
                                className='w-full bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white py-4 rounded-full font-bold flex items-center justify-center gap-2 transition duration-200 shadow-md disabled:opacity-50 text-sm hover:scale-[1.01]'
                            >
                                <FaLock className='text-xs' />
                                <span>{isOrdering ? 'Processing Order...' : 'Confirm Order'}</span>
                            </button>

                            <div className='text-center text-[11px] text-slate-400 space-y-1'>
                                <p>30-Day Guaranteed Returns & Exchanges</p>
                                <p>Taxes and duties calculated based on delivery destination.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal for adding address */}
            {showNewAddressModal && (
                <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs'>
                    <div className='bg-white dark:bg-brand-card rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-brand-border'>
                        <h3 className='text-base font-black text-slate-900 dark:text-white'>Add Shipping Address</h3>
                        <form onSubmit={handleNewAddressSubmit} className='space-y-3 text-xs'>
                            <input
                                type="text"
                                required
                                placeholder="Recipient Full Name"
                                value={newAddress.fullName}
                                onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                className='w-full border border-slate-200 dark:border-brand-border rounded-xl p-3 dark:bg-slate-800 dark:text-white'
                            />
                            <input
                                type="text"
                                required
                                placeholder="Phone Number (e.g. +201000000000)"
                                value={newAddress.phone}
                                onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                className='w-full border border-slate-200 dark:border-brand-border rounded-xl p-3 dark:bg-slate-800 dark:text-white'
                            />
                            <input
                                type="text"
                                required
                                placeholder="Street Address"
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                className='w-full border border-slate-200 dark:border-brand-border rounded-xl p-3 dark:bg-slate-800 dark:text-white'
                            />
                            <div className='grid grid-cols-2 gap-3'>
                                <input
                                    type="text"
                                    required
                                    placeholder="City"
                                    value={newAddress.city}
                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                    className='border border-slate-200 dark:border-brand-border rounded-xl p-3 dark:bg-slate-800 dark:text-white'
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="State / Governorate"
                                    value={newAddress.state}
                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                    className='border border-slate-200 dark:border-brand-border rounded-xl p-3 dark:bg-slate-800 dark:text-white'
                                />
                            </div>
                            <div className='grid grid-cols-2 gap-3'>
                                <input
                                    type="text"
                                    required
                                    placeholder="Postal Code"
                                    value={newAddress.postalCode}
                                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                    className='border border-slate-200 dark:border-brand-border rounded-xl p-3 dark:bg-slate-800 dark:text-white'
                                />
                                <input
                                    type="text"
                                    required
                                    placeholder="Country"
                                    value={newAddress.country}
                                    onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                    className='border border-slate-200 dark:border-brand-border rounded-xl p-3 dark:bg-slate-800 dark:text-white'
                                />
                            </div>

                            <div className='flex justify-end gap-2.5 pt-4 border-t border-slate-100 dark:border-slate-800'>
                                <button
                                    type="button"
                                    onClick={() => setShowNewAddressModal(false)}
                                    className='px-4 py-2 border border-slate-200 dark:border-brand-border rounded-full text-xs font-semibold text-slate-700 dark:text-slate-300'
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className='px-6 py-2 bg-primary text-slate-950 font-bold rounded-full text-xs hover:bg-primary-dark hover:text-white'
                                >
                                    Save Address
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default Checkout;
