import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        About QuickPark
                    </h1>
                    <p className="text-slate-600 text-lg max-w-3xl mx-auto">
                        Your trusted partner in smart parking solutions, making parking easier and more convenient
                    </p>
                </div>

                {/* Mission & Vision Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-slate-200">
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-slate-800 rounded-lg mr-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-800">Our Mission</h2>
                        </div>
                        <p className="text-slate-600 text-lg leading-relaxed mb-4">
                            At QuickPark, we're committed to revolutionizing the parking experience by providing smart,
                            efficient, and user-friendly parking solutions. Our goal is to eliminate the stress and
                            hassle of finding parking spaces in busy urban areas.
                        </p>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            We leverage cutting-edge technology to offer real-time parking availability, seamless
                            booking, and secure payment options, ensuring a smooth experience for all our users.
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-xl p-8 text-white">
                        <div className="flex items-center mb-6">
                            <div className="p-3 bg-white/10 rounded-lg mr-4 backdrop-blur-sm">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold">Our Vision</h2>
                        </div>
                        <p className="text-slate-200 text-lg leading-relaxed mb-4">
                            To become the leading smart parking solution provider globally, transforming urban mobility
                            and making cities more accessible and efficient.
                        </p>
                        <p className="text-slate-200 text-lg leading-relaxed">
                            We envision a future where finding parking is effortless, sustainable, and integrated
                            seamlessly with smart city infrastructure.
                        </p>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">Why Choose QuickPark?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<TechIcon />}
                            title="Advanced Technology"
                            description="State-of-the-art parking management system with IoT sensors and real-time tracking."
                        />
                        <FeatureCard
                            icon={<SecurityIcon />}
                            title="24/7 Security"
                            description="Round-the-clock surveillance and advanced security systems for complete peace of mind."
                        />
                        <FeatureCard
                            icon={<SupportIcon />}
                            title="Customer Support"
                            description="Dedicated support team available 24/7 to assist you with any queries or concerns."
                        />
                        <FeatureCard
                            icon={<EcoIcon />}
                            title="Eco-Friendly"
                            description="Reducing carbon footprint by minimizing time spent searching for parking spots."
                        />
                        <FeatureCard
                            icon={<PaymentIcon />}
                            title="Flexible Payment"
                            description="Multiple payment options including cards, digital wallets, and subscriptions."
                        />
                        <FeatureCard
                            icon={<AppIcon />}
                            title="Mobile App"
                            description="Easy-to-use mobile application for booking and managing your parking on the go."
                        />
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-2xl shadow-xl p-12 text-white mb-10">
                    <h2 className="text-3xl font-bold mb-8 text-center">QuickPark by Numbers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <StatCard value="1000+" label="Parking Spots" />
                        <StatCard value="50K+" label="Happy Customers" />
                        <StatCard value="100+" label="Cities" />
                        <StatCard value="24/7" label="Support" />
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center border-2 border-slate-200">
                    <div className="max-w-2xl mx-auto">
                        <div className="inline-flex p-4 bg-slate-100 rounded-full mb-6">
                            <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-4">Get in Touch</h2>
                        <p className="text-slate-600 text-lg mb-6">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                        <button className="px-8 py-4 bg-slate-800 text-white font-bold text-lg rounded-lg hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-slate-200 hover:border-slate-400">
        <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-100 rounded-lg">
                {icon}
            </div>
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-3 text-center">{title}</h3>
        <p className="text-slate-600 text-center text-sm leading-relaxed">{description}</p>
    </div>
);

const StatCard = ({ value, label }) => (
    <div className="text-center p-6 bg-white/10 rounded-xl backdrop-blur-sm hover:bg-white/20 transition-all">
        <div className="text-4xl md:text-5xl font-bold mb-2">{value}</div>
        <div className="text-slate-200 text-sm md:text-base font-medium">{label}</div>
    </div>
);

// Icon Components
const TechIcon = () => (
    <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const SecurityIcon = () => (
    <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const SupportIcon = () => (
    <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const EcoIcon = () => (
    <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PaymentIcon = () => (
    <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const AppIcon = () => (
    <svg className="w-12 h-12 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

export default About;
