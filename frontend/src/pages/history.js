import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/UserAPI';

const History = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [historyData, setHistoryData] = useState({
        parkedTickets: [],
        unparkedTickets: []
    });
    const itemsPerPage = 5;

    // Fetch history data on component mount
    const fetchHistoryData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authAPI.getHistory();
            setHistoryData({
                parkedTickets: response.parked || [],
                unparkedTickets: response.unparked || []
            });
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Failed to load parking history');
            // If unauthorized, redirect to signin
            if (err === 'Invalid or missing Authorization header' || err?.includes('Unauthorized')) {
                localStorage.removeItem('authToken');
                navigate('/signin');
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchHistoryData();
    }, [fetchHistoryData]);

    // Transform backend data to display format
    const transformedData = [
        // Active parking sessions (parked)
        ...historyData.parkedTickets.map(ticket => {
            const entryTime = new Date(ticket.entryTime);
            const now = new Date();
            const durationMs = now - entryTime;
            const hours = Math.floor(durationMs / (1000 * 60 * 60));
            const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

            return {
                id: ticket.id,
                vehicleNumber: ticket.vehicleNo || 'N/A',
                spotNumber: ticket.parkingSpot?.location || 'N/A',
                spotType: ticket.parkingSpot?.type || 'N/A',
                entryTime: entryTime.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                exitTime: 'Active',
                duration: `${hours}h ${minutes}m`,
                amount: 'Calculating...',
                status: 'active'
            };
        }),
        // Completed parking sessions (unparked)
        ...historyData.unparkedTickets.map(ticket => {
            const entryTime = new Date(ticket.entryTime);
            const exitTime = new Date(ticket.exitTime);
            const durationMinutes = ticket.totalDuration || 0;
            const hours = Math.floor(durationMinutes / 60);
            const minutes = durationMinutes % 60;

            return {
                id: ticket.id,
                vehicleNumber: ticket.vehicleNo || 'N/A',
                spotNumber: ticket.parkingSpot?.location || 'N/A',
                spotType: ticket.parkingSpot?.type || 'N/A',
                entryTime: entryTime.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                exitTime: exitTime.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                duration: `${hours}h ${minutes}m`,
                amount: `₹${ticket.totalCost?.toFixed(2) || '0.00'}`,
                status: 'completed'
            };
        })
    ];

    const filteredData = filter === 'all'
        ? transformedData
        : transformedData.filter(item => item.status === filter);

    // Pagination logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = filteredData.slice(startIndex, endIndex);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Calculate summary statistics
    const totalSessions = transformedData.length;
    const activeParking = transformedData.filter(item => item.status === 'active').length;
    const totalSpent = historyData.unparkedTickets.reduce((sum, ticket) => sum + (ticket.totalCost || 0), 0);
    const avgDuration = historyData.unparkedTickets.length > 0
        ? historyData.unparkedTickets.reduce((sum, ticket) => {
            return sum + (ticket.totalDuration || 0);
        }, 0) / historyData.unparkedTickets.length / 60 // Convert minutes to hours
        : 0;

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-slate-800 mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg font-semibold">Loading parking history...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 flex items-center justify-center">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Error Loading History</h2>
                        <p className="text-slate-600 mb-6">{error}</p>
                        <button
                            onClick={fetchHistoryData}
                            className="px-8 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

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
                    <SummaryCard title="Total Sessions" value={totalSessions.toString()} color="blue" />
                    <SummaryCard title="Active Parking" value={activeParking.toString()} color="green" />
                    <SummaryCard title="Total Spent" value={`₹${totalSpent.toFixed(2)}`} color="purple" />
                    <SummaryCard title="Avg Duration" value={`${avgDuration.toFixed(1)}h`} color="orange" />
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <div className="flex flex-wrap gap-4">
                        <FilterButton
                            label="All"
                            isActive={filter === 'all'}
                            onClick={() => setFilter('all')}
                            count={transformedData.length}
                        />
                        <FilterButton
                            label="Active"
                            isActive={filter === 'active'}
                            onClick={() => setFilter('active')}
                            count={transformedData.filter(i => i.status === 'active').length}
                        />
                        <FilterButton
                            label="Completed"
                            isActive={filter === 'completed'}
                            onClick={() => setFilter('completed')}
                            count={transformedData.filter(i => i.status === 'completed').length}
                        />
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-4">
                    {currentPageData.map((record) => (
                        <HistoryCard key={record.id} record={record} />
                    ))}
                </div>

                {/* Pagination Controls */}
                {filteredData.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            {/* Page Info */}
                            <div className="text-slate-600 text-sm">
                                Showing {startIndex + 1}-{Math.min(endIndex, filteredData.length)} of {filteredData.length} tickets
                            </div>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === 1
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-600 text-white hover:bg-slate-700 hover:shadow-lg'
                                        }`}
                                >
                                    Previous
                                </button>

                                {/* Page Number Buttons */}
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                                        // Show first page, last page, current page, and pages around current
                                        const showPage = pageNum === 1 ||
                                            pageNum === totalPages ||
                                            Math.abs(pageNum - currentPage) <= 1;

                                        // Show ellipsis
                                        if (!showPage && (pageNum === currentPage - 2 || pageNum === currentPage + 2)) {
                                            return <span key={pageNum} className="px-2 text-slate-400">...</span>;
                                        }

                                        if (!showPage) return null;

                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => handlePageChange(pageNum)}
                                                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${pageNum === currentPage
                                                    ? 'bg-slate-700 text-white shadow-lg scale-110'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Next Button */}
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${currentPage === totalPages
                                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                        : 'bg-slate-600 text-white hover:bg-slate-700 hover:shadow-lg'
                                        }`}
                                >
                                    Next
                                </button>
                            </div>

                            {/* Page indicator for mobile */}
                            <div className="text-slate-600 text-sm md:hidden">
                                Page {currentPage} of {totalPages}
                            </div>
                        </div>
                    </div>
                )}

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
            {/* Ticket ID Badge */}
            <div className="flex justify-between items-start mb-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-700 text-white text-xs font-semibold">
                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    Ticket ID: {record.id}
                </div>
                <div className={`px-4 py-2 rounded-full font-semibold text-sm ${record.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-slate-100 text-slate-800'
                    }`}>
                    {record.status === 'active' ? 'Active' : 'Completed'}
                </div>
            </div>

            {/* Vehicle Info */}
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
                        <div className="text-sm text-slate-600">Parking Spot: {record.spotNumber}</div>
                    </div>
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
