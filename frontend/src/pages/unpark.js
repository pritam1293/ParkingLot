import React, { useState } from 'react';

const Unpark = () => {
    const [ticketNumber, setTicketNumber] = useState('');
    const [vehicleInfo, setVehicleInfo] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        // Mock data - replace with API call
        setVehicleInfo({
            ticketNumber: ticketNumber,
            vehicleNumber: 'ABC-1234',
            vehicleType: 'Compact Car',
            ownerName: 'John Doe',
            phoneNumber: '+1 (234) 567-8900',
            entryTime: '10:30 AM',
            currentTime: '1:00 PM',
            duration: '2 hours 30 minutes',
            parkingFee: 12.50,
            tax: 1.25,
            spotNumber: 'A-23',
            floor: 'Level 2'
        });
    };

    const handleUnpark = () => {
        alert('Vehicle unparked successfully! Thank you for using QuickPark.');
        setVehicleInfo(null);
        setTicketNumber('');
    };

    const total = vehicleInfo ? vehicleInfo.parkingFee + vehicleInfo.tax : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        Unpark Your Vehicle
                    </h1>
                    <p className="text-slate-600 text-lg">Enter your ticket number to retrieve your vehicle</p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-slate-700 font-semibold mb-2">
                                    Ticket Number *
                                </label>
                                <input
                                    type="text"
                                    value={ticketNumber}
                                    onChange={(e) => setTicketNumber(e.target.value)}
                                    placeholder="Enter your ticket number"
                                    required
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-slate-600 focus:outline-none transition-colors bg-slate-50"
                                />
                            </div>
                            <div className="sm:pt-8">
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto px-8 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Helper Text */}
                    <div className="mt-6 p-4 bg-slate-100 rounded-lg max-w-2xl mx-auto">
                        <div className="flex items-start">
                            <svg className="w-5 h-5 text-slate-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-slate-600">
                                Your ticket number can be found on the parking receipt you received when parking your vehicle.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Vehicle Info Card */}
                {vehicleInfo && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Vehicle Found!</h2>
                                    <p className="text-slate-300">Ticket #{vehicleInfo.ticketNumber}</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Vehicle Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <DetailCard icon={<CarNumberIcon />} label="Vehicle Number" value={vehicleInfo.vehicleNumber} />
                                <DetailCard icon={<VehicleTypeIcon />} label="Vehicle Type" value={vehicleInfo.vehicleType} />
                                <DetailCard icon={<PersonIcon />} label="Owner Name" value={vehicleInfo.ownerName} />
                                <DetailCard icon={<PhoneIcon />} label="Phone Number" value={vehicleInfo.phoneNumber} />
                                <DetailCard icon={<LocationIcon />} label="Parking Spot" value={`${vehicleInfo.spotNumber} - ${vehicleInfo.floor}`} />
                                <DetailCard icon={<ClockIcon />} label="Entry Time" value={vehicleInfo.entryTime} />
                            </div>

                            {/* Parking Duration */}
                            <div className="mb-8 p-6 bg-slate-100 rounded-xl border-2 border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-600 text-sm mb-1">Parking Duration</p>
                                        <p className="text-2xl font-bold text-slate-800">{vehicleInfo.duration}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-600 text-sm mb-1">Current Time</p>
                                        <p className="text-lg font-semibold text-slate-700">{vehicleInfo.currentTime}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="border-t-2 border-slate-200 pt-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Payment Summary
                                </h3>
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 mb-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center pb-3 border-b border-slate-300">
                                            <span className="text-slate-700 font-medium">Parking Fee</span>
                                            <span className="text-lg font-semibold text-slate-800">${vehicleInfo.parkingFee.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-slate-300">
                                            <span className="text-slate-700 font-medium">Service Tax (10%)</span>
                                            <span className="text-lg font-semibold text-slate-800">${vehicleInfo.tax.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center pt-2">
                                            <span className="text-xl font-bold text-slate-900">Total Amount</span>
                                            <span className="text-3xl font-bold text-slate-800">${total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Options */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                                    <button className="p-4 border-2 border-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-50 transition-all">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-8 h-8 text-slate-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                            <span className="text-sm font-semibold text-slate-700">Card</span>
                                        </div>
                                    </button>
                                    <button className="p-4 border-2 border-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-50 transition-all">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-8 h-8 text-slate-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-sm font-semibold text-slate-700">Mobile</span>
                                        </div>
                                    </button>
                                    <button className="p-4 border-2 border-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-50 transition-all">
                                        <div className="flex flex-col items-center">
                                            <svg className="w-8 h-8 text-slate-700 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="text-sm font-semibold text-slate-700">Cash</span>
                                        </div>
                                    </button>
                                </div>

                                <button
                                    onClick={handleUnpark}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Complete Payment & Exit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DetailCard = ({ icon, label, value }) => (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors">
        <div className="flex items-center mb-2">
            <div className="text-slate-600 mr-2">
                {icon}
            </div>
            <p className="text-sm text-slate-600 font-medium">{label}</p>
        </div>
        <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
);

// Icon Components
const CarNumberIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
);

const VehicleTypeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
);

const PersonIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const LocationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export default Unpark;
