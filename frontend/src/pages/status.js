import React, { useState, useEffect } from 'react';
import { parkingAPI } from '../services/ParkingAPI';

const Status = () => {
    const [parkingData, setParkingData] = useState({
        freeMini: 0,
        freeCompact: 0,
        freeLarge: 0,
        bookedMini: 0,
        bookedCompact: 0,
        bookedLarge: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [lastUpdated, setLastUpdated] = useState(new Date());

    // Fetch parking status from API
    const fetchParkingStatus = async () => {
        try {
            setIsLoading(true);
            setError('');
            const data = await parkingAPI.getParkingStatus();
            setParkingData({
                freeMini: data.freeMini || 0,
                freeCompact: data.freeCompact || 0,
                freeLarge: data.freeLarge || 0,
                bookedMini: data.bookedMini || 0,
                bookedCompact: data.bookedCompact || 0,
                bookedLarge: data.bookedLarge || 0
            });
            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message || 'Failed to fetch parking status');
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch on component mount
    useEffect(() => {
        fetchParkingStatus();
    }, []);

    // Calculate totals
    const totalMini = parkingData.freeMini + parkingData.bookedMini;
    const totalCompact = parkingData.freeCompact + parkingData.bookedCompact;
    const totalLarge = parkingData.freeLarge + parkingData.bookedLarge;
    const totalSpots = totalMini + totalCompact + totalLarge;
    const totalAvailableSpots = parkingData.freeMini + parkingData.freeCompact + parkingData.freeLarge;
    const totalBookedSpots = parkingData.bookedMini + parkingData.bookedCompact + parkingData.bookedLarge;

    // Format last updated time
    const formatLastUpdated = () => {
        const now = new Date();
        const diff = Math.floor((now - lastUpdated) / 1000); // seconds

        if (diff < 10) return 'Just now';
        if (diff < 60) return `${diff} seconds ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
        return lastUpdated.toLocaleTimeString();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        Parking Status
                    </h1>
                    <p className="text-slate-600 text-lg">Real-time parking availability dashboard</p>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="flex flex-col items-center">
                            <svg className="animate-spin h-16 w-16 text-slate-800 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="text-slate-600 font-semibold">Loading parking status...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="max-w-2xl mx-auto mb-8">
                        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <div className="flex-1">
                                    <p className="font-semibold text-red-800 mb-1">Error Loading Data</p>
                                    <p className="text-sm text-red-700">{error}</p>
                                    <button
                                        onClick={fetchParkingStatus}
                                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                                    >
                                        Try Again
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Main Content */}
                {!isLoading && !error && (
                    <>
                        {/* Overview Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <VehicleTypeCard
                                title="Mini Vehicles"
                                available={parkingData.freeMini}
                                total={totalMini}
                                booked={parkingData.bookedMini}
                                icon={<MiniCarIcon />}
                                color="blue"
                            />
                            <VehicleTypeCard
                                title="Compact Vehicles"
                                available={parkingData.freeCompact}
                                total={totalCompact}
                                booked={parkingData.bookedCompact}
                                icon={<CompactCarIcon />}
                                color="green"
                            />
                            <VehicleTypeCard
                                title="Large Vehicles"
                                available={parkingData.freeLarge}
                                total={totalLarge}
                                booked={parkingData.bookedLarge}
                                icon={<LargeCarIcon />}
                                color="purple"
                            />
                        </div>

                        {/* Total Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            <StatCard
                                title="Total Parking Spots"
                                value={totalSpots}
                                icon={<GridIcon />}
                                color="slate"
                            />
                            <StatCard
                                title="Available Spots"
                                value={totalAvailableSpots}
                                icon={<CheckIcon />}
                                color="green"
                            />
                            <StatCard
                                title="Occupied Spots"
                                value={totalBookedSpots}
                                icon={<CarIcon />}
                                color="red"
                            />
                        </div>

                        {/* Total Availability Banner */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border-2 border-slate-200">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-slate-800">Overall Parking Status</h2>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm font-semibold text-slate-600">Live</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="text-center py-6 bg-green-50 rounded-xl border-2 border-green-200">
                                    <p className="text-6xl font-bold text-green-600 mb-2">{totalAvailableSpots}</p>
                                    <p className="text-xl text-slate-700 font-semibold">Available Spots</p>
                                </div>
                                <div className="text-center py-6 bg-red-50 rounded-xl border-2 border-red-200">
                                    <p className="text-6xl font-bold text-red-600 mb-2">{totalBookedSpots}</p>
                                    <p className="text-xl text-slate-700 font-semibold">Occupied Spots</p>
                                </div>
                            </div>
                        </div>

                        {/* Vehicle Type Details */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-slate-200 mb-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-slate-800">Vehicle Type Availability</h2>
                                <button
                                    onClick={fetchParkingStatus}
                                    className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold flex items-center"
                                >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Refresh Data
                                </button>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <VehicleTypeDetailCard
                                    type="Mini"
                                    available={parkingData.freeMini}
                                    total={totalMini}
                                    booked={parkingData.bookedMini}
                                    icon={<MiniCarIcon />}
                                    color="blue"
                                />
                                <VehicleTypeDetailCard
                                    type="Compact"
                                    available={parkingData.freeCompact}
                                    total={totalCompact}
                                    booked={parkingData.bookedCompact}
                                    icon={<CompactCarIcon />}
                                    color="green"
                                />
                                <VehicleTypeDetailCard
                                    type="Large"
                                    available={parkingData.freeLarge}
                                    total={totalLarge}
                                    booked={parkingData.bookedLarge}
                                    icon={<LargeCarIcon />}
                                    color="purple"
                                />
                            </div>
                        </div>

                        {/* Additional Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <InfoCard
                                title="Peak Hours"
                                icon={<ClockIcon />}
                                items={['Morning: 8 AM - 10 AM', 'Evening: 5 PM - 7 PM']}
                            />
                            <InfoCard
                                title="Parking Benefits"
                                icon={<CheckIcon />}
                                items={['First 30 minutes FREE', '24/7 Security & CCTV']}
                            />
                        </div>

                        {/* Vehicle Categories Guide */}
                        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-xl p-8 mt-8 text-white">
                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <svg className="w-7 h-7 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Vehicle Category Guide
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <VehicleCategoryCard
                                    type="Mini Vehicles"
                                    icon={<MiniCarIcon />}
                                    color="blue"
                                    examples={[
                                        'Maruti Alto',
                                        'Tata Nano',
                                        'Hyundai Eon',
                                        'Datsun GO',
                                        'Smart Cars'
                                    ]}
                                />
                                <VehicleCategoryCard
                                    type="Compact Vehicles"
                                    icon={<CompactCarIcon />}
                                    color="green"
                                    examples={[
                                        'Maruti Swift',
                                        'Honda City',
                                        'Hyundai i20',
                                        'Volkswagen Polo',
                                        'Sedans & Hatchbacks'
                                    ]}
                                />
                                <VehicleCategoryCard
                                    type="Large Vehicles"
                                    icon={<LargeCarIcon />}
                                    color="purple"
                                    examples={[
                                        'Toyota Fortuner',
                                        'Mahindra Scorpio',
                                        'Ford Endeavour',
                                        'SUVs & MUVs',
                                        'Pickup Trucks'
                                    ]}
                                />
                            </div>
                        </div>

                        {/* Live Update Indicator */}
                        <div className="mt-8 text-center">
                            <div className="inline-flex items-center px-6 py-3 bg-slate-100 border-2 border-slate-300 rounded-full">
                                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                                <span className="text-slate-800 font-semibold">Last updated: {formatLastUpdated()}</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const VehicleTypeCard = ({ title, available, total, booked, icon, color }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-emerald-600',
        purple: 'from-purple-500 to-purple-600'
    };

    const bgColorClasses = {
        blue: 'bg-blue-50 border-blue-200',
        green: 'bg-green-50 border-green-200',
        purple: 'bg-purple-50 border-purple-200'
    };

    const percentage = total > 0 ? Math.round((available / total) * 100) : 0;

    return (
        <div className={`${bgColorClasses[color]} border-2 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-slate-600 text-sm font-semibold mb-2">{title}</p>
                    <p className="text-4xl font-bold text-green-600">{available}</p>
                    <p className="text-xs text-slate-500 mt-1">available now</p>
                </div>
                <div className={`p-4 rounded-full bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
                    {icon}
                </div>
            </div>
            <div className="pt-4 border-t border-slate-300">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Total: <span className="font-bold">{total}</span></span>
                    <span className="text-slate-600">Occupied: <span className="font-bold text-red-600">{booked}</span></span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="h-full bg-green-500 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        slate: 'from-slate-700 to-slate-800',
        green: 'from-green-500 to-emerald-600',
        red: 'from-red-500 to-rose-600'
    };

    const bgColorClasses = {
        slate: 'bg-slate-50 border-slate-200',
        green: 'bg-green-50 border-green-200',
        red: 'bg-red-50 border-red-200'
    };

    return (
        <div className={`${bgColorClasses[color]} border-2 rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-600 text-sm font-semibold mb-2">{title}</p>
                    <p className="text-4xl font-bold text-slate-800">{value}</p>
                </div>
                <div className={`p-4 rounded-full bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

const VehicleTypeDetailCard = ({ type, available, total, booked, icon, color }) => {
    const percentage = total > 0 ? Math.round((available / total) * 100) : 0;

    const getStatusColor = () => {
        if (percentage > 50) return 'text-green-600';
        if (percentage > 20) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getBarColor = () => {
        if (percentage > 50) return 'bg-gradient-to-r from-green-500 to-emerald-500';
        if (percentage > 20) return 'bg-gradient-to-r from-yellow-500 to-orange-500';
        return 'bg-gradient-to-r from-red-500 to-rose-500';
    };

    const getBorderColor = () => {
        if (color === 'blue') return 'border-blue-200 hover:border-blue-400';
        if (color === 'green') return 'border-green-200 hover:border-green-400';
        if (color === 'purple') return 'border-purple-200 hover:border-purple-400';
        return 'border-slate-200 hover:border-slate-400';
    };

    return (
        <div className={`border-2 ${getBorderColor()} rounded-xl p-6 hover:shadow-lg transition-all bg-slate-50`}>
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                    <div className="text-slate-600 mr-3">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800">{type}</h3>
                </div>
                <div className="text-right">
                    <p className={`text-3xl font-bold ${getStatusColor()}`}>{available}</p>
                    <p className="text-xs text-slate-600">of {total} spots</p>
                </div>
            </div>
            <div className="mb-3">
                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${getBarColor()}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
            <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600">
                    <span className="font-semibold text-green-600">{available}</span> Available
                </span>
                <span className="text-slate-400">|</span>
                <span className="text-slate-600">
                    <span className="font-semibold text-red-600">{booked}</span> Occupied
                </span>
                <span className="text-slate-400">|</span>
                <span className={`font-bold ${getStatusColor()}`}>
                    {percentage}%
                </span>
            </div>
        </div>
    );
};

const InfoCard = ({ title, icon, items }) => (
    <div className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
        <div className="flex items-center mb-4">
            <div className="p-3 bg-slate-800 text-white rounded-lg mr-4">
                {icon}
            </div>
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        </div>
        <ul className="space-y-2">
            {items.map((item, index) => (
                <li key={index} className="flex items-center text-slate-600">
                    <svg className="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {item}
                </li>
            ))}
        </ul>
    </div>
);

const VehicleCategoryCard = ({ type, icon, color, examples }) => {
    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500'
    };

    return (
        <div className="bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all">
            <div className="flex items-center mb-4">
                <div className={`p-3 ${colorClasses[color]} rounded-lg mr-3 text-white`}>
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-white">{type}</h3>
            </div>
            <p className="text-sm text-slate-300 mb-3 font-semibold">Examples:</p>
            <ul className="space-y-2">
                {examples.map((example, index) => (
                    <li key={index} className="flex items-start text-sm text-slate-200">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-slate-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {example}
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Icon Components
const MiniCarIcon = () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 5H7c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-2 12H9v-2h6v2zm2-4H7V9h10v4z" />
    </svg>
);

const CompactCarIcon = () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
);

const LargeCarIcon = () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm13.5-9l1.96 2.5H17V9h2.5zm-1.5 9c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const GridIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const CarIcon = () => (
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
);

export default Status;

