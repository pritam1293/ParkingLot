import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1 (234) 567-8900',
        address: '123 Main Street, City, State 12345',
        memberSince: 'January 2023'
    });

    const handleEdit = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        setIsEditing(false);
        alert('Profile updated successfully!');
    };

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4">
                        My Profile
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-5xl font-bold">
                                {userData.firstName[0]}{userData.lastName[0]}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                {userData.firstName} {userData.lastName}
                            </h2>
                            <p className="text-gray-600 mb-4">{userData.email}</p>
                            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                </svg>
                                Member since {userData.memberSince}
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-8 space-y-3">
                                <button
                                    onClick={() => navigate('/profile/history')}
                                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    View History
                                </button>
                                <button className="w-full py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-300">
                                    Change Password
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-800">Account Information</h2>
                                {!isEditing ? (
                                    <button
                                        onClick={handleEdit}
                                        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div className="space-x-2">
                                        <button
                                            onClick={handleSave}
                                            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleEdit}
                                            className="px-6 py-2 bg-gray-400 text-white font-semibold rounded-lg hover:bg-gray-500 transition-all duration-300"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <ProfileField
                                        label="First Name"
                                        name="firstName"
                                        value={userData.firstName}
                                        isEditing={isEditing}
                                        onChange={handleChange}
                                    />
                                    <ProfileField
                                        label="Last Name"
                                        name="lastName"
                                        value={userData.lastName}
                                        isEditing={isEditing}
                                        onChange={handleChange}
                                    />
                                </div>
                                <ProfileField
                                    label="Email Address"
                                    name="email"
                                    value={userData.email}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    type="email"
                                />
                                <ProfileField
                                    label="Phone Number"
                                    name="phone"
                                    value={userData.phone}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                    type="tel"
                                />
                                <ProfileField
                                    label="Address"
                                    name="address"
                                    value={userData.address}
                                    isEditing={isEditing}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <StatCard title="Total Parkings" value="42" icon="🚗" />
                            <StatCard title="Active Bookings" value="1" icon="📍" />
                            <StatCard title="Loyalty Points" value="580" icon="⭐" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileField = ({ label, name, value, isEditing, onChange, type = 'text' }) => (
    <div>
        <label className="block text-gray-700 font-semibold mb-2">{label}</label>
        {isEditing ? (
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors"
            />
        ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-gray-800">{value}</div>
        )}
    </div>
);

const StatCard = ({ title, value, icon }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 text-center transform hover:scale-105 transition-all duration-300">
        <div className="text-4xl mb-2">{icon}</div>
        <div className="text-3xl font-bold text-gray-800 mb-1">{value}</div>
        <div className="text-gray-600 text-sm">{title}</div>
    </div>
);

export default Profile;
