import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-6">
                            Welcome to QuickPark
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
                            Your Smart Parking Solution - Fast, Secure, and Convenient
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/park')}
                                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Park Now
                            </button>
                            <button
                                onClick={() => navigate('/status')}
                                className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Check Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose QuickPark?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<ClockIcon />}
                        title="24/7 Availability"
                        description="Park your vehicle anytime, anywhere with our round-the-clock service."
                    />
                    <FeatureCard
                        icon={<SecurityIcon />}
                        title="Secure Parking"
                        description="Advanced security systems to keep your vehicle safe and protected."
                    />
                    <FeatureCard
                        icon={<MoneyIcon />}
                        title="Affordable Rates"
                        description="Competitive pricing with flexible payment options for your convenience."
                    />
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 py-16 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
                        <StatCard number="1000+" label="Parking Spots" />
                        <StatCard number="50K+" label="Happy Customers" />
                        <StatCard number="24/7" label="Support" />
                        <StatCard number="99.9%" label="Uptime" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">{title}</h3>
        <p className="text-gray-600 text-center leading-relaxed">{description}</p>
    </div>
);

const StatCard = ({ number, label }) => (
    <div className="transform hover:scale-110 transition-transform duration-300">
        <div className="text-4xl md:text-5xl font-bold mb-2">{number}</div>
        <div className="text-lg md:text-xl opacity-90">{label}</div>
    </div>
);

// Icon Components
const ClockIcon = () => (
    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SecurityIcon = () => (
    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const MoneyIcon = () => (
    <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Home;
