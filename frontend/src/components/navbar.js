import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleNavigation = (path) => {
        navigate(path);
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center cursor-pointer" onClick={() => handleNavigation('/')}>
                        <img
                            src="/images/quickpark_logo.png"
                            alt="QuickPark Logo"
                            className="h-10 w-auto mr-3"
                        />
                        <span className="text-white text-3xl font-bold hidden sm:block">QuickPark</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => handleNavigation('/park')}
                            className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-xl font-medium transition duration-200"
                        >
                            Park
                        </button>
                        <button
                            onClick={() => handleNavigation('/unpark')}
                            className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-xl font-medium transition duration-200"
                        >
                            Unpark
                        </button>
                        <button
                            onClick={() => handleNavigation('/status')}
                            className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-xl font-medium transition duration-200"
                        >
                            Status
                        </button>
                        <button
                            onClick={() => handleNavigation('/about')}
                            className="text-white hover:text-blue-200 px-3 py-2 rounded-md text-xl font-medium transition duration-200"
                        >
                            About
                        </button>

                        {/* Profile Icon */}
                        <button
                            onClick={() => handleNavigation('/profile')}
                            className="text-white hover:text-blue-200 transition duration-200"
                        >
                            <svg
                                className="h-8 w-8"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile Hamburger Button */}
                    <div className="md:hidden">
                        <button
                            onClick={toggleMenu}
                            className="text-white hover:text-blue-200 focus:outline-none focus:text-blue-200"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {isMenuOpen ? (
                                    <path d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-blue-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <button
                            onClick={() => handleNavigation('/park')}
                            className="text-white hover:bg-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition duration-200"
                        >
                            Park
                        </button>
                        <button
                            onClick={() => handleNavigation('/unpark')}
                            className="text-white hover:bg-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition duration-200"
                        >
                            Unpark
                        </button>
                        <button
                            onClick={() => handleNavigation('/status')}
                            className="text-white hover:bg-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition duration-200"
                        >
                            Status
                        </button>
                        <button
                            onClick={() => handleNavigation('/about')}
                            className="text-white hover:bg-blue-600 block w-full text-left px-3 py-2 rounded-md text-base font-medium transition duration-200"
                        >
                            About
                        </button>
                        <button
                            onClick={() => handleNavigation('/profile')}
                            className="text-white hover:bg-blue-600 flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium transition duration-200"
                        >
                            <svg
                                className="h-6 w-6 mr-2"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Profile
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
