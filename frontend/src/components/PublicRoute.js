import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        // Show loading spinner while checking authentication
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
                    <p className="mt-4 text-slate-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        // Redirect to home page if already authenticated
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default PublicRoute;
