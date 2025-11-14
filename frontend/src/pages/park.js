import React, { useState } from 'react';
import { categorizeVehicle, getCategoryInfo, getVehicleSuggestions } from '../services/vehicleCategories';
import { parkingAPI } from '../services/ParkingAPI';
import html2pdf from 'html2pdf.js';

const Park = () => {
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        vehicleModel: '',
        vehicleType: '' // Will be auto-detected
    });

    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [detectedCategory, setDetectedCategory] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [ticketData, setTicketData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Auto-detect vehicle category when model is entered
        if (name === 'vehicleModel') {
            if (value.length >= 2) {
                const suggestions = getVehicleSuggestions(value);
                setSuggestions(suggestions);
                setShowSuggestions(true);
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }

            if (value.trim().length > 0) {
                const category = categorizeVehicle(value);
                setDetectedCategory(category);
                setFormData(prev => ({
                    ...prev,
                    vehicleModel: value,
                    vehicleType: category
                }));
            } else {
                setDetectedCategory(null);
            }
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setFormData({
            ...formData,
            vehicleModel: suggestion.displayName,
            vehicleType: suggestion.category
        });
        setDetectedCategory(suggestion.category);
        setShowSuggestions(false);
        setSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.vehicleModel.trim()) {
            setError('Please enter vehicle model');
            return;
        }

        if (!formData.vehicleNumber.trim()) {
            setError('Please enter vehicle number');
            return;
        }

        if (!formData.vehicleType) {
            setError('Vehicle type could not be detected. Please try again.');
            return;
        }

        setLoading(true);

        try {
            const response = await parkingAPI.parkVehicle({
                vehicleNumber: formData.vehicleNumber,
                vehicleModel: formData.vehicleModel,
                vehicleType: formData.vehicleType
            });

            // Success - show toast message
            setShowSuccessToast(true);

            // Hide toast after 2.5 seconds
            setTimeout(() => {
                setShowSuccessToast(false);
            }, 2500);

            // Set ticket data from backend response
            setTicketData({
                id: response.id,
                firstName: response.firstName,
                lastName: response.lastName,
                email: response.email,
                ownerContact: response.ownerContact,
                entryTime: new Date(response.entryTime).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                }),
                vehicleNo: response.vehicleNo,
                vehicleModel: response.vehicleModel || formData.vehicleModel,
                spotLocation: response.parkingSpot?.location,
                spotType: response.parkingSpot?.type,
                spotCost: response.parkingSpot?.cost
            });

            // Reset form
            setFormData({
                vehicleNumber: '',
                vehicleModel: '',
                vehicleType: ''
            });
            setDetectedCategory(null);
        } catch (err) {
            setError(typeof err === 'string' ? err : err.message || 'Failed to park vehicle. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTicket = () => {
        // Create a container element for the PDF content
        const element = document.createElement('div');
        element.style.padding = '20px';
        element.style.width = '400px';
        element.style.fontFamily = 'Arial, sans-serif';
        element.style.backgroundColor = 'white';
        element.style.color = 'black';

        // Build the ticket HTML
        element.innerHTML = `
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px;">
                <h1 style="margin: 5px 0; font-size: 20px; font-weight: bold;">QUICKPARK</h1>
                <p style="margin: 5px 0; font-size: 14px;">PARKING TICKET</p>
            </div>
            
            <div style="background: #f0f0f0; padding: 10px; margin-bottom: 15px; border-radius: 5px; text-align: center;">
                <p style="margin: 0; font-size: 11px; color: #666;">TICKET ID</p>
                <p style="margin: 5px 0 0 0; font-size: 16px; font-weight: bold;">${ticketData.id}</p>
            </div>

            <div style="margin-bottom: 15px;">
                <h3 style="font-size: 12px; font-weight: bold; margin: 0 0 8px 0; color: #333; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Owner Information</h3>
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; color: #666;">Name:</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600;">${ticketData.firstName} ${ticketData.lastName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #666;">Contact:</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600;">${ticketData.ownerContact}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #666;">Email:</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600; font-size: 11px;">${ticketData.email}</td>
                    </tr>
                </table>
            </div>

            <div style="margin-bottom: 15px;">
                <h3 style="font-size: 12px; font-weight: bold; margin: 0 0 8px 0; color: #333; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Vehicle Details</h3>
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; color: #666;">Number:</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600;">${ticketData.vehicleNo}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #666;">Model:</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600;">${ticketData.vehicleModel}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #666;">Type:</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600; text-transform: capitalize;">${ticketData.spotType}</td>
                    </tr>
                </table>
            </div>

            <div style="margin-bottom: 15px;">
                <h3 style="font-size: 12px; font-weight: bold; margin: 0 0 8px 0; color: #333; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 5px;">Parking Information</h3>
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 4px 0; color: #666;">Spot:</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600;">${ticketData.spotLocation}</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #666;">Rate:</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600;">₹${ticketData.spotCost}/hour</td>
                    </tr>
                    <tr>
                        <td style="padding: 4px 0; color: #666;">Entry:</td>
                        <td style="padding: 4px 0; text-align: right; font-weight: 600;">${new Date(ticketData.entryTime).toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })}</td>
                    </tr>
                </table>
            </div>

            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin-bottom: 15px;">
                <p style="margin: 0; font-size: 11px; color: #856404;">⚠️ Keep this ticket safe for exit and payment</p>
            </div>

            <div style="text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 10px;">
                <p style="margin: 2px 0;">24/7 Security • CCTV Monitored</p>
                <p style="margin: 2px 0;">QuickPark Parking Services</p>
            </div>
        `;

        // PDF options
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `parking-ticket-${ticketData.vehicleNo}-${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
        };

        // Generate and download PDF
        html2pdf().set(opt).from(element).save();
    };
    const handleCloseTicket = () => {
        setTicketData(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        Park Your Vehicle
                    </h1>
                    <p className="text-slate-600 text-lg">Fill in the details to reserve your parking spot</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-xl p-8">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Error Message */}
                                {error && (
                                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-red-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <p className="text-red-700 font-medium">{error}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Vehicle Model Input */}
                                <div>
                                    <label className="block text-slate-700 font-semibold mb-2">
                                        Vehicle Model *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="vehicleModel"
                                            value={formData.vehicleModel}
                                            onChange={handleChange}
                                            onFocus={() => {
                                                if (suggestions.length > 0) {
                                                    setShowSuggestions(true);
                                                }
                                            }}
                                            onBlur={() => {
                                                // Delay to allow click on suggestion
                                                setTimeout(() => setShowSuggestions(false), 200);
                                            }}
                                            placeholder="e.g., Honda City, Toyota Fortuner, Activa"
                                            required
                                            className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-slate-600 focus:outline-none transition-colors bg-slate-50"
                                        />

                                        {/* Autocomplete Suggestions */}
                                        {showSuggestions && suggestions.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white border-2 border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                {suggestions.map((suggestion, index) => (
                                                    <div
                                                        key={index}
                                                        onClick={() => handleSuggestionClick(suggestion)}
                                                        className="px-4 py-3 hover:bg-slate-100 cursor-pointer flex justify-between items-center border-b border-slate-100 last:border-b-0"
                                                    >
                                                        <span className="text-slate-700 font-medium">{suggestion.displayName}</span>
                                                        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded">
                                                            {getCategoryInfo(suggestion.category).label}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 mt-2">
                                        Enter your vehicle make and model
                                    </p>
                                </div>

                                {/* Detected Vehicle Type Display */}
                                {detectedCategory && (
                                    <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-slate-600 font-semibold mb-1">Detected Vehicle Type:</p>
                                                <p className="text-lg font-bold text-slate-800">
                                                    {getCategoryInfo(detectedCategory).label}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    {getCategoryInfo(detectedCategory).description}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold text-slate-700">
                                                    {getCategoryInfo(detectedCategory).rate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Vehicle Number */}
                                <div>
                                    <label className="block text-slate-700 font-semibold mb-2">
                                        Vehicle Number *
                                    </label>
                                    <input
                                        type="text"
                                        name="vehicleNumber"
                                        value={formData.vehicleNumber}
                                        onChange={handleChange}
                                        placeholder="e.g., OD01A1234"
                                        required
                                        className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-slate-600 focus:outline-none transition-colors bg-slate-50"
                                    />
                                    <p className="text-sm text-slate-500 mt-2">
                                        Enter your vehicle registration number
                                    </p>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !detectedCategory}
                                    className={`w-full py-4 font-bold text-lg rounded-lg transition-all duration-300 shadow-lg transform ${loading || !detectedCategory
                                        ? 'bg-slate-400 cursor-not-allowed'
                                        : 'bg-slate-800 text-white hover:bg-slate-700 hover:shadow-xl hover:scale-105'
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Parking Vehicle...
                                        </span>
                                    ) : (
                                        'Park Vehicle Now'
                                    )}
                                </button>
                            </form>
                        </div>

                        {/* Ticket Details Section - Shown after successful parking */}
                        {ticketData && (
                            <div className="mt-6 bg-white rounded-lg shadow-lg p-6 border-2 border-slate-300">
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-slate-300">
                                    <h2 className="text-2xl font-bold text-slate-800">🎫 Parking Ticket</h2>
                                    <button
                                        onClick={handleCloseTicket}
                                        className="text-slate-400 hover:text-slate-700 transition"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Highlight - First 30 Minutes FREE
                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 mb-6 text-center shadow-md">
                                    <div className="flex items-center justify-center mb-2">
                                        <svg className="w-8 h-8 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                        </svg>
                                        <p className="text-2xl font-bold text-white">First 30 Minutes FREE!</p>
                                    </div>
                                    <p className="text-white text-sm">Enjoy complimentary parking for the first half hour</p>
                                </div> */}

                                {/* Ticket ID */}
                                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-r p-4 mb-5">
                                    <p className="text-xs text-blue-600 font-semibold mb-1">TICKET ID</p>
                                    <p className="text-xl font-bold text-blue-900">{ticketData.id}</p>
                                </div>

                                {/* Owner Details Section */}
                                <div className="mb-5">
                                    <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                        Ticket Holder Information
                                    </h3>
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Name</span>
                                            <span className="text-slate-900 font-semibold">{ticketData.firstName} {ticketData.lastName}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Contact</span>
                                            <span className="text-slate-900 font-semibold">{ticketData.ownerContact}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Email</span>
                                            <span className="text-slate-900 font-semibold text-sm">{ticketData.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Vehicle Details Section */}
                                <div className="mb-5">
                                    <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                                        </svg>
                                        Vehicle Details
                                    </h3>
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Number</span>
                                            <span className="text-slate-900 font-semibold">{ticketData.vehicleNo}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Model</span>
                                            <span className="text-slate-900 font-semibold">{ticketData.vehicleModel}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Type</span>
                                            <span className="text-slate-900 font-semibold capitalize">{ticketData.spotType}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Parking Details Section */}
                                <div className="mb-5">
                                    <h3 className="text-sm font-bold text-slate-700 uppercase mb-3 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                        Parking Information
                                    </h3>
                                    <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Spot Location</span>
                                            <span className="text-slate-900 font-semibold">{ticketData.spotLocation}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Rate</span>
                                            <span className="text-slate-900 font-semibold">₹{ticketData.spotCost}/hour</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-600">Entry Time</span>
                                            <span className="text-slate-900 font-semibold">{ticketData.entryTime}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Important Note */}
                                <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r p-3 mb-5">
                                    <p className="text-yellow-800 text-sm font-medium">
                                        ⚠️ Keep this ticket safe for exit and payment calculation
                                    </p>
                                </div>

                                {/* Download Button */}
                                <button
                                    onClick={handleDownloadTicket}
                                    className="w-full py-4 bg-slate-800 text-white font-bold text-lg rounded-lg hover:bg-slate-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download Ticket
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Info Cards */}
                    <div className="space-y-6">
                        {/* Info Box */}
                        <div className="bg-slate-800 text-white rounded-2xl shadow-xl p-6">
                            <div className="flex items-center mb-4">
                                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="font-bold text-lg">Important Information</h3>
                            </div>
                            <ul className="space-y-3 text-slate-300">
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>Ensure vehicle number is correct</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>Keep your parking ticket safe</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>Rates vary by vehicle type</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-green-400 mr-2">✓</span>
                                    <span>24/7 security surveillance</span>
                                </li>
                            </ul>
                        </div>

                        {/* Pricing Card */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-slate-200">
                            {/* Free Parking Banner */}
                            <div className="mb-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white text-center">
                                <div className="flex items-center justify-center mb-1">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-bold text-lg">First 30 Minutes FREE!</span>
                                </div>
                                <p className="text-xs text-green-50">Enjoy complimentary parking for the first half hour</p>
                            </div>

                            <h3 className="font-bold text-lg text-slate-800 mb-4">Parking Rates</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                    <span className="text-slate-600">Compact Cars</span>
                                    <span className="font-bold text-slate-800">₹20/hour</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                    <span className="text-slate-600">Large Vehicles</span>
                                    <span className="font-bold text-slate-800">₹35/hour</span>
                                </div>
                                <div className="flex justify-between items-center py-2">
                                    <span className="text-slate-600">Two Wheelers</span>
                                    <span className="font-bold text-slate-800">₹50/hour</span>
                                </div>
                            </div>
                            <div className="mt-4 p-3 bg-slate-100 rounded-lg">
                                <p className="text-xs text-slate-600 text-center">
                                    * Daily maximum rates available
                                </p>
                            </div>
                        </div>

                        {/* Features Card */}
                        <div className="bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-2xl shadow-xl p-6">
                            <h3 className="font-bold text-lg mb-4">Why Park With Us?</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Secure & Monitored</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Easy In & Out</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Multiple Payment Options</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Toast Notification */}
                {showSuccessToast && (
                    <div className="fixed top-4 right-4 z-50 animate-fade-in">
                        <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-3">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="font-bold text-lg">Success!</p>
                                <p className="text-sm">Parking slot booked successfully</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Park;
