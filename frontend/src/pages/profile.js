import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/UserAPI';
import { User, Mail, Phone, MapPin, Calendar, Edit2, Save, X, RefreshCw, Car, Shield, MapPinned, Ticket, History } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNo: '',
        address: '',
        role: '',
        createdAt: null
    });
    const [originalData, setOriginalData] = useState(null);

    // Fetch profile data on component mount
    const fetchProfileData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await authAPI.getProfile();
            const profileData = {
                firstName: response.firstName || '',
                lastName: response.lastName || '',
                email: response.email || '',
                contactNo: response.contactNo || '',
                address: response.address || '',
                role: response.role || 'USER',
                createdAt: response.createdAt || null
            };
            setUserData(profileData);
            setOriginalData(profileData); // Store original data for cancel functionality
            setLastUpdated(new Date());
        } catch (err) {
            setError(typeof err === 'string' ? err : 'Failed to load profile data');
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
        fetchProfileData();
    }, [fetchProfileData]);

    const handleRefresh = () => {
        fetchProfileData();
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setError(null);
            setSuccessMessage(null);

            // Only send the editable fields that have changed
            const updateData = {
                firstName: userData.firstName.trim(),
                lastName: userData.lastName.trim(),
                address: userData.address.trim()
            };

            // Validate that at least one field is not empty
            if (!updateData.firstName && !updateData.lastName && !updateData.address) {
                setError('Please provide at least one field to update');
                setIsSaving(false);
                return;
            }

            await authAPI.updateUser(updateData);

            // Success - refresh profile data to get latest from server
            await fetchProfileData();
            setIsEditing(false);

            // Show success message
            setSuccessMessage('Profile updated successfully!');

            // Auto-hide success message after 5 seconds
            setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
        } catch (err) {
            const errorMessage = typeof err === 'string' ? err : 'Failed to update profile';
            setError(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Restore original data when canceling
        if (originalData) {
            setUserData(originalData);
        }
        setIsEditing(false);
        setError(null);
        setSuccessMessage(null);
    };

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-gray-100 py-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg font-semibold">Loading profile...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-gray-100 py-12 flex items-center justify-center">
                <div className="max-w-md w-full mx-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="text-6xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Error Loading Profile</h2>
                        <p className="text-slate-600 mb-6">{error}</p>
                        <button
                            onClick={handleRefresh}
                            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-gray-100 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 bg-green-50 border-l-4 border-green-500 rounded-lg shadow-lg p-4 flex items-center justify-between animate-slideIn">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-green-800 font-semibold">{successMessage}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSuccessMessage(null)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg p-4 flex items-center justify-between animate-slideIn">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-red-800 font-semibold">{error}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Main Profile Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Cover with Parking Theme */}
                    <div className="h-48 bg-gradient-to-r from-blue-900 via-slate-800 to-gray-900 relative overflow-hidden">
                        {/* Parking Stripes Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="h-full flex items-center justify-around">
                                <div className="w-2 h-full bg-yellow-400 transform -skew-x-12"></div>
                                <div className="w-2 h-full bg-yellow-400 transform -skew-x-12"></div>
                                <div className="w-2 h-full bg-yellow-400 transform -skew-x-12"></div>
                                <div className="w-2 h-full bg-yellow-400 transform -skew-x-12"></div>
                                <div className="w-2 h-full bg-yellow-400 transform -skew-x-12"></div>
                            </div>
                        </div>

                        <div className="absolute inset-0 flex items-center justify-center opacity-5">
                            <Car className="w-64 h-64" />
                        </div>

                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={handleRefresh}
                                className="p-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all"
                                title="Refresh profile data"
                            >
                                <RefreshCw className="w-5 h-5 text-white" />
                            </button>
                            {!isEditing ? (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-lg hover:bg-opacity-30 transition-all flex items-center gap-2 text-white font-medium"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="px-4 py-2 bg-green-500 bg-opacity-90 backdrop-blur-sm rounded-lg hover:bg-green-600 transition-all flex items-center gap-2 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isSaving ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                Save
                                            </>
                                        )}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isSaving}
                                        className="p-2 bg-red-500 bg-opacity-90 backdrop-blur-sm rounded-lg hover:bg-red-600 transition-all text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {lastUpdated && (
                            <div className="absolute bottom-4 left-4 text-white text-sm opacity-75">
                                Last updated: {lastUpdated.toLocaleTimeString()}
                            </div>
                        )}
                    </div>

                    {/* Profile Content */}
                    <div className="px-8 pb-8">
                        {/* Avatar and Basic Info */}
                        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 -mt-16 mb-8">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-600 to-slate-700 shadow-xl flex items-center justify-center text-white text-4xl font-bold ring-4 ring-white">
                                    {userData.firstName && userData.lastName ? `${userData.firstName[0]}${userData.lastName[0]}` : 'U'}
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-2 ring-4 ring-white">
                                    <Shield className="w-5 h-5 text-white" />
                                </div>
                            </div>

                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                    <h1 className="text-3xl font-bold text-gray-800">
                                        {userData.firstName} {userData.lastName}
                                    </h1>
                                    <span className="px-3 py-1 bg-gradient-to-r from-blue-600 to-slate-600 text-white text-sm font-semibold rounded-full flex items-center gap-1">
                                        <Ticket className="w-4 h-4" />
                                        {userData.role}
                                    </span>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Member since {formatDate(userData.createdAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Contact Information Grid */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            {/* First Name */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    First Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={userData.firstName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors bg-gray-50"
                                    />
                                ) : (
                                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 group-hover:border-blue-300 transition-all">
                                        {userData.firstName}
                                    </div>
                                )}
                            </div>

                            {/* Last Name */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <User className="w-4 h-4 text-blue-600" />
                                    Last Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={userData.lastName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors bg-gray-50"
                                    />
                                ) : (
                                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 group-hover:border-blue-300 transition-all">
                                        {userData.lastName}
                                    </div>
                                )}
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Mail className="w-4 h-4 text-blue-600" />
                                    Email Address
                                </label>
                                <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-600 border border-gray-200">
                                    {userData.email}
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <Phone className="w-4 h-4 text-blue-600" />
                                    Phone Number
                                </label>
                                <div className="px-4 py-3 bg-gray-100 rounded-xl text-gray-600 border border-gray-200">
                                    {userData.contactNo}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="md:col-span-2 group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    Address
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="address"
                                        value={userData.address}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors bg-gray-50"
                                    />
                                ) : (
                                    <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-800 border border-gray-200 group-hover:border-blue-300 transition-all">
                                        {userData.address}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate('/history')}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                <History className="w-5 h-5" />
                                Parking History
                            </button>
                            <button
                                onClick={() => navigate('/park')}
                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                            >
                                <MapPinned className="w-5 h-5" />
                                Book Parking
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
