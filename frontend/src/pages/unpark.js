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
            ownerName: 'John Doe',
            entryTime: '10:30 AM',
            duration: '2 hours 30 minutes',
            parkingFee: '$15.00',
            spotNumber: 'A-23'
        });
    };

    const handleUnpark = () => {
        alert('Vehicle unparked successfully!');
        setVehicleInfo(null);
        setTicketNumber('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                        Unpark Your Vehicle
                    </h1>
                    <p className="text-gray-600 text-lg">Enter your ticket number to retrieve your vehicle</p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-8">
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">
                                Ticket Number *
                            </label>
                            <input
                                type="text"
                                value={ticketNumber}
                                onChange={(e) => setTicketNumber(e.target.value)}
                                placeholder="Enter your ticket number"
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            Search Vehicle
                        </button>
                    </form>
                </div>

                {/* Vehicle Info Card */}
                {vehicleInfo && (
                    <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 animate-fadeIn">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Vehicle Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <InfoItem label="Vehicle Number" value={vehicleInfo.vehicleNumber} />
                            <InfoItem label="Owner Name" value={vehicleInfo.ownerName} />
                            <InfoItem label="Spot Number" value={vehicleInfo.spotNumber} />
                            <InfoItem label="Entry Time" value={vehicleInfo.entryTime} />
                            <InfoItem label="Duration" value={vehicleInfo.duration} />
                            <InfoItem label="Parking Fee" value={vehicleInfo.parkingFee} highlight />
                        </div>

                        {/* Payment Section */}
                        <div className="border-t-2 border-gray-200 pt-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Details</h3>
                            <div className="bg-blue-50 rounded-lg p-6 mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700">Parking Fee:</span>
                                    <span className="font-semibold text-gray-800">{vehicleInfo.parkingFee}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-700">Tax (10%):</span>
                                    <span className="font-semibold text-gray-800">$1.50</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t-2 border-blue-200">
                                    <span className="text-lg font-bold text-gray-900">Total:</span>
                                    <span className="text-2xl font-bold text-blue-600">$16.50</span>
                                </div>
                            </div>

                            <button
                                onClick={handleUnpark}
                                className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-lg rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                Complete Payment & Unpark
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const InfoItem = ({ label, value, highlight }) => (
    <div className={`${highlight ? 'col-span-1 md:col-span-2' : ''}`}>
        <div className={`p-4 rounded-lg ${highlight ? 'bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200' : 'bg-gray-50'}`}>
            <p className="text-sm text-gray-600 mb-1">{label}</p>
            <p className={`font-semibold ${highlight ? 'text-2xl text-blue-600' : 'text-lg text-gray-800'}`}>{value}</p>
        </div>
    </div>
);

export default Unpark;
