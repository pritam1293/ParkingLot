import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                        About QuickPark
                    </h1>
                    <p className="text-gray-600 text-lg max-w-3xl mx-auto">
                        Your trusted partner in smart parking solutions, making parking easier and more convenient
                    </p>
                </div>

                {/* Mission Section */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-10">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-4">
                        At QuickPark, we're committed to revolutionizing the parking experience by providing smart, 
                        efficient, and user-friendly parking solutions. Our goal is to eliminate the stress and 
                        hassle of finding parking spaces in busy urban areas.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        We leverage cutting-edge technology to offer real-time parking availability, seamless 
                        booking, and secure payment options, ensuring a smooth experience for all our users.
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
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

                {/* Stats Section */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl shadow-2xl p-12 text-white mb-10">
                    <h2 className="text-3xl font-bold mb-8 text-center">QuickPark by Numbers</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold mb-2">1000+</div>
                            <div className="text-blue-100">Parking Spots</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50K+</div>
                            <div className="text-blue-100">Happy Customers</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">100+</div>
                            <div className="text-blue-100">Cities</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">24/7</div>
                            <div className="text-blue-100">Support</div>
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Get in Touch</h2>
                    <p className="text-gray-600 text-lg mb-6">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                    <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        Contact Us
                    </button>
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
        <div className="flex justify-center mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 text-center">{title}</h3>
        <p className="text-gray-600 text-center text-sm leading-relaxed">{description}</p>
    </div>
);

// Icon Components
const TechIcon = () => (
    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const SecurityIcon = () => (
    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const SupportIcon = () => (
    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const EcoIcon = () => (
    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const PaymentIcon = () => (
    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
);

const AppIcon = () => (
    <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

export default About;
