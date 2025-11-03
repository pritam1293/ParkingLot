import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 to-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                            Welcome to QuickPark
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                            Your Smart Parking Solution - Fast, Secure, and Convenient for All Vehicle Types
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/park')}
                                className="px-8 py-4 bg-slate-600 text-white rounded-lg font-semibold text-lg hover:bg-slate-500 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Park Now
                            </button>
                            <button
                                onClick={() => navigate('/status')}
                                className="px-8 py-4 bg-white text-slate-800 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Check Status
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vehicle Types Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-4xl font-bold text-center text-slate-800 mb-4">Parking for Every Vehicle</h2>
                <p className="text-center text-slate-600 mb-12 text-lg">We accommodate all types of vehicles with specialized parking spots</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <VehicleTypeCard
                        icon={<CompactCarIcon />}
                        title="Compact Cars"
                        description="Perfect spots for small cars, hatchbacks, and sedans with easy access."
                        features={["Standard parking", "Easy maneuverability", "Affordable rates"]}
                    />
                    <VehicleTypeCard
                        icon={<SUVIcon />}
                        title="SUVs & Large Cars"
                        description="Spacious parking designed for SUVs, minivans, and large vehicles."
                        features={["Extra space", "Wide parking spots", "Premium security"]}
                    />
                    <VehicleTypeCard
                        icon={<BikeIcon />}
                        title="Motorcycles & Bikes"
                        description="Dedicated two-wheeler parking with enhanced security measures."
                        features={["Secure zones", "Quick access", "Special rates"]}
                    />
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-slate-200 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">Why Choose QuickPark?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <FeatureCard
                            icon={<ClockIcon />}
                            title="24/7 Availability"
                            description="Park your vehicle anytime with our round-the-clock service."
                        />
                        <FeatureCard
                            icon={<SecurityIcon />}
                            title="Secure Parking"
                            description="CCTV surveillance and advanced security systems protect your vehicle."
                        />
                        <FeatureCard
                            icon={<MoneyIcon />}
                            title="Affordable Rates"
                            description="Competitive pricing with flexible payment options."
                        />
                        <FeatureCard
                            icon={<RealTimeIcon />}
                            title="Real-time Status"
                            description="Check parking availability instantly before you arrive."
                        />
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StepCard
                        number="1"
                        title="Select Vehicle Type"
                        description="Choose from compact, large, or two-wheeler parking based on your vehicle."
                    />
                    <StepCard
                        number="2"
                        title="Park & Get Ticket"
                        description="Park your vehicle and receive a digital ticket with all details."
                    />
                    <StepCard
                        number="3"
                        title="Pay & Exit"
                        description="When leaving, simply pay based on duration and exit smoothly."
                    />
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                        <StatCard number="1000+" label="Parking Spots" />
                        <StatCard number="50K+" label="Happy Customers" />
                        <StatCard number="24/7" label="Support" />
                        <StatCard number="99.9%" label="Uptime" />
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h2 className="text-4xl font-bold text-slate-800 mb-6">Ready to Park?</h2>
                <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
                    Experience hassle-free parking with QuickPark. Join thousands of satisfied customers today!
                </p>
                <button
                    onClick={() => navigate('/park')}
                    className="px-10 py-4 bg-slate-800 text-white rounded-lg font-semibold text-lg hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                    Get Started Now
                </button>
            </div>
        </div>
    );
};

const VehicleTypeCard = ({ icon, title, description, features }) => (
    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-200">
        <div className="flex justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-2xl font-bold text-slate-800 mb-4 text-center">{title}</h3>
        <p className="text-slate-600 text-center mb-6 leading-relaxed">{description}</p>
        <ul className="space-y-2">
            {features.map((feature, index) => (
                <li key={index} className="flex items-center text-slate-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                </li>
            ))}
        </ul>
    </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">{title}</h3>
        <p className="text-slate-600 text-center leading-relaxed">{description}</p>
    </div>
);

const StepCard = ({ number, title, description }) => (
    <div className="relative bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                {number}
            </div>
        </div>
        <div className="mt-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">{title}</h3>
            <p className="text-slate-600 text-center leading-relaxed">{description}</p>
        </div>
    </div>
);

const StatCard = ({ number, label }) => (
    <div className="transform hover:scale-110 transition-transform duration-300">
        <div className="text-4xl md:text-5xl font-bold mb-2">{number}</div>
        <div className="text-lg md:text-xl opacity-90">{label}</div>
    </div>
);

// Vehicle Type Icons
const CompactCarIcon = () => (
    <svg className="w-20 h-20 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
);

const SUVIcon = () => (
    <svg className="w-20 h-20 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v9c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-9l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z" />
    </svg>
);

const BikeIcon = () => (
    <svg className="w-20 h-20 text-slate-700" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
    </svg>
);

// Feature Icons
const ClockIcon = () => (
    <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const SecurityIcon = () => (
    <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const MoneyIcon = () => (
    <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const RealTimeIcon = () => (
    <svg className="w-16 h-16 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export default Home;
