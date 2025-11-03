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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        Parking Status
                    </h1>
                    <p className="text-slate-600 text-lg">Real-time parking availability dashboard</p>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        title="Total Spots"
                        value={parkingData.totalSpots}
                        icon={<GridIcon />}
                        color="slate"
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
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-10 border-2 border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800">Overall Availability</h2>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-slate-600">Live</span>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="flex justify-between text-sm text-slate-600 mb-3">
                            <span className="font-medium">Available Space</span>
                            <span className="font-bold text-slate-800">{availabilityPercentage}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-10 overflow-hidden shadow-inner">
                            <div
                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-end px-4 transition-all duration-1000 shadow-lg"
                                style={{ width: `${availabilityPercentage}%` }}
                            >
                                <span className="text-white font-bold text-sm drop-shadow-md">
                                    {parkingData.availableSpots} spots
                                </span>
                            </div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-500">
                            <span>0%</span>
                            <span>25%</span>
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>

                {/* Level Details */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-slate-200">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-slate-800">Level-wise Availability</h2>
                        <button className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm font-semibold">
                            Refresh Data
                        </button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {parkingData.levels.map((level, index) => (
                            <LevelCard key={index} level={level} />
                        ))}
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
                        title="Average Wait Time"
                        icon={<TimeIcon />}
                        items={['Current: 3 minutes', 'Average: 5 minutes']}
                    />
                </div>

                {/* Live Update Indicator */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center px-6 py-3 bg-slate-100 border-2 border-slate-300 rounded-full">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
                        <span className="text-slate-800 font-semibold">Last updated: Just now</span>
                    </div>
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

const LevelCard = ({ level }) => {
    const percentage = Math.round((level.available / level.total) * 100);

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

    return (
        <div className="border-2 border-slate-200 rounded-xl p-6 hover:border-slate-400 hover:shadow-lg transition-all bg-slate-50">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800">{level.level}</h3>
                <div className="text-right">
                    <p className={`text-2xl font-bold ${getStatusColor()}`}>{level.available}</p>
                    <p className="text-xs text-slate-600">of {level.total} spots</p>
                </div>
            </div>
            <div className="mb-3">
                <div className="w-full bg-slate-200 rounded-full h-6 overflow-hidden shadow-inner">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ${getBarColor()}`}
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm">
                    <span className="text-slate-600">
                        <span className="font-semibold text-green-600">{level.available}</span> Available
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-600">
                        <span className="font-semibold text-red-600">{level.occupied}</span> Occupied
                    </span>
                </div>
                <span className={`text-sm font-bold ${getStatusColor()}`}>
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
    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const TimeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export default Status;
