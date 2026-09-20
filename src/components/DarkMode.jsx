import React, { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa6';

const DarkMode = () => {
    const [theme, setTheme] = useState(
        localStorage.getItem('theme') || 'light'
    );

    useEffect(() => {
        const element = document.documentElement;
        if (theme === 'dark') {
            element.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            element.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [theme]);

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle dark/light theme"
            className='relative w-9 h-9 rounded-full bg-slate-100 dark:bg-brand-card border border-slate-200 dark:border-brand-border text-slate-700 dark:text-amber-400 hover:text-primary transition-all duration-200 flex items-center justify-center text-sm shadow-xs'
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
            {theme === 'dark' ? (
                <FaSun className='text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-90' />
            ) : (
                <FaMoon className='text-slate-600 transition-transform duration-300 -rotate-12 hover:rotate-0' />
            )}
        </button>
    );
};

export default DarkMode;