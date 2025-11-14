import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/UserAPI';
import { Mail, Phone, CheckCircle, AlertCircle } from 'lucide-react';

function ChangeContact() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: New Contact
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newContactNo, setNewContactNo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [canResend, setCanResend] = useState(false);
    const [countdown, setCountdown] = useState(60);

    // Fetch user email on component mount
    useEffect(() => {
        const fetchUserEmail = async () => {
            try {
                const profile = await authAPI.getProfile();
                setEmail(profile.email);
            } catch (error) {
                setMessage({
                    type: 'error',
                    text: 'Failed to load profile. Please try again.'
                });
            }
        };
        fetchUserEmail();
    }, []);

    // Countdown timer for resend OTP
    useEffect(() => {
        if (currentStep === 2 && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setCanResend(true);
        }
    }, [countdown, currentStep]);

    // Clear message after 5 seconds
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authAPI.generateOTP(email);
            setMessage({
                type: 'success',
                text: `OTP sent successfully to ${email}`
            });
            setCurrentStep(2);
            setCountdown(60);
            setCanResend(false);
        } catch (error) {
            setMessage({
                type: 'error',
                text: typeof error === 'string' ? error : error.message || 'Failed to send OTP'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authAPI.generateOTP(email);
            setMessage({
                type: 'success',
                text: 'OTP resent successfully!'
            });
            setCountdown(60);
            setCanResend(false);
            setOtp('');
        } catch (error) {
            setMessage({
                type: 'error',
                text: typeof error === 'string' ? error : error.message || 'Failed to resend OTP'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            setMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP' });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authAPI.verifyOTP(email, otp);
            setMessage({
                type: 'success',
                text: 'OTP verified successfully!'
            });
            setTimeout(() => setCurrentStep(3), 1000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: typeof error === 'string' ? error : error.message || 'Invalid OTP. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeContact = async (e) => {
        e.preventDefault();

        // Validate contact number
        const contactRegex = /^[0-9]{10}$/;
        if (!contactRegex.test(newContactNo)) {
            setMessage({
                type: 'error',
                text: 'Please enter a valid 10-digit contact number'
            });
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authAPI.resetContactNumber(newContactNo);
            setMessage({
                type: 'success',
                text: 'Contact number updated successfully!'
            });

            // Redirect to profile after 2 seconds
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: typeof error === 'string' ? error : error.message || 'Failed to update contact number'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-700 rounded-full mb-4 shadow-lg">
                        <Phone className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Change Contact Number
                    </h1>
                    <p className="text-slate-600">
                        Verify your email to update your contact number
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center">
                        {/* Step 1 */}
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 1 ? 'bg-slate-700 text-white' : 'bg-slate-300 text-slate-600'
                                }`}>
                                {currentStep > 1 ? <CheckCircle className="w-6 h-6" /> : '1'}
                            </div>
                            <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:inline">Send OTP</span>
                        </div>

                        {/* Connector */}
                        <div className={`w-16 h-1 mx-2 ${currentStep >= 2 ? 'bg-slate-700' : 'bg-slate-300'}`}></div>

                        {/* Step 2 */}
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 2 ? 'bg-slate-700 text-white' : 'bg-slate-300 text-slate-600'
                                }`}>
                                {currentStep > 2 ? <CheckCircle className="w-6 h-6" /> : '2'}
                            </div>
                            <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:inline">Verify OTP</span>
                        </div>

                        {/* Connector */}
                        <div className={`w-16 h-1 mx-2 ${currentStep >= 3 ? 'bg-slate-700' : 'bg-slate-300'}`}></div>

                        {/* Step 3 */}
                        <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 3 ? 'bg-slate-700 text-white' : 'bg-slate-300 text-slate-600'
                                }`}>
                                3
                            </div>
                            <span className="ml-2 text-sm font-medium text-slate-700 hidden sm:inline">New Contact</span>
                        </div>
                    </div>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-2xl p-8">
                    {/* Success/Error Messages */}
                    {message.text && (
                        <div className={`mb-6 p-4 rounded-lg border-l-4 animate-slideIn ${message.type === 'success'
                            ? 'bg-green-50 border-green-400'
                            : 'bg-red-50 border-red-400'
                            }`}>
                            <div className="flex items-start">
                                {message.type === 'success' ? (
                                    <CheckCircle className="w-6 h-6 text-green-400 mr-3 flex-shrink-0" />
                                ) : (
                                    <AlertCircle className="w-6 h-6 text-red-400 mr-3 flex-shrink-0" />
                                )}
                                <p className={`text-sm font-medium ${message.type === 'success' ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    {message.text}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 1: Send OTP */}
                    {currentStep === 1 && (
                        <form onSubmit={handleSendOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Registered Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="email"
                                        value={email}
                                        readOnly
                                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-700 cursor-not-allowed"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-slate-500">
                                    An OTP will be sent to this email address
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || !email}
                                className="w-full bg-slate-700 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Sending OTP...
                                    </span>
                                ) : (
                                    'Send OTP'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="w-full text-slate-600 hover:text-slate-800 py-2 font-medium transition-colors duration-200"
                            >
                                Back to Profile
                            </button>
                        </form>
                    )}

                    {/* Step 2: Verify OTP */}
                    {currentStep === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Enter OTP
                                </label>
                                <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '');
                                        if (value.length <= 6) setOtp(value);
                                    }}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent text-center text-2xl tracking-widest font-semibold"
                                    autoFocus
                                />
                                <p className="mt-2 text-sm text-slate-500">
                                    OTP sent to {email}
                                </p>
                            </div>

                            {/* Resend OTP */}
                            <div className="text-center">
                                {canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        disabled={isLoading}
                                        className="text-slate-700 hover:text-slate-900 font-medium text-sm underline"
                                    >
                                        Resend OTP
                                    </button>
                                ) : (
                                    <p className="text-slate-500 text-sm">
                                        Resend OTP in {countdown}s
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || otp.length !== 6}
                                className="w-full bg-slate-700 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Verifying...
                                    </span>
                                ) : (
                                    'Verify OTP'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setCurrentStep(1);
                                    setOtp('');
                                    setMessage({ type: '', text: '' });
                                }}
                                className="w-full text-slate-600 hover:text-slate-800 py-2 font-medium transition-colors duration-200"
                            >
                                Back
                            </button>
                        </form>
                    )}

                    {/* Step 3: New Contact Number */}
                    {currentStep === 3 && (
                        <form onSubmit={handleChangeContact} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    New Contact Number
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                    <input
                                        type="tel"
                                        value={newContactNo}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/\D/g, '');
                                            if (value.length <= 10) setNewContactNo(value);
                                        }}
                                        placeholder="Enter 10-digit contact number"
                                        maxLength={10}
                                        className="w-full pl-11 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                                        autoFocus
                                    />
                                </div>
                                <p className="mt-2 text-sm text-slate-500">
                                    Enter your new 10-digit contact number
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading || newContactNo.length !== 10}
                                className="w-full bg-slate-700 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Updating...
                                    </span>
                                ) : (
                                    'Update Contact Number'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                className="w-full text-slate-600 hover:text-slate-800 py-2 font-medium transition-colors duration-200"
                            >
                                Cancel
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ChangeContact;
