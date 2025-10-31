import React, { useState } from 'react';

const Park = () => {
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        vehicleType: 'compact',
        ownerName: '',
        phoneNumber: '',
        email: ''
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                        Park Your Vehicle
                    </h1>
                    <p className="text-gray-600 text-lg">Fill in the details to reserve your parking spot</p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Vehicle Number */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Vehicle Number *
                            </label>
                            <input
                                type="text"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleChange}
                                placeholder="e.g., ABC-1234"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Vehicle Type */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Vehicle Type *
                            </label>
                            <select
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                            >
                                <option value="compact">Compact</option>
                                <option value="large">Large</option>
                                <option value="mini">Mini</option>
                            </select>
                        </div>

                        {/* Owner Name */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Owner Name *
                            </label>
                            <input
                                type="text"
                                name="ownerName"
                                value={formData.ownerName}
                                onChange={handleChange}
                                placeholder="Enter your name"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+1 (234) 567-8900"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="your.email@example.com"
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Park Vehicle
                        </button>
                    </form>

                    {/* Info Box */}
                    <div className="mt-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-600">
                        <h3 className="font-semibold text-blue-900 mb-2">Important Information</h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Please ensure your vehicle number is correct</li>
                            <li>• Keep your parking ticket safe for exit</li>
                            <li>• Parking rates apply based on duration</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Park;
