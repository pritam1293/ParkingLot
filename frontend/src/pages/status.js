import React, { useState } from 'react';

const Status = () => {
    // Mock data - replace with API call
    const [parkingData] = useState({
        totalSpots: 1000,
        availableSpots: 342,
        occupiedSpots: 658,
        levels: [
            { level: 'Level 1', total: 250, available: 85, occupied: 165 },
            { level: 'Level 2', total: 250, available: 92, occupied: 158 },
            { level: 'Level 3', total: 250, available: 78, occupied: 172 },
            { level: 'Level 4', total: 250, available: 87, occupied: 163 },
        ]
    });

    const availabilityPercentage = Math.round((parkingData.availableSpots / parkingData.totalSpots) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                        Parking Status
                    </h1>
                    <p className="text-gray-600 text-lg">Real-time parking availability</p>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard 
                        title="Total Spots"
                        value={parkingData.totalSpots}
                        icon={<GridIcon />}
                        color="blue"
                    />
                    <StatCard 
                        title="Available Spots"
                        value={parkingData.availableSpots}
                        icon={<CheckIcon />}
                        color="green"
                    />
                    <StatCard 
                        title="Occupied Spots"
                        value={parkingData.occupiedSpots}
                        icon={<CarIcon />}
                        color="red"
                    />
                </div>

                {/* Availability Bar */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Overall Availability</h2>
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Available</span>
                            <span>{availabilityPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-end px-4 transition-all duration-1000"
                                style={{ width: `${availabilityPercentage}%` }}
                            >
                                <span className="text-white font-semibold text-sm">
                                    {parkingData.availableSpots} spots
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Level Details */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Level-wise Availability</h2>
                    <div className="space-y-6">
                        {parkingData.levels.map((level, index) => (
                            <LevelCard key={index} level={level} />
                        ))}
                    </div>
                </div>

                {/* Live Update Indicator */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-green-100 rounded-full">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                        <span className="text-green-800 font-semibold">Live Updates Active</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        green: 'from-green-500 to-emerald-600',
        red: 'from-red-500 to-rose-600'
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-gray-600 text-sm mb-2">{title}</p>
                    <p className="text-4xl font-bold text-gray-800">{value}</p>
                </div>
                <div className={`p-4 rounded-full bg-gradient-to-br ${colorClasses[color]} text-white`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};

const LevelCard = ({ level }) => {
    const percentage = Math.round((level.available / level.total) * 100);
    
    return (
        <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{level.level}</h3>
                <span className="text-sm text-gray-600">{level.available}/{level.total} available</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                        percentage > 50 ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                        percentage > 20 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                        'bg-gradient-to-r from-red-500 to-rose-500'
                    }`}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

// Icon Components
const GridIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CarIcon = () => (
    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

export default Status;
