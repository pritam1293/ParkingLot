import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Shield, Clock, MapPin, ArrowRight, Zap, Users, CreditCard } from 'lucide-react';

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
                    <div className="text-center">
                        {/* Logo/Brand */}
                        <div className="flex justify-center mb-8">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gradient-to-br from-slate-500 to-slate-600 p-4 rounded-2xl shadow-2xl">
                                    <Car className="w-12 h-12 text-white" strokeWidth={2.5} />
                                </div>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                            Welcome to
                            <span className="block bg-gradient-to-r from-slate-400 to-slate-200 bg-clip-text text-transparent mt-2">
                                QuickPark
                            </span>
                        </h1>

                        <p className="text-xl sm:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                            Your smart parking solution. Fast, secure, and hassle-free parking for all vehicle types.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                            <button
                                onClick={() => navigate('/signin')}
                                className="group px-8 py-4 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-semibold text-lg hover:from-slate-500 hover:to-slate-600 transition-all duration-300 shadow-2xl hover:shadow-slate-500/50 transform hover:scale-105 flex items-center space-x-2 min-w-[200px] justify-center"
                            >
                                <span>Sign In</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={() => navigate('/signup')}
                                className="px-8 py-4 bg-white text-slate-900 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-all duration-300 shadow-2xl hover:shadow-white/20 transform hover:scale-105 min-w-[200px]"
                            >
                                Create Account
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-20">
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">500+</div>
                                <div className="text-sm sm:text-base text-slate-400">Parking Spots</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">24/7</div>
                                <div className="text-sm sm:text-base text-slate-400">Available</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">100%</div>
                                <div className="text-sm sm:text-base text-slate-400">Secure</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="bg-slate-800/50 backdrop-blur-sm py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-center text-white mb-4">
                        Why Choose QuickPark?
                    </h2>
                    <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
                        Experience the future of parking with our advanced features designed for your convenience
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <FeatureCard
                            icon={<Clock className="w-8 h-8" />}
                            title="24/7 Access"
                            description="Park anytime with our round-the-clock service availability."
                        />
                        <FeatureCard
                            icon={<Shield className="w-8 h-8" />}
                            title="Secure Parking"
                            description="Advanced security with CCTV surveillance and monitoring."
                        />
                        <FeatureCard
                            icon={<Zap className="w-8 h-8" />}
                            title="Quick & Easy"
                            description="Park in seconds with our streamlined booking process."
                        />
                        <FeatureCard
                            icon={<MapPin className="w-8 h-8" />}
                            title="Smart Locations"
                            description="Track your vehicle location in real-time on our system."
                        />
                        <FeatureCard
                            icon={<Users className="w-8 h-8" />}
                            title="User Friendly"
                            description="Intuitive interface designed for hassle-free experience."
                        />
                        <FeatureCard
                            icon={<CreditCard className="w-8 h-8" />}
                            title="Flexible Payment"
                            description="Multiple payment options for your convenience."
                        />
                        <FeatureCard
                            icon={<Car className="w-8 h-8" />}
                            title="All Vehicle Types"
                            description="Support for mini, compact, and large vehicles."
                        />
                        <FeatureCard
                            icon={<Clock className="w-8 h-8" />}
                            title="Real-time Status"
                            description="Check parking availability and status instantly."
                        />
                    </div>
                </div>
            </div>

            {/* Call to Action Section */}
            <div className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-xl text-slate-300 mb-8">
                        Join thousands of satisfied users who trust QuickPark for their parking needs
                    </p>
                    <button
                        onClick={() => navigate('/signup')}
                        className="px-10 py-5 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-xl font-semibold text-lg hover:from-slate-500 hover:to-slate-600 transition-all duration-300 shadow-2xl hover:shadow-slate-500/50 transform hover:scale-105"
                    >
                        Create Your Account Now
                    </button>
                </div>
            </div>

        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => {
    return (
        <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl hover:shadow-slate-700/50">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-slate-300">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400 leading-relaxed">{description}</p>
        </div>
    );
};

export default Landing;
