import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaBoxesStacked, FaClipboardList, FaPlus, FaTrash, FaCheck, FaXmark } from 'react-icons/fa6';
import {
    useGetProductsQuery,
    useCreateProductMutation,
    useDeleteProductMutation,
    useGetCategoriesQuery,
} from '../redux/features/products/productsApiSlice';
import {
    useGetAllOrdersQuery,
    useUpdateOrderStatusMutation,
} from '../redux/features/orders/ordersApiSlice';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('products');

    const { data: productsData, isLoading: isProductsLoading } = useGetProductsQuery({ limit: 50 });
    const { data: categoriesData } = useGetCategoriesQuery();
    const { data: ordersData, isLoading: isOrdersLoading } = useGetAllOrdersQuery();

    const [createProductApi, { isLoading: isCreatingProduct }] = useCreateProductMutation();
    const [deleteProductApi] = useDeleteProductMutation();
    const [updateOrderStatusApi] = useUpdateOrderStatusMutation();

    const products = productsData?.products || [];
    const categories = categoriesData?.categories || [];
    const orders = ordersData?.orders || [];

    const [showAddProductModal, setShowAddProductModal] = useState(false);
    const [newProduct, setNewProduct] = useState({
        name: '',
        categoryId: '',
        price: '',
        discountPrice: '',
        stock: '',
        description: '',
        colors: 'Red, Blue, Black, White',
        sizes: 'S, M, L, XL',
        isFeatured: false,
        isTrending: false,
        isTopRated: false,
    });
    const [selectedImages, setSelectedImages] = useState([]);
    const [msg, setMsg] = useState(null);

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setMsg(null);

        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('categoryId', newProduct.categoryId || (categories[0]?.id || ''));
        formData.append('price', newProduct.price);
        if (newProduct.discountPrice) formData.append('discountPrice', newProduct.discountPrice);
        formData.append('stock', newProduct.stock || 0);
        formData.append('description', newProduct.description);
        formData.append('colors', JSON.stringify(newProduct.colors.split(',').map((s) => s.trim())));
        formData.append('sizes', JSON.stringify(newProduct.sizes.split(',').map((s) => s.trim())));
        formData.append('isFeatured', newProduct.isFeatured);
        formData.append('isTrending', newProduct.isTrending);
        formData.append('isTopRated', newProduct.isTopRated);

        if (selectedImages.length > 0) {
            for (let i = 0; i < selectedImages.length; i++) {
                formData.append('images', selectedImages[i]);
            }
        }

        try {
            await createProductApi(formData).unwrap();
            setShowAddProductModal(false);
            setMsg('Product created and inventory updated successfully!');
            setTimeout(() => setMsg(null), 3000);
        } catch (err) {
            setMsg(err?.data?.message || 'Failed to create product');
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await updateOrderStatusApi({ id: orderId, status: newStatus }).unwrap();
            setMsg('Order status updated successfully!');
            setTimeout(() => setMsg(null), 2000);
        } catch (err) {
            setMsg('Failed to update status');
        }
    };

    return (
        <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200'>
            <Navbar />

            <main className='flex-1 container py-8 sm:py-12'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
                    <div>
                        <span className='text-xs font-bold uppercase tracking-widest text-primary'>Control Center</span>
                        <h1 className='text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1'>
                            Admin Dashboard
                        </h1>
                        <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1'>
                            Manage products, adjust live inventory stock, and monitor customer orders
                        </p>
                    </div>

                    <div className='flex items-center gap-2 p-1.5 bg-white dark:bg-brand-card rounded-2xl border border-slate-200/80 dark:border-brand-border shadow-xs'>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'products'
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xs'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <FaBoxesStacked /> <span>Products ({products.length})</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'orders'
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xs'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <FaClipboardList /> <span>Orders ({orders.length})</span>
                        </button>
                    </div>
                </div>

                {msg && (
                    <div className='bg-primary/15 border border-primary/40 text-primary dark:text-yellow-400 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold mb-6 flex items-center gap-2'>
                        <FaCheck /> <span>{msg}</span>
                    </div>
                )}

                {/* Tab 1: Products */}
                {activeTab === 'products' && (
                    <div className='bg-white dark:bg-brand-card rounded-3xl shadow-card border border-slate-200/80 dark:border-brand-border overflow-hidden'>
                        <div className='p-6 border-b border-slate-100 dark:border-brand-border flex justify-between items-center'>
                            <div>
                                <h2 className='font-bold text-base text-slate-900 dark:text-white'>Product Inventory</h2>
                                <p className='text-xs text-slate-500 dark:text-slate-400'>Showing all live apparel styles in database</p>
                            </div>
                            <button
                                onClick={() => setShowAddProductModal(true)}
                                className='bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white text-xs font-bold px-5 py-2.5 rounded-full flex items-center gap-2 shadow-sm transition-transform hover:scale-[1.02]'
                            >
                                <FaPlus className='text-[10px]' /> <span>Add New Product</span>
                            </button>
                        </div>

                        {isProductsLoading ? (
                            <div className='py-20 text-center'>
                                <div className='w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto'></div>
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <table className='w-full text-left text-sm'>
                                    <thead className='bg-slate-50 dark:bg-brand-dark/50 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-brand-border'>
                                        <tr>
                                            <th className='py-3.5 px-6'>Piece / Style</th>
                                            <th className='py-3.5 px-6'>Category</th>
                                            <th className='py-3.5 px-6'>Price</th>
                                            <th className='py-3.5 px-6'>Stock Status</th>
                                            <th className='py-3.5 px-6 text-right'>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-slate-100 dark:divide-brand-border'>
                                        {products.map((p) => (
                                            <tr key={p.id} className='hover:bg-slate-50/70 dark:hover:bg-brand-dark/30 transition-colors'>
                                                <td className='py-4 px-6 flex items-center gap-3'>
                                                    <img
                                                        src={(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600'}
                                                        alt=""
                                                        className='w-12 h-14 object-cover rounded-xl border border-slate-200 dark:border-brand-border'
                                                    />
                                                    <div>
                                                        <span className='font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[240px]'>
                                                            {p.name}
                                                        </span>
                                                        <span className='text-[11px] text-slate-400'>
                                                            {p.colors?.length || 0} colors &bull; {p.sizes?.length || 0} sizes
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className='py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400'>
                                                    {p.category?.name || 'General'}
                                                </td>
                                                <td className='py-4 px-6 font-bold text-xs text-slate-900 dark:text-white'>
                                                    ${Number(p.discountPrice || p.price).toFixed(2)}
                                                    {p.discountPrice && (
                                                        <span className='text-[10px] text-slate-400 line-through block font-normal'>
                                                            ${Number(p.price).toFixed(2)}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className='py-4 px-6 text-xs'>
                                                    <span className={`px-2.5 py-1 rounded-full font-bold text-[11px] ${
                                                        p.stock > 10
                                                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                                                            : p.stock > 0
                                                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                                                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                                                    }`}>
                                                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of Stock'}
                                                    </span>
                                                </td>
                                                <td className='py-4 px-6 text-right'>
                                                    <button
                                                        onClick={() => deleteProductApi(p.id)}
                                                        className='text-slate-400 hover:text-rose-500 transition-colors p-2'
                                                        title="Delete Product"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab 2: Orders */}
                {activeTab === 'orders' && (
                    <div className='bg-white dark:bg-brand-card rounded-3xl shadow-card border border-slate-200/80 dark:border-brand-border overflow-hidden'>
                        <div className='p-6 border-b border-slate-100 dark:border-brand-border'>
                            <h2 className='font-bold text-base text-slate-900 dark:text-white'>Customer Orders</h2>
                            <p className='text-xs text-slate-500 dark:text-slate-400'>Monitor order processing and update shipment progress</p>
                        </div>

                        {isOrdersLoading ? (
                            <div className='py-20 text-center'>
                                <div className='w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto'></div>
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <table className='w-full text-left text-sm'>
                                    <thead className='bg-slate-50 dark:bg-brand-dark/50 text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-brand-border'>
                                        <tr>
                                            <th className='py-3.5 px-6'>Order #</th>
                                            <th className='py-3.5 px-6'>Customer</th>
                                            <th className='py-3.5 px-6'>Placed Date</th>
                                            <th className='py-3.5 px-6'>Total</th>
                                            <th className='py-3.5 px-6'>Status Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className='divide-y divide-slate-100 dark:divide-brand-border'>
                                        {orders.map((o) => (
                                            <tr key={o.id} className='hover:bg-slate-50/70 dark:hover:bg-brand-dark/30 transition-colors'>
                                                <td className='py-4 px-6 font-bold text-xs text-slate-900 dark:text-white'>
                                                    #{o.orderNumber}
                                                </td>
                                                <td className='py-4 px-6 text-xs text-slate-800 dark:text-slate-200'>
                                                    <span className='font-bold block'>{o.user?.name || 'Customer'}</span>
                                                    <span className='text-[11px] text-slate-400'>{o.user?.email}</span>
                                                </td>
                                                <td className='py-4 px-6 text-xs text-slate-500 dark:text-slate-400'>
                                                    {new Date(o.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </td>
                                                <td className='py-4 px-6 font-black text-xs text-slate-900 dark:text-primary'>
                                                    ${Number(o.totalPrice).toFixed(2)}
                                                </td>
                                                <td className='py-4 px-6'>
                                                    <select
                                                        value={o.status}
                                                        onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                                                        className='text-xs font-semibold rounded-xl px-3 py-1.5 border border-slate-200 dark:border-brand-border bg-slate-50 dark:bg-brand-dark dark:text-white focus:outline-none focus:border-primary'
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="processing">Processing</option>
                                                        <option value="shipped">Shipped</option>
                                                        <option value="delivered">Delivered</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Modal for adding product with Cloudinary image upload */}
            {showAddProductModal && (
                <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-xs'>
                    <div className='bg-white dark:bg-brand-card rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200/80 dark:border-brand-border'>
                        <div className='flex items-center justify-between border-b border-slate-100 dark:border-brand-border pb-4'>
                            <div>
                                <h3 className='text-lg font-black text-slate-900 dark:text-white'>Add New Fashion Piece</h3>
                                <p className='text-xs text-slate-500'>Upload images to Cloudinary and define catalog metadata</p>
                            </div>
                            <button
                                onClick={() => setShowAddProductModal(false)}
                                className='text-slate-400 hover:text-slate-700 dark:hover:text-white p-1'
                            >
                                <FaXmark className='text-lg' />
                            </button>
                        </div>

                        <form onSubmit={handleCreateProduct} className='space-y-4 text-xs sm:text-sm'>
                            <div>
                                <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Classic Cotton T-Shirt"
                                    value={newProduct.name}
                                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-brand-dark dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                />
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                        Category
                                    </label>
                                    <select
                                        value={newProduct.categoryId || (categories[0]?.id || '')}
                                        onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                                        className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-3 py-2.5 bg-slate-50 dark:bg-brand-dark dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                    >
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                        Initial Stock
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="50"
                                        value={newProduct.stock}
                                        onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-brand-dark dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                        Regular Price ($)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="49.99"
                                        value={newProduct.price}
                                        onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-brand-dark dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                        Sale Price ($ optional)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        placeholder="39.99"
                                        value={newProduct.discountPrice}
                                        onChange={(e) => setNewProduct({ ...newProduct, discountPrice: e.target.value })}
                                        className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-brand-dark dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                    />
                                </div>
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                    Product Images (Direct Cloudinary Upload)
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => setSelectedImages(e.target.files)}
                                    className='w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-secondary hover:file:bg-primary/30'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                    Description
                                </label>
                                <textarea
                                    rows="3"
                                    placeholder="Fabric composition, cut, care instructions..."
                                    value={newProduct.description}
                                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    className='w-full border border-slate-200 dark:border-brand-border rounded-xl p-3 bg-slate-50 dark:bg-brand-dark dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                />
                            </div>

                            <div className='flex gap-4 pt-1 text-xs'>
                                <label className='flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium'>
                                    <input
                                        type="checkbox"
                                        checked={newProduct.isFeatured}
                                        onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                                    />
                                    Featured
                                </label>
                                <label className='flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium'>
                                    <input
                                        type="checkbox"
                                        checked={newProduct.isTrending}
                                        onChange={(e) => setNewProduct({ ...newProduct, isTrending: e.target.checked })}
                                    />
                                    Trending
                                </label>
                                <label className='flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium'>
                                    <input
                                        type="checkbox"
                                        checked={newProduct.isTopRated}
                                        onChange={(e) => setNewProduct({ ...newProduct, isTopRated: e.target.checked })}
                                    />
                                    Top Rated
                                </label>
                            </div>

                            <div className='flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-brand-border'>
                                <button
                                    type="button"
                                    onClick={() => setShowAddProductModal(false)}
                                    className='px-5 py-2.5 border border-slate-200 dark:border-brand-border rounded-full text-xs font-bold text-slate-700 dark:text-slate-300'
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isCreatingProduct}
                                    className='px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-xs font-bold hover:opacity-95 shadow-xs disabled:opacity-50'
                                >
                                    {isCreatingProduct ? 'Uploading...' : 'Save Fashion Piece'}
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

export default AdminDashboard;
