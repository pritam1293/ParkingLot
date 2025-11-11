import React, { useState } from 'react';
import { parkingAPI } from '../services/ParkingAPI';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const Unpark = () => {
    const navigate = useNavigate();
    const [ticketNumber, setTicketNumber] = useState('');
    const [vehicleInfo, setVehicleInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isUnparking, setIsUnparking] = useState(false);

    // Helper function to format duration from minutes to readable format
    const formatDuration = (minutes) => {
        if (!minutes || minutes === 0) return 'Less than a minute';

        const days = Math.floor(minutes / 1440);
        const hours = Math.floor((minutes % 1440) / 60);
        const mins = minutes % 60;

        const parts = [];
        if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
        if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
        if (mins > 0) parts.push(`${mins} minute${mins > 1 ? 's' : ''}`);

        return parts.join(' ') || 'Less than a minute';
    };

    // Helper function to capitalize vehicle type
    const formatVehicleType = (type) => {
        if (!type) return 'Standard';
        return type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            // Call the unpark API to get vehicle details and unpark
            const response = await parkingAPI.unparkVehicle(ticketNumber.trim());

            // Calculate tax (assuming 10% of parking fee or could be included in totalCost)
            const parkingFee = response.totalCost || 0;
            const tax = 0; // Backend seems to include everything in totalCost

            // Format the response data to match our UI
            setVehicleInfo({
                ticketNumber: response.id || ticketNumber,
                vehicleNumber: response.vehicleNo || 'N/A',
                vehicleModel: response.vehicleModel || 'Not specified',
                vehicleType: formatVehicleType(response.parkingSpot?.type),
                ownerName: response.firstName && response.lastName
                    ? `${response.firstName} ${response.lastName}`
                    : 'N/A',
                phoneNumber: response.ownerContact || 'N/A',
                email: response.email || 'N/A',
                entryTime: response.entryTime ? new Date(response.entryTime).toLocaleString() : 'N/A',
                exitTime: response.exitTime ? new Date(response.exitTime).toLocaleString() : 'N/A',
                duration: formatDuration(response.totalDuration),
                durationMinutes: response.totalDuration || 0,
                parkingFee: parkingFee,
                tax: tax,
                spotNumber: response.parkingSpot?.location || 'N/A',
                floor: response.parkingSpot?.location ? response.parkingSpot.location.split('-')[0] : 'N/A',
                spotDetails: response.parkingSpot,
                rawResponse: response // Store the full response for reference
            });
        } catch (err) {
            setError(err.message || 'Failed to retrieve vehicle information. Please check your ticket number.');
            setVehicleInfo(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUnpark = () => {
        // Vehicle is already unparked when we searched
        const totalAmount = vehicleInfo ? vehicleInfo.parkingFee : 0;
        alert(`Vehicle unparked successfully!\n\nTotal Amount: ₹${totalAmount.toFixed(2)}\n\nThank you for using QuickPark!`);
        setVehicleInfo(null);
        setTicketNumber('');
        // Optionally navigate to home or history page
        navigate('/home');
    };

    const handleDownloadReceipt = () => {
        if (!vehicleInfo) return;

        // Check if parking is free (first 30 minutes)
        const isFree = vehicleInfo.parkingFee === 0;

        // Create a container element for the PDF content
        const element = document.createElement('div');
        element.style.padding = '12px';
        element.style.width = '400px';
        element.style.fontFamily = 'Arial, sans-serif';
        element.style.backgroundColor = 'white';
        element.style.color = 'black';

        // Build the receipt HTML
        element.innerHTML = `
            <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 8px;">
                <h1 style="margin: 3px 0; font-size: 18px; font-weight: bold;">QUICKPARK</h1>
                <p style="margin: 2px 0; font-size: 12px;">PARKING RECEIPT</p>
            </div>
            
            <div style="background: ${isFree ? '#10b981' : '#3b82f6'}; padding: 6px; margin-bottom: 8px; border-radius: 4px; text-align: center;">
                <p style="margin: 0; font-size: 10px; color: white;">${isFree ? '🎉 COMPLIMENTARY PARKING' : '💳 PAYMENT DUE AT EXIT'}</p>
                <p style="margin: 3px 0 0 0; font-size: 14px; font-weight: bold; color: white;">TICKET ID: ${vehicleInfo.ticketNumber}</p>
            </div>

            <div style="margin-bottom: 8px;">
                <h3 style="font-size: 11px; font-weight: bold; margin: 0 0 4px 0; color: #333; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 3px;">Owner Information</h3>
                <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Name:</td>
                        <td style="padding: 2px 0; text-align: right; font-weight: 600;">${vehicleInfo.ownerName}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Contact:</td>
                        <td style="padding: 2px 0; text-align: right; font-weight: 600;">${vehicleInfo.phoneNumber}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Email:</td>
                        <td style="padding: 2px 0; text-align: right; font-weight: 600; font-size: 10px;">${vehicleInfo.email}</td>
                    </tr>
                </table>
            </div>

            <div style="margin-bottom: 8px;">
                <h3 style="font-size: 11px; font-weight: bold; margin: 0 0 4px 0; color: #333; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 3px;">Vehicle Details</h3>
                <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Number:</td>
                        <td style="padding: 2px 0; text-align: right; font-weight: 600;">${vehicleInfo.vehicleNumber}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Model:</td>
                        <td style="padding: 2px 0; text-align: right; font-weight: 600;">${vehicleInfo.vehicleModel}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Type:</td>
                        <td style="padding: 2px 0; text-align: right; font-weight: 600; text-transform: capitalize;">${vehicleInfo.vehicleType}</td>
                    </tr>
                </table>
            </div>

            <div style="margin-bottom: 8px;">
                <h3 style="font-size: 11px; font-weight: bold; margin: 0 0 4px 0; color: #333; text-transform: uppercase; border-bottom: 1px solid #ccc; padding-bottom: 3px;">Parking Details</h3>
                <table style="width: 100%; font-size: 11px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Spot:</td>
                        <td style="padding: 2px 0; text-align: right; font-weight: 600;">${vehicleInfo.spotNumber}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Entry Time:</td>
                        <td style="padding: 2px 0; text-align: right; font-weight: 600; font-size: 10px;">${vehicleInfo.entryTime}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Exit Time:</td>
                        <td style="padding: 2px 0; text-align: right; font-weight: 600; font-size: 10px;">${vehicleInfo.exitTime}</td>
                    </tr>
                    <tr>
                        <td style="padding: 2px 0; color: #666;">Duration:</td>
                        <td style="padding: 2px 0; text-align: right; font-weight: 600;">${vehicleInfo.duration}</td>
                    </tr>
                </table>
            </div>

            <div style="background: ${isFree ? '#ecfdf5' : '#f3f4f6'}; padding: 8px; border-radius: 6px; margin-bottom: 8px; ${isFree ? 'border: 2px solid #10b981;' : ''}">
                <table style="width: 100%; font-size: 12px; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 3px 0; color: #666;">Total Duration:</td>
                        <td style="padding: 3px 0; text-align: right; font-weight: 600;">${vehicleInfo.durationMinutes} minutes</td>
                    </tr>
                    <tr style="border-top: 2px solid ${isFree ? '#a7f3d0' : '#d1d5db'};">
                        <td style="padding: 5px 0; font-weight: bold; font-size: 13px;">Amount ${isFree ? '' : 'Due'}:</td>
                        <td style="padding: 5px 0; text-align: right; font-weight: bold; font-size: 15px; color: ${isFree ? '#059669' : '#dc2626'};">₹${vehicleInfo.parkingFee.toFixed(2)}</td>
                    </tr>
                </table>
                <p style="margin: 5px 0 0 0; font-size: 8px; color: #6b7280; text-align: center;">* All taxes and charges included</p>
            </div>

            ${isFree ? `
                <div style="background: #d1fae5; border-left: 3px solid #10b981; padding: 6px; margin-bottom: 8px;">
                    <p style="margin: 0; font-size: 10px; color: #065f46; font-weight: 600;">🎉 No charges applied!</p>
                    <p style="margin: 3px 0 0 0; font-size: 9px; color: #047857;">You parked within our complimentary 30-minute window. Thank you for visiting QuickPark!</p>
                </div>
            ` : `
                <div style="background: #fef3c7; border-left: 3px solid #f59e0b; padding: 6px; margin-bottom: 8px;">
                    <p style="margin: 0; font-size: 10px; color: #92400e; font-weight: 600;">⚠️ Please proceed to the exit gate</p>
                    <p style="margin: 3px 0 0 0; font-size: 9px; color: #b45309;">Payment must be completed at the exit counter before departure.</p>
                </div>
            `}

            <div style="text-align: center; font-size: 9px; color: #999; border-top: 1px solid #ddd; padding-top: 6px;">
                <p style="margin: 1px 0;">24/7 Security • CCTV Monitored</p>
                <p style="margin: 1px 0;">QuickPark Parking Services</p>
                <p style="margin: 4px 0 0 0; font-size: 8px;">Visit us again!</p>
            </div>
        `;

        // PDF options
        const opt = {
            margin: [10, 10, 10, 10],
            filename: `parking-receipt-${vehicleInfo.vehicleNumber}-${Date.now()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a5', orientation: 'portrait' }
        };

        // Generate and download PDF
        html2pdf().set(opt).from(element).save();
    };

    const total = vehicleInfo ? vehicleInfo.parkingFee : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
            <div className="max-w-5xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
                        Unpark Your Vehicle
                    </h1>
                    <p className="text-slate-600 text-lg">Enter your ticket number to retrieve your vehicle</p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                    <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-slate-700 font-semibold mb-2">
                                    Ticket Number *
                                </label>
                                <input
                                    type="text"
                                    value={ticketNumber}
                                    onChange={(e) => setTicketNumber(e.target.value)}
                                    placeholder="Enter your ticket number"
                                    required
                                    className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:border-slate-600 focus:outline-none transition-colors bg-slate-50"
                                />
                            </div>
                            <div className="sm:pt-8">
                                <button
                                    type="submit"
                                    disabled={isLoading || !ticketNumber.trim()}
                                    className="w-full sm:w-auto px-8 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:bg-slate-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Searching...
                                        </>
                                    ) : (
                                        'Search'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Error Message */}
                    {error && (
                        <div className="mt-6 max-w-2xl mx-auto">
                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                                <div className="flex items-start">
                                    <svg className="w-6 h-6 text-red-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="font-semibold text-red-800 mb-1">Error</p>
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Helper Text */}
                    <div className="mt-6 space-y-4 max-w-2xl mx-auto">
                        {/* First 30 Minutes Free Banner */}
                        <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white">
                            <div className="flex items-start">
                                <svg className="w-6 h-6 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <p className="text-sm font-bold mb-1">🎉 First 30 Minutes FREE!</p>
                                    <p className="text-sm text-green-50">
                                        Enjoy complimentary parking for the first half hour. Charges apply only after 30 minutes.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-semibold text-blue-800 mb-1">Forgot your ticket ID?</p>
                                    <p className="text-sm text-blue-700">
                                        Please visit your profile section, under 'Parking History' to find your ticket number.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-semibold text-green-800 mb-1">Payment Methods Accepted</p>
                                    <p className="text-sm text-green-700">
                                        Credit/Debit Cards, Mobile Wallets (GPay, PayPal, Apple Pay), UPI, and Cash at exit gate.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vehicle Info Card */}
                {vehicleInfo && (
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold mb-2">Vehicle Found!</h2>
                                    <p className="text-slate-300">Ticket #{vehicleInfo.ticketNumber}</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm">
                                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="p-8">
                            {/* Vehicle Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <DetailCard icon={<CarNumberIcon />} label="Vehicle Number" value={vehicleInfo.vehicleNumber} />
                                <DetailCard icon={<VehicleTypeIcon />} label="Vehicle Type" value={vehicleInfo.vehicleType} />
                                <DetailCard icon={<ModelIcon />} label="Vehicle Model" value={vehicleInfo.vehicleModel} />
                                <DetailCard icon={<PersonIcon />} label="Owner Name" value={vehicleInfo.ownerName} />
                                <DetailCard icon={<PhoneIcon />} label="Phone Number" value={vehicleInfo.phoneNumber} />
                                <DetailCard icon={<LocationIcon />} label="Parking Spot" value={vehicleInfo.spotNumber} />
                                <DetailCard icon={<ClockIcon />} label="Entry Time" value={vehicleInfo.entryTime} />
                                <DetailCard icon={<EmailIcon />} label="Email" value={vehicleInfo.email} />
                            </div>

                            {/* Parking Duration */}
                            <div className="mb-8 p-6 bg-slate-100 rounded-xl border-2 border-slate-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-slate-600 text-sm mb-1">Parking Duration</p>
                                        <p className="text-2xl font-bold text-slate-800">{vehicleInfo.duration}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-600 text-sm mb-1">Exit Time</p>
                                        <p className="text-lg font-semibold text-slate-700">{vehicleInfo.exitTime}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Section */}
                            <div className="border-t-2 border-slate-200 pt-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Payment Summary
                                </h3>
                                <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 mb-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center pb-3">
                                            <div>
                                                <span className="text-slate-700 font-medium">Total Parking Duration</span>
                                                <p className="text-xs text-slate-500 mt-1">{vehicleInfo.durationMinutes} minutes</p>
                                            </div>
                                            <span className="text-lg font-semibold text-slate-800">{vehicleInfo.duration}</span>
                                        </div>
                                        <div className="border-t border-slate-300 pt-4">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xl font-bold text-slate-900">Total Amount</span>
                                                <span className="text-3xl font-bold text-green-600">₹{vehicleInfo.parkingFee.toFixed(2)}</span>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-2">* All taxes and charges included</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method Options */}
                                <div className="mb-6">
                                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Select Payment Method</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <button className="p-3 border-2 border-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-50 transition-all group">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-7 h-7 text-slate-600 group-hover:text-slate-800 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                                <span className="text-xs font-semibold text-slate-700">Card</span>
                                            </div>
                                        </button>
                                        <button className="p-3 border-2 border-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-50 transition-all group">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-7 h-7 text-slate-600 group-hover:text-slate-800 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-xs font-semibold text-slate-700">UPI</span>
                                            </div>
                                        </button>
                                        <button className="p-3 border-2 border-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-50 transition-all group">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-7 h-7 text-slate-600 group-hover:text-slate-800 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                                <span className="text-xs font-semibold text-slate-700">Wallet</span>
                                            </div>
                                        </button>
                                        <button className="p-3 border-2 border-slate-300 rounded-lg hover:border-slate-600 hover:bg-slate-50 transition-all group">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-7 h-7 text-slate-600 group-hover:text-slate-800 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span className="text-xs font-semibold text-slate-700">Cash</span>
                                            </div>
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-3 text-center">
                                        💳 All major credit/debit cards accepted | 📱 Google Pay, PayPal, Apple Pay | 💵 Cash at exit gate
                                    </p>
                                </div>

                                {/* Download Receipt Button */}
                                <button
                                    onClick={handleDownloadReceipt}
                                    className="w-full py-4 mb-3 bg-slate-800 text-white font-bold text-lg rounded-lg hover:bg-slate-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                                >
                                    <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download Receipt
                                </button>

                                <button
                                    onClick={handleUnpark}
                                    className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-lg rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                                >
                                    Complete Payment & Exit
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const DetailCard = ({ icon, label, value }) => (
    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors">
        <div className="flex items-center mb-2">
            <div className="text-slate-600 mr-2">
                {icon}
            </div>
            <p className="text-sm text-slate-600 font-medium">{label}</p>
        </div>
        <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
);

// Icon Components
const CarNumberIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
);

const VehicleTypeIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
    </svg>
);

const PersonIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const PhoneIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

const LocationIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ModelIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
);

const EmailIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

export default Unpark;
