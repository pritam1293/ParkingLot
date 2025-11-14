import React from 'react';

/**
 * Reusable Loading Spinner Component
 * @param {string} size - Size of spinner: 'small', 'medium', 'large' (default: 'medium')
 * @param {string} message - Optional loading message to display
 * @param {boolean} fullScreen - If true, displays as full-screen overlay
 */
function LoadingSpinner({ size = 'medium', message = 'Loading...', fullScreen = false }) {
    const sizeClasses = {
        small: 'h-6 w-6',
        medium: 'h-12 w-12',
        large: 'h-16 w-16'
    };

    const spinnerSize = sizeClasses[size] || sizeClasses.medium;

    const spinner = (
        <div className="flex flex-col items-center justify-center">
            <div className={`inline-block animate-spin rounded-full border-b-2 border-slate-700 ${spinnerSize}`}></div>
            {message && <p className="mt-4 text-slate-600">{message}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                {spinner}
            </div>
        );
    }

    return spinner;
}

export default LoadingSpinner;
