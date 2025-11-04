import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const History = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');

    // Mock data - replace with API call
    const historyData = [
        {
            id: 1,
            vehicleNumber: 'ABC-1234',
            spotNumber: 'A-23',
            entryTime: '2025-10-30 10:30 AM',
            exitTime: '2025-10-30 01:00 PM',
            duration: '2h 30m',
            amount: '$15.00',
            status: 'completed'
        },
        {
            id: 2,
            vehicleNumber: 'XYZ-5678',
            spotNumber: 'B-15',
            entryTime: '2025-10-29 02:15 PM',
            exitTime: '2025-10-29 05:45 PM',
            duration: '3h 30m',
            amount: '$20.00',
            status: 'completed'
        },
        {
            id: 3,
            vehicleNumber: 'ABC-1234',
            spotNumber: 'C-08',
            entryTime: '2025-10-28 09:00 AM',
            exitTime: '2025-10-28 06:30 PM',
            duration: '9h 30m',
            amount: '$45.00',
            status: 'completed'
        },
        {
            id: 4,
            vehicleNumber: 'DEF-9012',
            spotNumber: 'A-45',
            entryTime: '2025-10-31 08:00 AM',
            exitTime: 'Active',
            duration: 'Ongoing',
            amount: 'Calculating...',
            status: 'active'
        }
    ];

    const filteredData = filter === 'all'
        ? historyData
        : historyData.filter(item => item.status === filter);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-10">
                    <button
                        onClick={() => navigate('/profile')}
                        className="flex items-center text-slate-600 hover:text-slate-800 font-semibold mb-6 transition-colors"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Profile
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        Parking History
                    </h1>
                    <p className="text-slate-600 text-lg">View all your past and current parking sessions</p>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <SummaryCard title="Total Sessions" value="42" color="blue" />
                    <SummaryCard title="Active Parking" value="1" color="green" />
                    <SummaryCard title="Total Spent" value="$845" color="purple" />
                    <SummaryCard title="Avg Duration" value="4.2h" color="orange" />
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex flex-wrap gap-4">
                        <FilterButton
                            label="All"
                            isActive={filter === 'all'}
                            onClick={() => setFilter('all')}
                            count={historyData.length}
                        />
                        <FilterButton
                            label="Active"
                            isActive={filter === 'active'}
                            onClick={() => setFilter('active')}
                            count={historyData.filter(i => i.status === 'active').length}
                        />
                        <FilterButton
                            label="Completed"
                            isActive={filter === 'completed'}
                            onClick={() => setFilter('completed')}
                            count={historyData.filter(i => i.status === 'completed').length}
                        />
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-4">
                    {filteredData.map((record) => (
                        <HistoryCard key={record.id} record={record} />
                    ))}
                </div>

                {filteredData.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <svg className="w-24 h-24 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-slate-500 text-lg">No records found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const SummaryCard = ({ title, value, color }) => {
    const colorClasses = {
        blue: 'from-slate-600 to-slate-700',
        green: 'from-green-600 to-emerald-700',
        purple: 'from-purple-600 to-violet-700',
        orange: 'from-orange-600 to-amber-700'
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300`}>
            <div className="text-sm opacity-90 mb-2">{title}</div>
            <div className="text-3xl font-bold">{value}</div>
        </div>
    );
};

const FilterButton = ({ label, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${isActive
                ? 'bg-slate-800 text-white shadow-lg'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
    >
        {label} {count !== undefined && `(${count})`}
    </button>
);

const HistoryCard = ({ record }) => (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border-l-4 ${record.status === 'active' ? 'border-green-500' : 'border-slate-600'
        }`}>
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div className="flex items-center mb-4 md:mb-0">
                    <div className={`w-12 h-12 rounded-full ${record.status === 'active' ? 'bg-green-100' : 'bg-slate-100'
                        } flex items-center justify-center mr-4`}>
                        <svg className={`w-6 h-6 ${record.status === 'active' ? 'text-green-600' : 'text-slate-700'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-xl font-bold text-slate-800">{record.vehicleNumber}</div>
                        <div className="text-sm text-slate-600">Spot: {record.spotNumber}</div>
                    </div>
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold text-sm ${record.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                    {record.status === 'active' ? 'Active' : 'Completed'}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InfoItem label="Entry Time" value={record.entryTime} />
                <InfoItem label="Exit Time" value={record.exitTime} />
                <InfoItem label="Duration" value={record.duration} />
                <InfoItem label="Amount" value={record.amount} highlight />
            </div>
        </div>
    </div>
);

const InfoItem = ({ label, value, highlight }) => (
    <div>
        <div className="text-sm text-slate-600 mb-1">{label}</div>
        <div className={`font-semibold ${highlight ? 'text-slate-800 text-xl' : 'text-slate-800'}`}>
            {value}
        </div>
    </div>
);

export default History;
