import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/UserAPI';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from 'lucide-react';

function ChangePassword() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Clear message after 5 seconds
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate current password
        if (!formData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        // Validate new password
        if (!formData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6 || formData.newPassword.length > 15) {
            newErrors.newPassword = 'Password must be 6-15 characters';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.newPassword)) {
            newErrors.newPassword = 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)';
        }

        // Check if new password is same as current
        if (formData.currentPassword && formData.newPassword &&
            formData.currentPassword === formData.newPassword) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        // Validate confirm password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await authAPI.changePassword(formData.currentPassword, formData.newPassword);
            setMessage({
                type: 'success',
                text: 'Password changed successfully!'
            });

            // Clear form
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Redirect to profile after 2 seconds
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: typeof error === 'string' ? error : error.message || 'Failed to change password. Please check your current password.'
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
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        Change Password
                    </h1>
                    <p className="text-slate-600">
                        Update your account password
                    </p>
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

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    name="currentPassword"
                                    value={formData.currentPassword}
                                    onChange={handleChange}
                                    placeholder="Enter your current password"
                                    className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent ${errors.currentPassword ? 'border-red-400' : 'border-slate-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('current')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.currentPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                            )}
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    name="newPassword"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    placeholder="Enter your new password"
                                    className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent ${errors.newPassword ? 'border-red-400' : 'border-slate-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('new')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.newPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                            )}
                            <p className="mt-2 text-sm text-slate-500">
                                Password must be 6-15 characters with uppercase, lowercase, number, and special character (@$!%*?&)
                            </p>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm your new password"
                                    className={`w-full pl-11 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-400' : 'border-slate-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => togglePasswordVisibility('confirm')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Password Strength Indicator */}
                        {formData.newPassword && (
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-slate-700">Password Strength:</div>
                                <div className="space-y-1">
                                    <div className="flex items-center text-sm">
                                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${formData.newPassword.length >= 6 && formData.newPassword.length <= 15 ? 'bg-green-500' : 'bg-slate-300'
                                            }`}>
                                            {formData.newPassword.length >= 6 && formData.newPassword.length <= 15 && (
                                                <CheckCircle className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className={formData.newPassword.length >= 6 && formData.newPassword.length <= 15 ? 'text-green-700' : 'text-slate-600'}>
                                            6-15 characters
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/[A-Z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-slate-300'
                                            }`}>
                                            {/[A-Z]/.test(formData.newPassword) && (
                                                <CheckCircle className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className={/[A-Z]/.test(formData.newPassword) ? 'text-green-700' : 'text-slate-600'}>
                                            Contains uppercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/[a-z]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-slate-300'
                                            }`}>
                                            {/[a-z]/.test(formData.newPassword) && (
                                                <CheckCircle className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className={/[a-z]/.test(formData.newPassword) ? 'text-green-700' : 'text-slate-600'}>
                                            Contains lowercase letter
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/\d/.test(formData.newPassword) ? 'bg-green-500' : 'bg-slate-300'
                                            }`}>
                                            {/\d/.test(formData.newPassword) && (
                                                <CheckCircle className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className={/\d/.test(formData.newPassword) ? 'text-green-700' : 'text-slate-600'}>
                                            Contains number
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <div className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${/[@$!%*?&]/.test(formData.newPassword) ? 'bg-green-500' : 'bg-slate-300'
                                            }`}>
                                            {/[@$!%*?&]/.test(formData.newPassword) && (
                                                <CheckCircle className="w-3 h-3 text-white" />
                                            )}
                                        </div>
                                        <span className={/[@$!%*?&]/.test(formData.newPassword) ? 'text-green-700' : 'text-slate-600'}>
                                            Contains special character (@$!%*?&)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-700 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Changing Password...
                                </span>
                            ) : (
                                'Change Password'
                            )}
                        </button>

                        {/* Cancel Button */}
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="w-full text-slate-600 hover:text-slate-800 py-2 font-medium transition-colors duration-200"
                        >
                            Back to Profile
                        </button>
                    </form>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-slate-600">
                        Forgot your current password?{' '}
                        <button
                            onClick={() => {
                                navigate('/forgot-password');
                            }}
                            className="text-slate-700 hover:text-slate-900 font-semibold underline"
                        >
                            Reset Password
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ChangePassword;
