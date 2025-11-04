import React, { useState } from 'react';

const Park = () => {
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        vehicleType: 'compact'
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Park Vehicle:', formData);
        // Add API call here
        alert('Vehicle parked successfully!');
    };

    const vehicleTypes = [
        {
            value: 'compact',
            label: 'Compact Car',
            icon: <CompactCarIcon />,
            description: 'Sedans, Hatchbacks',
            rate: '$5/hour'
        },
        {
            value: 'large',
            label: 'Large Vehicle',
            icon: <SUVIcon />,
            description: 'SUVs, Vans',
            rate: '$8/hour'
        },
        {
            value: 'mini',
            label: 'Two Wheeler',
            icon: <BikeIcon />,
            description: 'Motorcycles, Scooters',
            rate: '$2/hour'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        Park Your Vehicle
                    </h1>
                    <p className="text-slate-600 text-lg">Fill in the details to reserve your parking spot</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Vehicle Type Selection */}
                                <div>
                                    <label className="block text-slate-800 font-semibold mb-4 text-lg">
                                        Select Vehicle Type *
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {vehicleTypes.map((type) => (
                                            <label
                                                key={type.value}
                                                className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-300 ${formData.vehicleType === type.value
                                                    ? 'border-slate-600 bg-slate-50 shadow-md'
                                                    : 'border-slate-200 hover:border-slate-400'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="vehicleType"
                                                    value={type.value}
                                                    checked={formData.vehicleType === type.value}
                                                    onChange={handleChange}
                                                    className="sr-only"
                                                />
                                                <div className="flex flex-col items-center text-center">
                                                    <div className={`mb-3 ${formData.vehicleType === type.value ? 'text-slate-700' : 'text-slate-400'}`}>
                                                        {type.icon}
                                                    </div>
                                                    <h3 className="font-bold text-slate-800 mb-1">{type.label}</h3>
                                                    <p className="text-sm text-slate-600 mb-2">{type.description}</p>
                                                    <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                                                        {type.rate}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Vehicle Number */}
                                <div>
                                    <label className="block text-slate-700 font-semibold mb-2">
                                        Vehicle Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="vehicleNumber"
                                        value={formData.vehicleNumber}
                                        onChange={handleChange}
                                        placeholder="e.g., OD01A1234"
                                        required
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-slate-600 focus:outline-none transition-colors bg-slate-50"
                                    />
                                    <p className="text-sm text-slate-500 mt-2">
                                        Enter your vehicle registration number
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="w-full py-4 bg-slate-800 text-white font-bold text-lg rounded-lg hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Park Vehicle Now
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Side - Info Cards */}
                    <div className="space-y-6">
                        {/* Info Box */}
                        <div className="bg-slate-800 text-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center mb-4">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="font-bold text-lg">Important Information</h3>
                            </div>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>Ensure vehicle number is correct</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>Keep your parking ticket safe</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>Rates vary by vehicle type</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>24/7 security surveillance</span>
                                </li>
                            </ul>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-200">
                            <h3 className="font-bold text-lg text-slate-800 mb-4">Parking Rates</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                    <span className="text-slate-600">Compact Cars</span>
                                    <span className="font-bold text-slate-800">$5/hour</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                    <span className="text-slate-600">Large Vehicles</span>
                                    <span className="font-bold text-slate-800">$8/hour</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-slate-600">Two Wheelers</span>
                                    <span className="font-bold text-slate-800">$2/hour</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                                <p className="text-xs text-slate-600 text-center">
                                    * Daily maximum rates available
                                </p>
                            </div>
                        </div>

                        {/* Features Card */}
                        <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-2xl shadow-xl p-6">
                            <h3 className="font-bold text-lg mb-4">Why Park With Us?</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Secure & Monitored</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Easy In & Out</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Multiple Payment Options</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Vehicle Icons
const CompactCarIcon = () => (
    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
);

const SUVIcon = () => (
    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 5.01C18.72 4.42 18.16 4 17.5 4h-11c-.66 0-1.21.42-1.42 1.01L3 11v9c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-9l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 10l1.5-4.5h11L19 10H5z" />
    </svg>
);

const BikeIcon = () => (
    <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5.1 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z" />
    </svg>
);

export default Park;
