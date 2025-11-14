import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { validateSigninForm } from '../services/validation';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/UserAPI';

function Signin() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        contactNo: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loginMethod, setLoginMethod] = useState('email');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionExpiredMessage, setSessionExpiredMessage] = useState(false);

    // Check if redirected due to session expiration
    useEffect(() => {
        // Check if there's no token in localStorage (user was logged out)
        const hasToken = localStorage.getItem('authToken');
        if (!hasToken && location.state?.from) {
            setSessionExpiredMessage(true);
            // Auto-hide after 10 seconds
            setTimeout(() => setSessionExpiredMessage(false), 10000);
        }
    }, [location]);

    const validateForm = () => {
        const validationErrors = validateSigninForm(formData);
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (errors.identifier) {
            setErrors(prev => ({
                ...prev,
                identifier: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            // Call signin API
            const response = await authAPI.signin({
                email: formData.email.trim() || null,
                contactNo: formData.contactNo.trim() || null,
                password: formData.password
            });

            // Extract token and user data from response
            const token = response.token;
            const userData = {
                email: response.email || formData.email || formData.contactNo,
                firstName: 'User', // API doesn't return this in signin response
                lastName: 'Name'
            };

            // Store authentication data
            login(userData, token);

            // Redirect to home page
            navigate('/home');
        } catch (error) {
            // Handle error and display to user
            if (typeof error === 'string') {
                setErrors({ general: error });
            } else if (error.message) {
                setErrors({ general: error.message });
            } else {
                setErrors({ general: 'Login failed. Please check your credentials.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center py-12 px-4">
            <div className="w-full max-w-lg">
                {/* Logo and Branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-700 rounded-full mb-4 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        QuickPark
                    </h1>
                    <p className="text-slate-600 text-sm">
                        Welcome back! Sign in to continue
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    {/* Session Expired Message */}
                    {sessionExpiredMessage && (
                        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg animate-slideIn">
                            <div className="flex items-start">
                                <svg className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="flex-1">
                                    <h3 className="text-sm font-medium text-yellow-800">Session Expired</h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        Your session has expired. Please sign in again to continue.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSessionExpiredMessage(false)}
                                    className="ml-3 text-yellow-400 hover:text-yellow-600"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="space-y-5">
                        {/* Login Method Toggle */}
                        <div>
                            <label className="block text-sm font-medium text-slate-800 mb-3">
                                Sign in with
                            </label>
                            <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLoginMethod('email');
                                        setFormData(prev => ({ ...prev, contactNo: '' }));
                                        setErrors({});
                                    }}
                                    className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${loginMethod === 'email'
                                        ? 'bg-white text-slate-700 shadow-md'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        <span>Email</span>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setLoginMethod('phone');
                                        setFormData(prev => ({ ...prev, email: '' }));
                                        setErrors({});
                                    }}
                                    className={`py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${loginMethod === 'phone'
                                        ? 'bg-white text-slate-700 shadow-md'
                                        : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                >
                                    <div className="flex items-center justify-center space-x-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                        <span>Phone</span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {errors.identifier && (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-amber-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-amber-700 text-sm">{errors.identifier}</p>
                                </div>
                            </div>
                        )}

                        {/* Email or Phone Input */}
                        {loginMethod === 'email' ? (
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-800 mb-1.5">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-red-300' : 'border-transparent'
                                            } rounded-xl focus:outline-none focus:bg-white focus:border-slate-300 transition-all duration-200 text-slate-800 placeholder-slate-400`}
                                        placeholder="you@example.com"
                                    />
                                </div>
                                {errors.email && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.email}</p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="contactNo" className="block text-sm font-medium text-slate-800 mb-1.5">
                                    Contact Number <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="contactNo"
                                        name="contactNo"
                                        type="tel"
                                        value={formData.contactNo}
                                        onChange={handleChange}
                                        maxLength="10"
                                        className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.contactNo ? 'border-red-300' : 'border-transparent'
                                            } rounded-xl focus:outline-none focus:bg-white focus:border-slate-300 transition-all duration-200 text-slate-800 placeholder-slate-400`}
                                        placeholder="9876543210"
                                    />
                                </div>
                                {errors.contactNo && (
                                    <p className="mt-1.5 text-xs text-red-600">{errors.contactNo}</p>
                                )}
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-800 mb-1.5">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 bg-slate-50 border ${errors.password ? 'border-red-300' : 'border-transparent'
                                        } rounded-xl focus:outline-none focus:bg-white focus:border-slate-300 transition-all duration-200 text-slate-800 placeholder-slate-400`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1.5 text-xs text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Forgot Password Link */}
                        <div className="flex items-center justify-end">
                            <Link
                                to="/forgot-password"
                                className="text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors duration-200"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        {/* General Error Message */}
                        {errors.general && (
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                <div className="flex items-start">
                                    <svg className="w-5 h-5 text-red-500 mt-0.5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-red-700 text-sm">{errors.general}</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full py-3.5 px-4 bg-slate-700 hover:bg-slate-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>

                        {/* Sign Up Link */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-slate-600">
                                New to QuickPark?{' '}
                                <Link
                                    to="/signup"
                                    className="font-semibold text-slate-700 hover:text-slate-900 transition-colors"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signin;