import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full text-center">
                {/* 404 Animation */}
                <div className="mb-8">
                    <h1 className="text-9xl font-bold text-slate-700 mb-4">404</h1>
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-slate-700 rounded-full animate-bounce">
                            <Search className="w-12 h-12 text-white" />
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-slate-600 mb-6">
                        Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
                    </p>

                    {/* Quick Links */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <h3 className="font-semibold text-slate-700 mb-2">Popular Pages</h3>
                            <ul className="text-sm text-slate-600 space-y-1">
                                <li>• Park Vehicle</li>
                                <li>• Unpark Vehicle</li>
                                <li>• Parking Status</li>
                                <li>• History</li>
                            </ul>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                            <h3 className="font-semibold text-slate-700 mb-2">Need Help?</h3>
                            <ul className="text-sm text-slate-600 space-y-1">
                                <li>• Check your URL</li>
                                <li>• Go back to previous page</li>
                                <li>• Visit home page</li>
                                <li>• Contact support</li>
                            </ul>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center justify-center px-6 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-semibold hover:bg-slate-50 transition-colors duration-200"
                        >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Go Back
                        </button>

                        <button
                            onClick={() => navigate('/home')}
                            className="flex items-center justify-center px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors duration-200 shadow-lg hover:shadow-xl"
                        >
                            <Home className="w-5 h-5 mr-2" />
                            Go to Home
                        </button>
                    </div>
                </div>

                {/* Footer Note */}
                <p className="text-sm text-slate-500">
                    Error Code: 404 - Page Not Found
                </p>
            </div>
        </div>
    );
}

export default NotFound;
