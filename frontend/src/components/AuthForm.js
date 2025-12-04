import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { validateSigninForm, validateSignupForm } from '../services/validation';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/UserAPI';

function AuthForm({ type = 'signin', isAdmin = false }) {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        contactNo: '',
        password: '',
        confirmPassword: '',
        address: '',
        secretKey: ''
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showSecretKey, setShowSecretKey] = useState(false);
    const [loginMethod, setLoginMethod] = useState('email');
    const [isLoading, setIsLoading] = useState(false);

    const isSignup = type === 'signup';
    const colorScheme = isAdmin ? 'blue' : 'slate';

    const validateForm = () => {
        let validationErrors = {};

        if (isSignup) {
            validationErrors = validateSignupForm(formData);

            // Additional validation for admin secret key
            if (isAdmin) {
                if (!formData.secretKey || formData.secretKey.trim() === '') {
                    validationErrors.secretKey = 'Admin secret key is required';
                } else if (formData.secretKey.trim().length < 40) {
                    validationErrors.secretKey = 'Secret key must be at least 40 characters';
                }
            }
        } else {
            validationErrors = validateSigninForm(formData);
        }

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
            let response;

            if (isSignup) {
                // Call signup API
                const signupData = {
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    email: formData.email.trim(),
                    contactNo: formData.contactNo.trim(),
                    password: formData.password,
                    address: formData.address.trim()
                };

                // Add secret key for admin signup
                if (isAdmin) {
                    signupData.secretKey = formData.secretKey.trim();
                }

                response = await authAPI.signup(signupData);
            } else {
                // Call signin API
                response = await authAPI.signin({
                    email: formData.email.trim() || null,
                    contactNo: formData.contactNo.trim() || null,
                    password: formData.password
                });
            }

            // Extract token and user data from response
            const token = response.token;

            const userData = {
                email: response.email || formData.email || formData.contactNo,
                role: response.role || 'USER'
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
                setErrors({ general: `${isSignup ? 'Registration' : 'Login'} failed. Please try again.` });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const bgGradient = isAdmin ? 'from-blue-100 to-blue-200' : 'from-slate-100 to-slate-200';
    const primaryColor = isAdmin ? 'blue-700' : 'slate-700';
    const hoverColor = isAdmin ? 'blue-800' : 'slate-800';
    const focusColor = isAdmin ? 'blue-300' : 'slate-300';
    const linkColor = isAdmin ? 'blue-700' : 'slate-700';
    const linkHoverColor = isAdmin ? 'blue-900' : 'slate-900';

    return (
        <div className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center py-12 px-4`}>
            <div className="w-full max-w-lg">
                {/* Logo and Branding */}
                <div className="text-center mb-8">
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-${primaryColor} rounded-full mb-4 shadow-lg`}>
                        {isAdmin ? (
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        ) : (
                            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                            </svg>
                        )}
                    </div>
                    <h1 className={`text-3xl font-bold text-${colorScheme}-800 mb-2`}>
                        QuickPark {isAdmin && 'Admin'}
                    </h1>
                    <p className={`text-${colorScheme}-600 text-sm`}>
                        {isSignup
                            ? (isAdmin ? 'Administrative account registration' : 'Smart parking made simple')
                            : (isAdmin ? 'Administrator sign in portal' : 'Welcome back! Sign in to continue')
                        }
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    {/* Welcome Header */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                            {isSignup
                                ? `Create ${isAdmin ? 'Admin ' : ''}Account`
                                : 'Sign In'
                            }
                        </h2>
                        <p className="text-slate-600 text-sm">
                            {isSignup
                                ? (isAdmin ? 'Register as an administrator with your secret key' : 'Join QuickPark and start managing your parking')
                                : 'Enter your credentials to continue'
                            }
                        </p>
                    </div>

                    <div className="space-y-5">
                        {/* Login Method Toggle - Signin only */}
                        {!isSignup && (
                            <div className="flex rounded-xl bg-slate-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => setLoginMethod('email')}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${loginMethod === 'email'
                                        ? `bg-white text-${linkColor} shadow-md`
                                        : 'text-slate-600 hover:text-slate-800'
                                        }`}
                                >
                                    <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    Email
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setLoginMethod('contact')}
                                    className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200 ${loginMethod === 'contact'
                                        ? `bg-white text-${linkColor} shadow-md`
                                        : 'text-slate-600 hover:text-slate-800'
                                        }`}
                                >
                                    <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Contact
                                </button>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Fields - Signup only */}
                            {isSignup && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="firstName" className="block text-sm font-medium text-slate-800 mb-1.5">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.firstName ? 'border-red-300' : 'border-transparent'
                                                    } rounded-xl focus:outline-none focus:bg-white focus:border-${focusColor} transition-all duration-200 text-slate-800 placeholder-slate-400`}
                                                placeholder="Enter your first name"
                                            />
                                        </div>
                                        {errors.firstName && (
                                            <p className="mt-1.5 text-xs text-red-600">{errors.firstName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-sm font-medium text-slate-800 mb-1.5">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>
                                            <input
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className={`w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-${focusColor} transition-all duration-200 text-slate-800 placeholder-slate-400`}
                                                placeholder="Enter your last name"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Email or Contact - Conditional based on signin/signup and login method */}
                            {(!isSignup && loginMethod === 'email') || isSignup ? (
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-slate-800 mb-1.5">
                                        Email {isSignup && <span className="text-red-500">*</span>}
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
                                            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.email || errors.identifier ? 'border-red-300' : 'border-transparent'
                                                } rounded-xl focus:outline-none focus:bg-white focus:border-${focusColor} transition-all duration-200 text-slate-800 placeholder-slate-400`}
                                            placeholder={isAdmin ? "admin@example.com" : "you@example.com"}
                                        />
                                    </div>
                                    {(errors.email || errors.identifier) && (
                                        <p className="mt-1.5 text-xs text-red-600">{errors.email || errors.identifier}</p>
                                    )}
                                </div>
                            ) : null}

                            {(!isSignup && loginMethod === 'contact') || isSignup ? (
                                <div>
                                    <label htmlFor="contactNo" className="block text-sm font-medium text-slate-800 mb-1.5">
                                        Contact Number {isSignup && <span className="text-red-500">*</span>}
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
                                            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.contactNo || errors.identifier ? 'border-red-300' : 'border-transparent'
                                                } rounded-xl focus:outline-none focus:bg-white focus:border-${focusColor} transition-all duration-200 text-slate-800 placeholder-slate-400`}
                                            placeholder="9876543210"
                                        />
                                    </div>
                                    {(errors.contactNo || errors.identifier) && (
                                        <p className="mt-1.5 text-xs text-red-600">{errors.contactNo || errors.identifier}</p>
                                    )}
                                </div>
                            ) : null}

                            {/* Address - Signup only */}
                            {isSignup && (
                                <div>
                                    <label htmlFor="address" className="block text-sm font-medium text-slate-800 mb-1.5">
                                        Address
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="address"
                                            name="address"
                                            type="text"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 bg-slate-50 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-${focusColor} transition-all duration-200 text-slate-800 placeholder-slate-400`}
                                            placeholder="Enter your address"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Admin Secret Key - Admin Signup only */}
                            {isSignup && isAdmin && (
                                <div>
                                    <label htmlFor="secretKey" className="block text-sm font-medium text-slate-800 mb-1.5">
                                        Admin Secret Key <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="secretKey"
                                            name="secretKey"
                                            type={showSecretKey ? 'text' : 'password'}
                                            value={formData.secretKey}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-12 py-3 bg-blue-50 border ${errors.secretKey ? 'border-red-300' : 'border-blue-200'
                                                } rounded-xl focus:outline-none focus:bg-white focus:border-blue-400 transition-all duration-200 text-slate-800 placeholder-slate-400`}
                                            placeholder="Enter your admin secret key"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSecretKey(!showSecretKey)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showSecretKey ? (
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
                                    {errors.secretKey && (
                                        <p className="mt-1.5 text-xs text-red-600">{errors.secretKey}</p>
                                    )}
                                    <p className="mt-1.5 text-xs text-blue-600">
                                        This key is provided to authorized administrators only
                                    </p>
                                </div>
                            )}

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-800 mb-1.5">
                                    Password {isSignup && <span className="text-red-500">*</span>}
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
                                            } rounded-xl focus:outline-none focus:bg-white focus:border-${focusColor} transition-all duration-200 text-slate-800 placeholder-slate-400`}
                                        placeholder={isSignup ? "Create a password" : "Enter your password"}
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

                            {/* Confirm Password - Signup only */}
                            {isSignup && (
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-800 mb-1.5">
                                        Confirm Password <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-12 py-3 bg-slate-50 border ${errors.confirmPassword ? 'border-red-300' : 'border-transparent'
                                                } rounded-xl focus:outline-none focus:bg-white focus:border-${focusColor} transition-all duration-200 text-slate-800 placeholder-slate-400`}
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showConfirmPassword ? (
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
                                    {errors.confirmPassword && (
                                        <p className="mt-1.5 text-xs text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            )}

                            {/* Forgot Password Link - Signin only */}
                            {!isSignup && (
                                <div className="flex justify-end">
                                    <Link
                                        to="/forgot-password"
                                        className={`text-sm font-medium text-${linkColor} hover:text-${linkHoverColor} transition-colors`}
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            )}

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
                                type="submit"
                                disabled={isLoading}
                                className={`w-full ${isSignup ? 'mt-6' : ''} py-3.5 px-4 bg-${primaryColor} hover:bg-${hoverColor} text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-${focusColor} disabled:bg-${colorScheme}-400 disabled:cursor-not-allowed flex items-center justify-center`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isSignup ? 'Creating Account...' : 'Signing in...'}
                                    </>
                                ) : (
                                    isSignup
                                        ? `Create ${isAdmin ? 'Admin ' : ''}Account`
                                        : `Sign in ${isAdmin ? 'to Admin Portal' : ''}`
                                )}
                            </button>

                            {/* Links */}
                            <div className="mt-6 text-center space-y-2">
                                {isSignup ? (
                                    <>
                                        <p className="text-sm text-slate-600">
                                            Already have {isAdmin ? 'an admin ' : 'an '}account?{' '}
                                            <Link
                                                to={isAdmin ? "/admin/signin" : "/signin"}
                                                className={`font-semibold text-${linkColor} hover:text-${linkHoverColor} transition-colors`}
                                            >
                                                Sign in here
                                            </Link>
                                        </p>
                                        {isAdmin ? (
                                            <p className="text-sm text-slate-600">
                                                Regular user?{' '}
                                                <Link to="/signup" className="font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                                                    Create user account
                                                </Link>
                                            </p>
                                        ) : null}
                                    </>
                                ) : (
                                    <>
                                        <p className="text-sm text-slate-600">
                                            Don't have {isAdmin ? 'an admin ' : 'an '}account?{' '}
                                            <Link
                                                to={isAdmin ? "/admin/signup" : "/signup"}
                                                className={`font-semibold text-${linkColor} hover:text-${linkHoverColor} transition-colors`}
                                            >
                                                Create one here
                                            </Link>
                                        </p>
                                        {isAdmin ? (
                                            <p className="text-sm text-slate-600">
                                                Regular user?{' '}
                                                <Link to="/signin" className="font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                                                    Sign in here
                                                </Link>
                                            </p>
                                        ) : null}
                                    </>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthForm;
