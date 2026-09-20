import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaStar, FaCheck, FaTruckFast, FaShieldHalved, FaRotateLeft, FaArrowLeft, FaBagShopping, FaLock } from 'react-icons/fa6';
import { useGetProductByIdQuery } from '../redux/features/products/productsApiSlice';
import { useAddToCartMutation } from '../redux/features/cart/cartApiSlice';
import { useSelector } from 'react-redux';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);

    const { data, isLoading, isError } = useGetProductByIdQuery(id);
    const product = data?.product;

    const [addToCartApi, { isLoading: isAdding }] = useAddToCartMutation();

    const [selectedImage, setSelectedImage] = useState(0);
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [notification, setNotification] = useState(null);

    React.useEffect(() => {
        if (product) {
            if (product.sizes && product.sizes.length > 0 && !selectedSize) {
                setSelectedSize(product.sizes[0]);
            }
            if (product.colors && product.colors.length > 0 && !selectedColor) {
                setSelectedColor(product.colors[0]);
            }
        }
    }, [product, selectedSize, selectedColor]);

    const handleQuantityChange = (type) => {
        if (!product) return;
        if (type === 'inc') {
            if (quantity < product.stock) {
                setQuantity(quantity + 1);
            }
        } else if (type === 'dec') {
            if (quantity > 1) {
                setQuantity(quantity - 1);
            }
        }
    };

    const handleAddToCart = async (goToCheckout = false) => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
            return;
        }

        try {
            await addToCartApi({
                productId: product.id,
                quantity,
                size: selectedSize,
                color: selectedColor,
            }).unwrap();

            if (goToCheckout) {
                navigate('/checkout');
            } else {
                setNotification('Piece added to your shopping bag!');
                setTimeout(() => setNotification(null), 3000);
            }
        } catch (err) {
            setNotification(err?.data?.message || 'Failed to add item to bag');
            setTimeout(() => setNotification(null), 4000);
        }
    };

    if (isLoading) {
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

    if (isError || !product) {
        return (
            <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark'>
                <Navbar />
                <main className='flex-1 container text-center py-24'>
                    <h2 className='text-2xl font-black text-slate-900 dark:text-white mb-3'>Item Not Found</h2>
                    <p className='text-xs sm:text-sm text-slate-500 mb-6'>The requested apparel piece is no longer available in our collection.</p>
                    <Link
                        to="/shop"
                        className='bg-primary text-slate-950 font-bold px-7 py-3 rounded-full text-xs hover:bg-primary-dark hover:text-white transition-colors'
                    >
                        Return to Catalog
                    </Link>
                </main>
                <Footer />
            </div>
        );
    }

    const images = product.images && product.images.length > 0
        ? product.images
        : ['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800'];

    return (
        <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 transition-colors duration-200'>
            <Navbar />

            {/* Notification Toast */}
            {notification && (
                <div className='fixed top-24 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-primary animate-bounce'>
                    <FaCheck className='text-primary text-sm' />
                    <span className='text-xs font-bold'>{notification}</span>
                </div>
            )}

            <main className='flex-1 container py-8 sm:py-12'>
                {/* Back navigation */}
                <Link
                    to="/shop"
                    className='inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-primary mb-6 transition-colors dark:text-slate-400'
                >
                    <FaArrowLeft className='text-[10px]' /> Back to Collections
                </Link>

                <div className='grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start'>
                    {/* Left: Product Images Gallery */}
                    <div className='lg:col-span-6 space-y-4'>
                        <div className='bg-white dark:bg-brand-card rounded-3xl overflow-hidden shadow-card border border-slate-200/80 dark:border-brand-border h-[420px] sm:h-[520px] flex items-center justify-center p-3'>
                            <img
                                src={images[selectedImage] || images[0]}
                                alt={product.name}
                                className='h-full w-full object-contain max-h-[500px] transition-all duration-300'
                            />
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className='flex gap-3 overflow-x-auto pb-2'>
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 bg-white dark:bg-brand-card ${
                                            selectedImage === idx
                                                ? 'border-primary shadow-md scale-102'
                                                : 'border-transparent opacity-60 hover:opacity-100'
                                        }`}
                                    >
                                        <img src={img} alt="" className='w-full h-full object-cover object-top' />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Product Details & Purchase Form */}
                    <div className='lg:col-span-6 space-y-6'>
                        <div>
                            <span className='inline-block bg-primary/15 text-secondary dark:text-primary font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2.5'>
                                {product.category?.name || 'Exclusive Collection'}
                            </span>
                            <h1 className='text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight'>
                                {product.name}
                            </h1>

                            {/* Ratings & reviews */}
                            <div className='flex items-center gap-2.5 mt-3'>
                                <div className='flex text-amber-500 text-xs gap-1'>
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                    <FaStar />
                                </div>
                                <span className='text-xs font-bold text-slate-900 dark:text-white'>
                                    {product.rating || '4.9'}
                                </span>
                                <span className='text-xs text-slate-400'>
                                    ({product.numReviews || 45} client ratings)
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className='flex items-baseline gap-3 py-3 border-y border-slate-200/80 dark:border-brand-border'>
                            <span className='text-3xl sm:text-4xl font-black text-slate-900 dark:text-white'>
                                ${Number(product.discountPrice || product.price).toFixed(2)}
                            </span>
                            {product.discountPrice && (
                                <>
                                    <span className='text-lg text-slate-400 line-through'>
                                        ${Number(product.price).toFixed(2)}
                                    </span>
                                    <span className='bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 text-xs font-bold px-2.5 py-0.5 rounded-full'>
                                        Save ${(Number(product.price) - Number(product.discountPrice)).toFixed(2)}
                                    </span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        <p className='text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed'>
                            {product.description}
                        </p>

                        {/* Color Selector */}
                        {product.colors && product.colors.length > 0 && (
                            <div>
                                <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>
                                    Color Palette: <span className='text-slate-900 dark:text-white'>{selectedColor}</span>
                                </label>
                                <div className='flex flex-wrap gap-2'>
                                    {product.colors.map((c) => (
                                        <button
                                            key={c}
                                            onClick={() => setSelectedColor(c)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                                selectedColor === c
                                                    ? 'border-primary bg-primary text-slate-950 shadow-xs'
                                                    : 'border-slate-200 dark:border-brand-border bg-white dark:bg-brand-card text-slate-700 dark:text-slate-200 hover:border-primary'
                                            }`}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selector */}
                        {product.sizes && product.sizes.length > 0 && (
                            <div>
                                <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>
                                    Select Size: <span className='text-slate-900 dark:text-white'>{selectedSize}</span>
                                </label>
                                <div className='flex flex-wrap gap-2'>
                                    {product.sizes.map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setSelectedSize(s)}
                                            className={`min-w-[42px] h-10 px-3 rounded-xl text-xs font-bold border flex items-center justify-center transition-all ${
                                                selectedSize === s
                                                    ? 'border-primary bg-primary text-slate-950 shadow-xs'
                                                    : 'border-slate-200 dark:border-brand-border bg-white dark:bg-brand-card text-slate-700 dark:text-slate-200 hover:border-primary'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quantity & Inventory Status */}
                        <div className='flex items-center gap-6 pt-2'>
                            <div>
                                <label className='block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2'>
                                    Quantity:
                                </label>
                                <div className='flex items-center border border-slate-200 dark:border-brand-border rounded-xl bg-white dark:bg-brand-card'>
                                    <button
                                        disabled={quantity <= 1 || product.stock <= 0}
                                        onClick={() => handleQuantityChange('dec')}
                                        className='px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-base font-bold'
                                    >
                                        -
                                    </button>
                                    <span className='px-4 text-xs font-bold'>{quantity}</span>
                                    <button
                                        disabled={quantity >= product.stock || product.stock <= 0}
                                        onClick={() => handleQuantityChange('inc')}
                                        className='px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-base font-bold'
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <div className='pt-6'>
                                {product.stock > 0 ? (
                                    <span className='text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3.5 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800'>
                                        In Stock ({product.stock} units)
                                    </span>
                                ) : (
                                    <span className='text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 px-3.5 py-1.5 rounded-full border border-red-200 dark:border-red-800'>
                                        Out of Stock
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className='flex flex-col sm:flex-row gap-4 pt-4'>
                            <button
                                disabled={product.stock <= 0 || isAdding}
                                onClick={() => handleAddToCart(false)}
                                className='flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-95 disabled:opacity-50 text-white py-3.5 px-6 rounded-full font-bold flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md hover:scale-[1.01]'
                            >
                                <FaBagShopping />
                                <span>{isAdding ? 'Adding...' : 'Add to Bag'}</span>
                            </button>
                            <button
                                disabled={product.stock <= 0 || isAdding}
                                onClick={() => handleAddToCart(true)}
                                className='flex-1 bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 disabled:opacity-50 text-white py-3.5 px-6 rounded-full font-bold transition-all duration-200 shadow-md hover:scale-[1.01] flex items-center justify-center gap-2'
                            >
                                <FaLock className='text-xs' />
                                <span>Express Checkout</span>
                            </button>
                        </div>

                        {/* Fashion Assurance Badges */}
                        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 dark:border-brand-border text-xs text-slate-500 dark:text-slate-400'>
                            <div className='flex items-center gap-2'>
                                <FaTruckFast className='text-primary text-sm flex-shrink-0' />
                                <span>Complimentary Shipping Over $500</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <FaShieldHalved className='text-primary text-sm flex-shrink-0' />
                                <span>Certified Luxury Quality</span>
                            </div>
                            <div className='flex items-center gap-2'>
                                <FaRotateLeft className='text-primary text-sm flex-shrink-0' />
                                <span>30-Day Hassle-Free Returns</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProductDetails;
