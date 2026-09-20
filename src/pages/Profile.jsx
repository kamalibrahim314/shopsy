import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaUser, FaMapPin, FaLock, FaPlus, FaTrash, FaCheck } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import {
    useGetProfileQuery,
    useUpdateProfileMutation,
    useGetAddressesQuery,
    useCreateAddressMutation,
    useDeleteAddressMutation,
    useSetDefaultAddressMutation,
} from '../redux/features/users/usersApiSlice';
import { useUpdatePasswordMutation } from '../redux/features/auth/authApiSlice';

const Profile = () => {
    const { user: authUser } = useSelector((state) => state.auth);

    const { data: profileData, isLoading } = useGetProfileQuery();
    const { data: addressesData } = useGetAddressesQuery();
    const [updateProfileApi, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
    const [createAddressApi, { isLoading: isAddingAddress }] = useCreateAddressMutation();
    const [deleteAddressApi] = useDeleteAddressMutation();
    const [setDefaultAddressApi] = useSetDefaultAddressMutation();
    const [updatePasswordApi, { isLoading: isUpdatingPassword }] = useUpdatePasswordMutation();

    const user = profileData?.user || authUser;
    const addresses = addressesData?.addresses || [];

    const [activeTab, setActiveTab] = useState('profile');
    const [statusMsg, setStatusMsg] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);

    // Profile form
    const [name, setName] = useState(user?.name || '');
    const [phone, setPhone] = useState(user?.phone || '');

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Address form
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'Egypt',
        isDefault: false,
    });

    React.useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPhone(user.phone || '');
        }
    }, [user]);

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setStatusMsg(null);
        try {
            await updateProfileApi({ name, phone }).unwrap();
            setStatusMsg('Profile updated successfully!');
            setTimeout(() => setStatusMsg(null), 3000);
        } catch (err) {
            setErrorMsg(err?.data?.message || 'Failed to update profile');
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        setStatusMsg(null);
        if (newPassword !== confirmPassword) {
            setErrorMsg('New passwords do not match');
            return;
        }
        try {
            await updatePasswordApi({ currentPassword, newPassword }).unwrap();
            setStatusMsg('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setStatusMsg(null), 3000);
        } catch (err) {
            setErrorMsg(err?.data?.message || 'Failed to update password');
        }
    };

    const handleAddAddress = async (e) => {
        e.preventDefault();
        setErrorMsg(null);
        try {
            await createAddressApi(newAddress).unwrap();
            setShowAddressForm(false);
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
            setStatusMsg('Address added successfully!');
            setTimeout(() => setStatusMsg(null), 3000);
        } catch (err) {
            setErrorMsg(err?.data?.message || 'Failed to add address');
        }
    };

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
                    <span className='text-xs font-bold uppercase tracking-widest text-primary'>User Center</span>
                    <h1 className='text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-1'>
                        Account Settings
                    </h1>
                    <p className='text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1'>
                        Manage your profile identity, saved delivery addresses, and login credentials
                    </p>
                </div>

                {statusMsg && (
                    <div className='bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold mb-6'>
                        {statusMsg}
                    </div>
                )}
                {errorMsg && (
                    <div className='bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 px-5 py-3 rounded-2xl text-xs sm:text-sm font-semibold mb-6'>
                        {errorMsg}
                    </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-4 gap-8 items-start'>
                    {/* Navigation Tabs */}
                    <div className='col-span-1 bg-white dark:bg-brand-card p-3 rounded-2xl border border-slate-200/80 dark:border-brand-border shadow-card space-y-1'>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                activeTab === 'profile'
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xs'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <FaUser /> <span>Profile Details</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('addresses')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                activeTab === 'addresses'
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xs'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <FaMapPin /> <span>Address Book ({addresses.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('password')}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                activeTab === 'password'
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-xs'
                                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                            }`}
                        >
                            <FaLock /> <span>Security & Password</span>
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className='col-span-1 md:col-span-3'>
                        {/* Tab 1: Profile Details */}
                        {activeTab === 'profile' && (
                            <div className='bg-white dark:bg-brand-card p-6 sm:p-8 rounded-2xl shadow-card border border-slate-200/80 dark:border-brand-border'>
                                <h2 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6'>
                                    Profile Information
                                </h2>
                                <form onSubmit={handleProfileSubmit} className='space-y-4 max-w-lg'>
                                    <div>
                                        <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-brand-dark dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                            Email Address (Read-only)
                                        </label>
                                        <input
                                            type="email"
                                            disabled
                                            value={user?.email || ''}
                                            className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-slate-100 dark:bg-brand-dark/50 dark:text-slate-400 text-xs sm:text-sm cursor-not-allowed'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-brand-dark dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all'
                                        />
                                    </div>
                                    <div className='pt-2'>
                                        <button
                                            type="submit"
                                            disabled={isUpdatingProfile}
                                            className='bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold px-7 py-3 rounded-full text-xs sm:text-sm shadow-md transition-all duration-200 disabled:opacity-50 hover:scale-[1.01]'
                                        >
                                            {isUpdatingProfile ? 'Saving...' : 'Save Profile Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Tab 2: Address Book */}
                        {activeTab === 'addresses' && (
                            <div className='bg-white dark:bg-brand-card p-6 sm:p-8 rounded-2xl shadow-card border border-slate-200/80 dark:border-brand-border'>
                                <div className='flex justify-between items-center mb-6'>
                                    <h2 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white'>
                                        Shipping Addresses
                                    </h2>
                                    <button
                                        onClick={() => setShowAddressForm(!showAddressForm)}
                                        className='bg-primary text-slate-950 hover:bg-secondary hover:text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-xs transition-colors'
                                    >
                                        <FaPlus className='text-[10px]' /> {showAddressForm ? 'Cancel' : 'Add New Address'}
                                    </button>
                                </div>

                                {showAddressForm && (
                                    <form onSubmit={handleAddAddress} className='bg-slate-50 dark:bg-brand-dark p-6 rounded-2xl border border-slate-200/80 dark:border-brand-border mb-6 space-y-3.5 text-xs sm:text-sm'>
                                        <h3 className='font-bold text-sm text-slate-900 dark:text-white mb-2'>Enter New Address</h3>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Recipient Full Name"
                                            value={newAddress.fullName}
                                            onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                                            className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-white dark:bg-brand-card dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                        />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Phone Number"
                                            value={newAddress.phone}
                                            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                                            className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-white dark:bg-brand-card dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                        />
                                        <input
                                            type="text"
                                            required
                                            placeholder="Street Address, Building, Apt"
                                            value={newAddress.street}
                                            onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                            className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-white dark:bg-brand-card dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                        />
                                        <div className='grid grid-cols-2 gap-3'>
                                            <input
                                                type="text"
                                                required
                                                placeholder="City"
                                                value={newAddress.city}
                                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                className='border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-white dark:bg-brand-card dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                            />
                                            <input
                                                type="text"
                                                required
                                                placeholder="State / Governorate"
                                                value={newAddress.state}
                                                onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                className='border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-white dark:bg-brand-card dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                            />
                                        </div>
                                        <div className='grid grid-cols-2 gap-3'>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Postal Code"
                                                value={newAddress.postalCode}
                                                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                                className='border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-white dark:bg-brand-card dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                            />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Country"
                                                value={newAddress.country}
                                                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                                className='border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-white dark:bg-brand-card dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none'
                                            />
                                        </div>
                                        <div className='pt-2 flex justify-end gap-3'>
                                            <button
                                                type="button"
                                                onClick={() => setShowAddressForm(false)}
                                                className='px-5 py-2.5 border border-slate-200 dark:border-brand-border rounded-full text-xs font-bold text-slate-700 dark:text-slate-300'
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isAddingAddress}
                                                className='px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full text-xs font-bold shadow-xs'
                                            >
                                                {isAddingAddress ? 'Saving...' : 'Save Address'}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {addresses.length === 0 ? (
                                    <p className='text-xs sm:text-sm text-slate-500 py-6 text-center'>
                                        No saved addresses yet. Add your preferred delivery location.
                                    </p>
                                ) : (
                                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                                        {addresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                className='p-5 rounded-2xl border border-slate-200/80 dark:border-brand-border relative flex flex-col justify-between space-y-3 bg-slate-50/50 dark:bg-brand-dark/40'
                                            >
                                                <div>
                                                    <div className='flex items-center justify-between'>
                                                        <span className='font-bold text-sm text-slate-900 dark:text-white'>
                                                            {addr.fullName}
                                                        </span>
                                                        {addr.isDefault && (
                                                            <span className='bg-primary/20 text-amber-600 dark:text-primary text-[10px] font-bold px-2 py-0.5 rounded-full'>
                                                                Default
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-1'>{addr.street}</p>
                                                    <p className='text-xs text-slate-500 dark:text-slate-400'>{addr.city}, {addr.state} {addr.postalCode}</p>
                                                    <p className='text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5'>Phone: {addr.phone}</p>
                                                </div>

                                                <div className='flex items-center justify-between pt-3 border-t border-slate-200 dark:border-brand-border text-xs'>
                                                    {!addr.isDefault ? (
                                                        <button
                                                            onClick={() => setDefaultAddressApi(addr.id)}
                                                            className='text-primary hover:underline font-bold'
                                                        >
                                                            Set as Default
                                                        </button>
                                                    ) : (
                                                        <span className='text-emerald-500 flex items-center gap-1 font-bold'>
                                                            <FaCheck /> Active Default
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => deleteAddressApi(addr.id)}
                                                        className='text-slate-400 hover:text-rose-500 transition-colors p-1'
                                                        title="Delete Address"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tab 3: Security & Password */}
                        {activeTab === 'password' && (
                            <div className='bg-white dark:bg-brand-card p-6 sm:p-8 rounded-2xl shadow-card border border-slate-200/80 dark:border-brand-border'>
                                <h2 className='text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-6'>
                                    Change Password
                                </h2>
                                <form onSubmit={handlePasswordSubmit} className='space-y-4 max-w-lg'>
                                    <div>
                                        <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                            Current Password
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-brand-dark dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                            New Password
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-brand-dark dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all'
                                        />
                                    </div>
                                    <div>
                                        <label className='block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5'>
                                            Confirm New Password
                                        </label>
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className='w-full border border-slate-200 dark:border-brand-border rounded-xl px-4 py-2.5 bg-slate-50 dark:bg-brand-dark dark:text-white text-xs sm:text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all'
                                        />
                                    </div>
                                    <div className='pt-2'>
                                        <button
                                            type="submit"
                                            disabled={isUpdatingPassword}
                                            className='bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold px-7 py-3 rounded-full text-xs sm:text-sm shadow-md transition-all duration-200 disabled:opacity-50 hover:scale-[1.01]'
                                        >
                                            {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;
