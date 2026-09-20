import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from './Hero';
import Products from '../components/Products';
import TopProduct from '../components/TopProduct';
import Banner from '../components/Banner';
import Subscribe from '../components/Subscribe';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import Popup from '../components/Popup';

const Home = () => {
    const [popup, setPopup] = useState(false);
    const handlePopup = () => {
        setPopup(!popup);
    };

    return (
        <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-brand-dark text-slate-800 dark:text-slate-100 transition-colors duration-200'>
            {/* Header Navbar */}
            <Navbar handlePopup={handlePopup} />

            {/* Main Page Body (pushes footer down cleanly) */}
            <main className='flex-1'>
                {/* Hero Section */}
                <Hero handlePopup={handlePopup} />

                {/* Section 1: New Season Arrivals */}
                <Products
                    title="New Season Arrivals"
                    subtitle="Fresh Off The Atelier"
                    limit={5}
                    sort="newest"
                />

                {/* Section 2: Best Selling Highlights */}
                <TopProduct handlePopup={handlePopup} />

                {/* Section 3: Seasonal Banner with Apparel Guarantees */}
                <Banner />

                {/* Section 4: Trending & Most Coveted */}
                <Products
                    title="Trending & Most Coveted"
                    subtitle="Customer Favorites"
                    limit={5}
                    sort="popular"
                />

                {/* Section 5: Verified Client Reviews */}
                <Testimonials />

                {/* Section 6: Insider Newsletter */}
                <Subscribe />
            </main>

            {/* Sticky/Bottom Footer */}
            <Footer />

            {/* Express Order Popup */}
            <Popup popup={popup} setPopup={setPopup} />
        </div>
    );
};

export default Home;