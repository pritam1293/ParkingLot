import React, { useState } from 'react';

function Admin() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [addSpotForm, setAddSpotForm] = useState({
        spotId: '',
        spotType: 'COMPACT',
        floor: '',
        section: ''
    });
    const [updateSpotForm, setUpdateSpotForm] = useState({
        spotId: '',
        isActive: true
    });
    const [revenueForm, setRevenueForm] = useState({
        startDate: '',
        endDate: ''
    });

    // Mock data for demonstration
    const mockParkingSpots = [
        { id: 'C-001', type: 'COMPACT', floor: 1, section: 'A', isActive: true, isOccupied: false },
        { id: 'C-002', type: 'COMPACT', floor: 1, section: 'A', isActive: true, isOccupied: true },
        { id: 'L-001', type: 'LARGE', floor: 2, section: 'B', isActive: true, isOccupied: false },
        { id: 'M-001', type: 'MINI', floor: 1, section: 'C', isActive: false, isOccupied: false },
    ];

    const mockParkedVehicles = [
        { ticketId: 'TKT001', spotId: 'C-002', vehicleNo: 'DL01AB1234', parkedAt: '2025-12-05 10:30', vehicleType: 'CAR' },
        { ticketId: 'TKT002', spotId: 'L-001', vehicleNo: 'DL02CD5678', parkedAt: '2025-12-05 11:15', vehicleType: 'SUV' },
    ];

    const handleAddSpot = (e) => {
        e.preventDefault();
        console.log('Adding spot:', addSpotForm);
        // TODO: API call to add parking spot
        alert('Parking spot added successfully!');
        setAddSpotForm({ spotId: '', spotType: 'COMPACT', floor: '', section: '' });
    };

    const handleUpdateSpotStatus = (e) => {
        e.preventDefault();
        console.log('Updating spot status:', updateSpotForm);
        // TODO: API call to update spot status
        alert('Parking spot status updated successfully!');
        setUpdateSpotForm({ spotId: '', isActive: true });
    };

    const handleRevenueQuery = (e) => {
        e.preventDefault();
        console.log('Querying revenue:', revenueForm);
        // TODO: API call to get revenue between dates
        alert(`Revenue query: ${revenueForm.startDate} to ${revenueForm.endDate}`);
    };

    const getAvailableSpots = () => mockParkingSpots.filter(spot => !spot.isOccupied && spot.isActive);
    const getActiveSpots = () => mockParkingSpots.filter(spot => spot.isActive);
    const getInactiveSpots = () => mockParkingSpots.filter(spot => !spot.isActive);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-800 flex items-center">
                                <svg className="w-8 h-8 mr-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Admin Dashboard
                            </h1>
                            <p className="text-slate-600 mt-1">Manage parking spots and view analytics</p>
                        </div>
                        <div className="bg-slate-100 px-4 py-2 rounded-lg">
                            <p className="text-sm text-slate-700 font-medium">Administrator Access</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
                    <div className="flex overflow-x-auto">
                        <TabButton
                            active={activeTab === 'dashboard'}
                            onClick={() => setActiveTab('dashboard')}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
                                </svg>
                            }
                        >
                            Dashboard
                        </TabButton>
                        <TabButton
                            active={activeTab === 'addSpot'}
                            onClick={() => setActiveTab('addSpot')}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                            }
                        >
                            Add Spot
                        </TabButton>
                        <TabButton
                            active={activeTab === 'updateSpot'}
                            onClick={() => setActiveTab('updateSpot')}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            }
                        >
                            Update Status
                        </TabButton>
                        <TabButton
                            active={activeTab === 'allSpots'}
                            onClick={() => setActiveTab('allSpots')}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            }
                        >
                            All Spots
                        </TabButton>
                        <TabButton
                            active={activeTab === 'parkedVehicles'}
                            onClick={() => setActiveTab('parkedVehicles')}
                            icon={
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                </svg>
                            }
                        >
                            Parked Vehicles
                        </TabButton>
                        <TabButton
                            active={activeTab === 'revenue'}
                            onClick={() => setActiveTab('revenue')}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            }
                        >
                            Revenue
                        </TabButton>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    {/* Dashboard Tab */}
                    {activeTab === 'dashboard' && (
                        <div className="space-y-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">Overview</h2>

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatCard
                                    title="Total Spots"
                                    value={mockParkingSpots.length}
                                    icon="📊"
                                    color="slate"
                                />
                                <StatCard
                                    title="Available Spots"
                                    value={getAvailableSpots().length}
                                    icon="✅"
                                    color="green"
                                />
                                <StatCard
                                    title="Active Spots"
                                    value={getActiveSpots().length}
                                    icon="🟢"
                                    color="indigo"
                                />
                                <StatCard
                                    title="Parked Vehicles"
                                    value={mockParkedVehicles.length}
                                    icon="🚗"
                                    color="purple"
                                />
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                                <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Spots by Type</h3>
                                    <div className="space-y-3">
                                        <SpotTypeRow type="COMPACT" count={mockParkingSpots.filter(s => s.type === 'COMPACT').length} />
                                        <SpotTypeRow type="LARGE" count={mockParkingSpots.filter(s => s.type === 'LARGE').length} />
                                        <SpotTypeRow type="MINI" count={mockParkingSpots.filter(s => s.type === 'MINI').length} />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                                    <h3 className="text-lg font-semibold text-green-900 mb-4">Occupancy Rate</h3>
                                    <div className="flex items-center justify-center h-32">
                                        <div className="text-center">
                                            <p className="text-5xl font-bold text-green-700">
                                                {Math.round((mockParkedVehicles.length / mockParkingSpots.length) * 100)}%
                                            </p>
                                            <p className="text-green-600 mt-2">Current Occupancy</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Add Spot Tab */}
                    {activeTab === 'addSpot' && (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Add New Parking Spot</h2>
                            <form onSubmit={handleAddSpot} className="max-w-2xl space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Spot ID</label>
                                    <input
                                        type="text"
                                        value={addSpotForm.spotId}
                                        onChange={(e) => setAddSpotForm({ ...addSpotForm, spotId: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                        placeholder="e.g., C-001"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Spot Type</label>
                                    <select
                                        value={addSpotForm.spotType}
                                        onChange={(e) => setAddSpotForm({ ...addSpotForm, spotType: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                    >
                                        <option value="COMPACT">Compact</option>
                                        <option value="LARGE">Large</option>
                                        <option value="MINI">Mini</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Floor</label>
                                    <input
                                        type="number"
                                        value={addSpotForm.floor}
                                        onChange={(e) => setAddSpotForm({ ...addSpotForm, floor: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                        placeholder="1"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Section</label>
                                    <input
                                        type="text"
                                        value={addSpotForm.section}
                                        onChange={(e) => setAddSpotForm({ ...addSpotForm, section: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                        placeholder="A"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                                >
                                    Add Parking Spot
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Update Spot Status Tab */}
                    {activeTab === 'updateSpot' && (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Update Parking Spot Status</h2>
                            <form onSubmit={handleUpdateSpotStatus} className="max-w-2xl space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Spot ID</label>
                                    <input
                                        type="text"
                                        value={updateSpotForm.spotId}
                                        onChange={(e) => setUpdateSpotForm({ ...updateSpotForm, spotId: e.target.value })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                        placeholder="e.g., C-001"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                                    <select
                                        value={updateSpotForm.isActive}
                                        onChange={(e) => setUpdateSpotForm({ ...updateSpotForm, isActive: e.target.value === 'true' })}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                    >
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                                >
                                    Update Status
                                </button>
                            </form>
                        </div>
                    )}

                    {/* All Spots Tab */}
                    {activeTab === 'allSpots' && (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">All Parking Spots</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Spot ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Type</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Floor</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Section</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Occupied</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {mockParkingSpots.map((spot) => (
                                            <tr key={spot.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 text-sm font-medium text-slate-900">{spot.id}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{spot.type}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{spot.floor}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{spot.section}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${spot.isActive
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {spot.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${spot.isOccupied
                                                        ? 'bg-orange-100 text-orange-800'
                                                        : 'bg-slate-100 text-slate-800'
                                                        }`}>
                                                        {spot.isOccupied ? 'Occupied' : 'Available'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Parked Vehicles Tab */}
                    {activeTab === 'parkedVehicles' && (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Currently Parked Vehicles</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-100">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Ticket ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Spot ID</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Vehicle Number</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Vehicle Type</th>
                                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Parked At</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {mockParkedVehicles.map((vehicle) => (
                                            <tr key={vehicle.ticketId} className="hover:bg-slate-50">
                                                <td className="px-4 py-3 text-sm font-medium text-slate-900">{vehicle.ticketId}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{vehicle.spotId}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600 font-mono">{vehicle.vehicleNo}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{vehicle.vehicleType}</td>
                                                <td className="px-4 py-3 text-sm text-slate-600">{vehicle.parkedAt}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Revenue Tab */}
                    {activeTab === 'revenue' && (
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Revenue Analytics</h2>
                            <form onSubmit={handleRevenueQuery} className="max-w-2xl space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                                        <input
                                            type="date"
                                            value={revenueForm.startDate}
                                            onChange={(e) => setRevenueForm({ ...revenueForm, startDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                                        <input
                                            type="date"
                                            value={revenueForm.endDate}
                                            onChange={(e) => setRevenueForm({ ...revenueForm, endDate: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                                            required
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
                                >
                                    Generate Revenue Report
                                </button>
                            </form>

                            {/* Mock Revenue Display */}
                            <div className="mt-8 bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                                <h3 className="text-lg font-semibold text-green-900 mb-4">Sample Revenue Data</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white p-4 rounded-lg">
                                        <p className="text-sm text-slate-600">Total Revenue</p>
                                        <p className="text-2xl font-bold text-green-600">₹45,230</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <p className="text-sm text-slate-600">Total Transactions</p>
                                        <p className="text-2xl font-bold text-slate-700">127</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg">
                                        <p className="text-sm text-slate-600">Average Ticket</p>
                                        <p className="text-2xl font-bold text-purple-600">₹356</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Component: Tab Button
const TabButton = ({ active, onClick, icon, children }) => (
    <button
        onClick={onClick}
        className={`flex items-center px-6 py-4 font-medium text-sm transition-colors duration-200 border-b-2 whitespace-nowrap ${active
            ? 'border-blue-600 text-blue-600 bg-blue-50'
            : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
    >
        <span className="mr-2">{icon}</span>
        {children}
    </button>
);

// Component: Stat Card
const StatCard = ({ title, value, icon, color }) => {
    const colorClasses = {
        slate: 'from-slate-50 to-slate-100 text-slate-600',
        green: 'from-green-50 to-green-100 text-green-600',
        indigo: 'from-indigo-50 to-indigo-100 text-indigo-600',
        purple: 'from-purple-50 to-purple-100 text-purple-600',
    };

    return (
        <div className={`bg-gradient-to-br ${colorClasses[color]} p-6 rounded-xl shadow-sm`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium opacity-75">{title}</p>
                    <p className="text-3xl font-bold mt-2">{value}</p>
                </div>
                <div className="text-4xl">{icon}</div>
            </div>
        </div>
    );
};

// Component: Spot Type Row
const SpotTypeRow = ({ type, count }) => (
    <div className="flex justify-between items-center bg-white p-3 rounded-lg">
        <span className="font-medium text-slate-800">{type}</span>
        <span className="bg-slate-300 text-slate-800 px-3 py-1 rounded-full text-sm font-semibold">{count}</span>
    </div>
);

export default Admin;