import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree and displays a fallback UI
 */
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to console in development
        if (process.env.NODE_ENV === 'development') {
            console.error('Error caught by Error Boundary:', error, errorInfo);
        }

        // Update state with error details
        this.setState({
            error,
            errorInfo
        });
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    handleGoHome = () => {
        window.location.href = '/home';
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
                    <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
                        {/* Error Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full">
                                <AlertCircle className="w-12 h-12 text-red-600" />
                            </div>
                        </div>

                        {/* Error Title */}
                        <h1 className="text-3xl font-bold text-slate-800 text-center mb-4">
                            Oops! Something went wrong
                        </h1>

                        {/* Error Message */}
                        <p className="text-slate-600 text-center mb-6">
                            We're sorry for the inconvenience. An unexpected error occurred while loading this page.
                        </p>

                        {/* Error Details (Development Only) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <h3 className="text-sm font-semibold text-red-800 mb-2">Error Details (Development Only):</h3>
                                <pre className="text-xs text-red-700 overflow-auto max-h-40">
                                    {this.state.error.toString()}
                                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                                </pre>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="flex items-center justify-center px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-800 transition-colors duration-200 shadow-lg hover:shadow-xl"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Try Again
                            </button>

                            <button
                                onClick={this.handleGoHome}
                                className="flex items-center justify-center px-6 py-3 bg-white text-slate-700 border-2 border-slate-300 rounded-xl font-semibold hover:bg-slate-50 transition-colors duration-200"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Go to Home
                            </button>
                        </div>

                        {/* Support Message */}
                        <p className="text-sm text-slate-500 text-center mt-6">
                            If this problem persists, please contact support or try refreshing your browser.
                        </p>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
