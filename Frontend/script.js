const baseUrl = 'http://localhost:8080/quickpark/';

window.onload = function () {
    // Only load parking status for home page if we're not on the status page
    if (!document.getElementById('miniProgress')) {
        loadParkingStatus();
    }
}

// Function to load parking status
async function loadParkingStatus() {
    try {
        const response = await fetch('http://localhost:8080/quickpark/free-parking-spots');
        const data = await response.json();
        console.log('Parking status data:', data);

        // Calculate totals
        const totalMini = 50;
        const totalCompact = 75; 
        const totalLarge = 25;
        const totalSpots = totalMini + totalCompact + totalLarge;
        
        const availableMini = data.mini || 0;
        const availableCompact = data.compact || 0;
        const availableLarge = data.large || 0;
        const totalAvailable = availableMini + availableCompact + availableLarge;
        
        // Calculate currently parked (occupied) vehicles
        const totalParked = totalSpots - totalAvailable;

        // Update availability numbers for home/status pages
        updateAvailability('mini', availableMini, totalMini);
        updateAvailability('compact', availableCompact, totalCompact);
        updateAvailability('large', availableLarge, totalLarge);

        // Update total available spots (only if element exists - for home page)
        const availableSpotsElement = document.getElementById('availableSpots');
        if (availableSpotsElement) {
            availableSpotsElement.textContent = totalAvailable;
        }

        // Update admin dashboard stats (only if elements exist - for admin page)
        const totalParkedElement = document.getElementById('totalParkedVehicles');
        if (totalParkedElement) {
            totalParkedElement.textContent = totalParked;
            // Also load completed vehicles today data for admin dashboard
            loadCompletedVehiclesToday();
            // Also load active gates count for admin dashboard
            loadActiveGatesCount();
            // Also load today's revenue for admin dashboard
            loadTodaysRevenue();
        }

    } catch (error) {
        console.error('Error loading parking status:', error);
        // Set fallback values for home page elements (only if elements exist)
        const miniCountElement = document.getElementById('miniCount');
        const compactCountElement = document.getElementById('compactCount');
        const largeCountElement = document.getElementById('largeCount');
        const availableSpotsElement = document.getElementById('availableSpots');
        
        if (miniCountElement) miniCountElement.textContent = '--';
        if (compactCountElement) compactCountElement.textContent = '--';
        if (largeCountElement) largeCountElement.textContent = '--';
        if (availableSpotsElement) availableSpotsElement.textContent = '--';
        
        // Set fallback values for admin dashboard elements (only if elements exist)
        const totalParkedElement = document.getElementById('totalParkedVehicles');
        if (totalParkedElement) totalParkedElement.textContent = '--';
    }
}

// Function to load completed vehicles today for admin dashboard
async function loadCompletedVehiclesToday() {
    try {
        const response = await fetch(baseUrl + 'admin/unparked-today');
        const completedCount = await response.json();
        console.log('Completed vehicles today:', completedCount);

        // Update completed today stat (only if element exists - for admin page)
        const totalCompletedElement = document.getElementById('totalCompletedVehicles');
        if (totalCompletedElement) {
            totalCompletedElement.textContent = completedCount;
        }

    } catch (error) {
        console.error('Error loading completed vehicles today:', error);
        // Set fallback value for admin dashboard element (only if element exists)
        const totalCompletedElement = document.getElementById('totalCompletedVehicles');
        if (totalCompletedElement) {
            totalCompletedElement.textContent = '--';
        }
    }
}

// Function to load active gates count for admin dashboard
async function loadActiveGatesCount() {
    try {
        const response = await fetch(baseUrl + 'admin/count-active-gates');
        const activeGatesCount = await response.json();
        console.log('Active gates count:', activeGatesCount);

        // Update active gates stat (only if element exists - for admin page)
        const totalGatesElement = document.getElementById('totalGates');
        if (totalGatesElement) {
            totalGatesElement.textContent = activeGatesCount;
        }

    } catch (error) {
        console.error('Error loading active gates count:', error);
        // Set fallback value for admin dashboard element (only if element exists)
        const totalGatesElement = document.getElementById('totalGates');
        if (totalGatesElement) {
            totalGatesElement.textContent = '--';
        }
    }
}

// Function to load today's revenue for admin dashboard
async function loadTodaysRevenue() {
    try {
        const response = await fetch(baseUrl + 'admin/revenue-today');
        const todaysRevenue = await response.json();
        console.log('Today\'s revenue:', todaysRevenue);

        // Update today's revenue stat (only if element exists - for admin page)
        const todayRevenueElement = document.getElementById('todayRevenue');
        if (todayRevenueElement) {
            todayRevenueElement.textContent = `₹${todaysRevenue}`;
        }

        // Update analytics section today's revenue (only if element exists - for analytics section)
        const todayRevenueAnalyticsElement = document.getElementById('todayRevenueAnalytics');
        if (todayRevenueAnalyticsElement) {
            todayRevenueAnalyticsElement.textContent = `₹${todaysRevenue}`;
        }

    } catch (error) {
        console.error('Error loading today\'s revenue:', error);
        // Set fallback value for admin dashboard element (only if element exists)
        const todayRevenueElement = document.getElementById('todayRevenue');
        if (todayRevenueElement) {
            todayRevenueElement.textContent = '₹--';
        }
        
        // Set fallback value for analytics section element (only if element exists)
        const todayRevenueAnalyticsElement = document.getElementById('todayRevenueAnalytics');
        if (todayRevenueAnalyticsElement) {
            todayRevenueAnalyticsElement.textContent = '₹--';
        }
    }
}

// Function to load weekly revenue for analytics section
async function loadWeeklyRevenue() {
    try {
        const response = await fetch(baseUrl + 'admin/revenue-week');
        const weeklyRevenue = await response.json();
        console.log('Weekly revenue:', weeklyRevenue);

        // Update weekly revenue stat (only if element exists - for analytics section)
        const weekRevenueElement = document.getElementById('weekRevenue');
        if (weekRevenueElement) {
            weekRevenueElement.textContent = `₹${weeklyRevenue}`;
        }

    } catch (error) {
        console.error('Error loading weekly revenue:', error);
        // Set fallback value for analytics section element (only if element exists)
        const weekRevenueElement = document.getElementById('weekRevenue');
        if (weekRevenueElement) {
            weekRevenueElement.textContent = '₹--';
        }
    }
}

// Function to load monthly revenue for analytics section
async function loadMonthlyRevenue() {
    try {
        const response = await fetch(baseUrl + 'admin/revenue-month');
        const monthlyRevenue = await response.json();
        console.log('Monthly revenue:', monthlyRevenue);

        // Update monthly revenue stat (only if element exists - for analytics section)
        const monthRevenueElement = document.getElementById('monthRevenue');
        if (monthRevenueElement) {
            monthRevenueElement.textContent = `₹${monthlyRevenue}`;
        }

    } catch (error) {
        console.error('Error loading monthly revenue:', error);
        // Set fallback value for analytics section element (only if element exists)
        const monthRevenueElement = document.getElementById('monthRevenue');
        if (monthRevenueElement) {
            monthRevenueElement.textContent = '₹--';
        }
    }
}

// Function to refresh revenue analytics data
async function refreshAnalytics() {
    const refreshBtn = document.querySelector('#analytics .btn-outline');
    if (refreshBtn) {
        const originalText = refreshBtn.innerHTML;
        refreshBtn.style.opacity = '0.6';
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '🔄 Refreshing...';
    }

    try {
        // Load revenue data and utilization stats
        await Promise.all([
            loadTodaysRevenue(),
            loadWeeklyRevenue(),
            loadMonthlyRevenue(),
            loadParkingUtilizationStats()
        ]);

        console.log('Analytics data refreshed successfully');

    } catch (error) {
        console.error('Error refreshing analytics:', error);
    } finally {
        // Re-enable the refresh button
        setTimeout(() => {
            if (refreshBtn) {
                refreshBtn.style.opacity = '1';
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '🔄 Refresh';
            }
        }, 1000);
    }
}

// Function to load parking utilization statistics for analytics section
async function loadParkingUtilizationStats() {
    try {
        const response = await fetch(baseUrl + 'admin/parking-statistics');
        const stats = await response.json();
        console.log('Parking utilization stats:', stats);

        // Calculate total occupied vehicles
        const totalOccupied = stats.mini + stats.compact + stats.large;
        
        // Calculate percentage distribution among occupied vehicles
        const miniUtilization = totalOccupied > 0 ? ((stats.mini / totalOccupied) * 100).toFixed(1) : 0;
        const compactUtilization = totalOccupied > 0 ? ((stats.compact / totalOccupied) * 100).toFixed(1) : 0;
        const largeUtilization = totalOccupied > 0 ? ((stats.large / totalOccupied) * 100).toFixed(1) : 0;

        console.log(`Distribution percentages - Mini: ${miniUtilization}%, Compact: ${compactUtilization}%, Large: ${largeUtilization}%`);
        console.log(`Raw data - Mini: ${stats.mini}, Compact: ${stats.compact}, Large: ${stats.large}, Total: ${totalOccupied}`);

        // Update utilization text elements (only if elements exist - for analytics section)
        const miniUtilElement = document.getElementById('miniUtilizationText');
        if (miniUtilElement) {
            miniUtilElement.textContent = `${miniUtilization}%`;
        }

        const compactUtilElement = document.getElementById('compactUtilizationText');
        if (compactUtilElement) {
            compactUtilElement.textContent = `${compactUtilization}%`;
        }

        const largeUtilElement = document.getElementById('largeUtilizationText');
        if (largeUtilElement) {
            largeUtilElement.textContent = `${largeUtilization}%`;
        }

        // Update count elements
        const miniCountElement = document.getElementById('miniUtilCount');
        if (miniCountElement) {
            miniCountElement.textContent = stats.mini;
        }

        const compactCountElement = document.getElementById('compactUtilCount');
        if (compactCountElement) {
            compactCountElement.textContent = stats.compact;
        }

        const largeCountElement = document.getElementById('largeUtilCount');
        if (largeCountElement) {
            largeCountElement.textContent = stats.large;
        }

        // Update visual chart bars if they exist
        updateUtilizationChart(miniUtilization, compactUtilization, largeUtilization);

    } catch (error) {
        console.error('Error loading parking utilization stats:', error);
        // Set fallback values for analytics section elements (only if elements exist)
        const fallbackElements = ['miniUtilizationText', 'compactUtilizationText', 'largeUtilizationText'];
        fallbackElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = '--%';
            }
        });

        const fallbackCountElements = ['miniUtilCount', 'compactUtilCount', 'largeUtilCount'];
        fallbackCountElements.forEach(elementId => {
            const element = document.getElementById(elementId);
            if (element) {
                element.textContent = '--';
            }
        });
    }
}

// Function to update utilization chart visualization
function updateUtilizationChart(miniPercent, compactPercent, largePercent) {
    // Update chart bar widths if elements exist
    const miniBar = document.getElementById('miniUtilization');
    if (miniBar) {
        miniBar.style.width = `${miniPercent}%`;
    }

    const compactBar = document.getElementById('compactUtilization');
    if (compactBar) {
        compactBar.style.width = `${compactPercent}%`;
    }

    const largeBar = document.getElementById('largeUtilization');
    if (largeBar) {
        largeBar.style.width = `${largePercent}%`;
    }
}

// Function to load revenue analytics data on page load
async function loadRevenueAnalytics() {
    try {
        console.log('Loading revenue analytics data...');
        // Load revenue data and utilization stats
        await Promise.all([
            loadWeeklyRevenue(),
            loadMonthlyRevenue(),
            loadParkingUtilizationStats()
        ]);
        console.log('Revenue analytics data loaded successfully');
    } catch (error) {
        console.error('Error loading revenue analytics data:', error);
    }
}

// Function to update availability display
function updateAvailability(type, available, total) {
    // Update count displays (safely check if elements exist)
    const countElement = document.getElementById(type + 'Count');
    if (countElement) {
        countElement.textContent = available;
    }
    
    const availableElement = document.getElementById(type + 'Available');
    if (availableElement) {
        availableElement.textContent = available;
    }

    // Update status bar
    const percentage = (available / total) * 100;
    const fillElement = document.getElementById(type + 'Fill');
    const indicatorElement = document.getElementById(type + 'Indicator');

    if (fillElement) {
        fillElement.style.width = percentage + '%';
    }

    // Update status indicator color
    if (fillElement && indicatorElement) {
        if (percentage > 50) {
            fillElement.className = 'status-fill available';
            indicatorElement.className = 'status-indicator available';
        } else if (percentage > 20) {
            fillElement.className = 'status-fill limited';
            indicatorElement.className = 'status-indicator limited';
        } else {
            fillElement.className = 'status-fill full';
            indicatorElement.className = 'status-indicator full';
        }
    }
}

// Function to refresh status manually
function refreshStatus() {
    const refreshBtn = document.querySelector('.btn-refresh');
    refreshBtn.style.opacity = '0.6';
    refreshBtn.disabled = true;

    loadParkingStatus().then(() => {
        setTimeout(() => {
            refreshBtn.style.opacity = '1';
            refreshBtn.disabled = false;
        }, 1000);
    });
}


// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', function () {
    const sections = ['home', 'park', 'unpark', 'status', 'contact'];
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
            const offsetTop = element.offsetTop;
            const offsetBottom = offsetTop + element.offsetHeight;

            if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                document.querySelector(`a[href="#${section}"]`).classList.add('active');
            }
        }
    });
});

//for parking of the vehicle

// Add form submission handler when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const parkForm = document.getElementById('parkForm');
    if (parkForm) {
        parkForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            parkVehicle(); // Call our custom function
        });
    }
});

function validateVehicleDetails(vehicleNo, ownerName, ownerContact) {
    const pattern = /^[A-Z]{2}\d{2}[A-Z]+\d{4}$/;
    if( !pattern.test(vehicleNo)) {
        return false; // Invalid vehicle number format
    }
    if (ownerName.length < 3 || ownerName.length > 50) {
        return false; // Invalid owner name length
    }
    const contactPattern = /^[0-9]{10}$/;
    if (!contactPattern.test(ownerContact)) {
        return false; // Invalid owner contact format
    }
    return true; // All validations passed
}


async function parkVehicle() {
    // Get form values
    let type = document.getElementById('vehicleType').value;
    let vehicleNo = document.getElementById('vehicleNumber').value;
    let ownerName = document.getElementById('ownerName').value;
    let ownerContact = document.getElementById('ownerContact').value;
    const responseDiv = document.getElementById('response');

    if (!type || !vehicleNo || !ownerName || !ownerContact) {
        responseDiv.innerHTML = `
            <div class="alert alert-error">
                ❌ Please fill in all required fields.
            </div>
        `;
        return;
    }

    //remove trailing and leading and in-between spaces
    vehicleNo = vehicleNo.trim().replace(/\s+/g, '');
    ownerName = ownerName.trim().replace(/\s+/g, ' ');
    ownerContact = ownerContact.trim().replace(/\s+/g, '');

    //validate details
    if (!validateVehicleDetails(vehicleNo, ownerName, ownerContact)) {
        responseDiv.innerHTML = `
            <div class="alert alert-error">
                ❌ Please provide valid vehicle and personal details.
            </div>
        `;
        return;
    }

    // Show loading message
    responseDiv.innerHTML = `
        <div class="alert alert-info">
            ⏳ Booking your parking spot...
        </div>
    `;

    //creating the bookRequest object
    const bookRequest = {
        type: type,
        vehicleNo: vehicleNo,
        ownerName: ownerName,
        ownerContact: ownerContact
    };

    // Log the request for debugging
    console.log('Parking request:', bookRequest);

    try {
        const response = await fetch(baseUrl + 'park', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookRequest)
        });

        if (response.ok) {
            const result = await response.text();
            try {
                const ticket = JSON.parse(result);
                console.log('Received ticket:', ticket); // Debug log to see the full ticket structure
                
                // Extract date and time from separate backend fields
                let formattedEntryDate = 'N/A';
                let formattedEntryTime = 'N/A';
                
                // Your backend returns separate entryDate and entryTime fields
                if (ticket.entryDate) {
                    try {
                        const entryDate = new Date(ticket.entryDate);
                        if (!isNaN(entryDate.getTime())) {
                            formattedEntryDate = entryDate.toLocaleDateString();
                        } else {
                            formattedEntryDate = ticket.entryDate;
                        }
                    } catch (e) {
                        formattedEntryDate = ticket.entryDate;
                    }
                }
                
                if (ticket.entryTime) {
                    formattedEntryTime = ticket.entryTime; // Use as-is since it's already formatted as time
                }
                
                // Extract parking spot info
                const parkingSpotInfo = ticket.parkingSpot ? 
                    `${ticket.parkingSpot.type.toUpperCase()}-${ticket.parkingSpot.location}` : 
                    'Assigned';
                
                // Display success message with all ticket details
                responseDiv.innerHTML = `
                    <div class="alert alert-success">
                        <h4>✅ Parking Spot Booked Successfully!</h4>
                        <div class="ticket-details" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; margin: 15px 0; color: #212529;">
                            <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Ticket ID:</strong> <span id="successTicketId" style="color: #000; font-family: monospace; font-size: 1.1em;">${ticket.id || 'N/A'}</span></p>
                            <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Vehicle Number:</strong> <span style="color: #000;">${ticket.vehicleNo || 'N/A'}</span></p>
                            <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Owner Name:</strong> <span style="color: #000;">${ticket.ownerName || 'N/A'}</span></p>
                            <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Owner Contact:</strong> <span style="color: #000;">${ticket.ownerContact || 'N/A'}</span></p>
                            <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Entry Date:</strong> <span style="color: #000;">${formattedEntryDate}</span></p>
                            <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Entry Time:</strong> <span style="color: #000;">${formattedEntryTime}</span></p>
                            <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Parking Spot:</strong> <span style="color: #000; font-weight: 600;">${parkingSpotInfo}</span></p>
                        </div>
                        <div class="ticket-actions" style="margin-top: 15px;">
                            <button onclick="printTicket('${ticket.id}', '${ticket.vehicleNo}', '${ticket.ownerName}', '${ticket.ownerContact}', '${formattedEntryDate}', '${formattedEntryTime}', '${parkingSpotInfo}')" 
                                    class="btn btn-secondary" style="margin-right: 10px;">
                                🖨️ Print Ticket
                            </button>
                            <button onclick="resetBookingForm()" class="btn btn-outline">
                                🔄 Book Another Vehicle
                            </button>
                        </div>
                        
                        <!-- Edit Details Section -->
                        <div class="edit-section" style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <h5 style="margin: 0; color: #856404;">Need to update vehicle details?</h5>
                                <button onclick="toggleEditForm('${ticket.id}')" id="editToggleBtn" class="btn btn-small" style="padding: 5px 10px; font-size: 0.9em;">
                                    ✏️ Edit Details
                                </button>
                            </div>
                            <div id="editForm-${ticket.id}" style="display: none; margin-top: 15px;">
                                <form id="updateForm-${ticket.id}" style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                    <div>
                                        <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #495057;">Vehicle Type:</label>
                                        <select id="editVehicleType-${ticket.id}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                                            <option value="MINI" ${ticket.parkingSpot && ticket.parkingSpot.type === 'MINI' ? 'selected' : ''}>Mini Vehicle</option>
                                            <option value="COMPACT" ${ticket.parkingSpot && ticket.parkingSpot.type === 'COMPACT' ? 'selected' : ''}>Compact Vehicle</option>
                                            <option value="LARGE" ${ticket.parkingSpot && ticket.parkingSpot.type === 'LARGE' ? 'selected' : ''}>Large Vehicle</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #495057;">Vehicle Number:</label>
                                        <input type="text" id="editVehicleNumber-${ticket.id}" value="${ticket.vehicleNo || ''}" 
                                               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                                    </div>
                                    <div>
                                        <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #495057;">Owner Name:</label>
                                        <input type="text" id="editOwnerName-${ticket.id}" value="${ticket.ownerName || ''}" 
                                               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                                    </div>
                                    <div>
                                        <label style="display: block; margin-bottom: 5px; font-weight: 500; color: #495057;">Owner Contact:</label>
                                        <input type="tel" id="editOwnerContact-${ticket.id}" value="${ticket.ownerContact || ''}" 
                                               style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;" required>
                                    </div>
                                </form>
                                <div style="margin-top: 15px; display: flex; gap: 10px;">
                                    <button onclick="updateVehicleDetails('${ticket.id}')" class="btn btn-primary" style="flex: 1;">
                                        💾 Update Details
                                    </button>
                                    <button onclick="toggleEditForm('${ticket.id}')" class="btn btn-outline" style="flex: 1;">
                                        ❌ Cancel
                                    </button>
                                </div>
                                <div id="updateResponse-${ticket.id}" style="margin-top: 10px;"></div>
                            </div>
                        </div>
                        
                        <p style="margin-top: 10px; font-size: 0.9rem; color: #495057; font-weight: 500;">
                            <strong>Important:</strong> Please save your ticket ID for vehicle retrieval.
                        </p>
                    </div>
                `;
            } catch (e) {
                // If response is not JSON, show the text response
                responseDiv.innerHTML = `
                    <div class="alert alert-success">
                        <h4>✅ Vehicle Parked Successfully!</h4>
                        <p>${result}</p>
                        <button onclick="resetBookingForm()" class="btn btn-outline" style="margin-top: 10px;">
                            🔄 Book Another Vehicle
                        </button>
                    </div>
                `;
            }
            loadParkingStatus(); // Refresh parking status
        } else {
            const errorText = await response.text();
            responseDiv.innerHTML = `
                <div class="alert alert-error">
                    <h4>❌ Booking Failed</h4>
                    <p>${errorText}</p>
                    <button onclick="document.getElementById('response').innerHTML = ''" class="btn btn-outline" style="margin-top: 10px;">
                        🔄 Try Again
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error parking vehicle:', error);
        responseDiv.innerHTML = `
            <div class="alert alert-error">
                <h4>❌ Network Error</h4>
                <p>An error occurred while booking the parking spot. Please check your connection and try again.</p>
                <button onclick="document.getElementById('response').innerHTML = ''" class="btn btn-outline" style="margin-top: 10px;">
                    🔄 Try Again
                </button>
            </div>
        `;
    }
}

// Function to print ticket
function printTicket(ticketId, vehicleNo, ownerName, ownerContact, entryDate, entryTime, parkingSpot) {
    const printContent = `
        ================================
              QUICKPARK TICKET
        ================================
        Ticket ID: ${ticketId}
        Vehicle Number: ${vehicleNo}
        Owner Name: ${ownerName}
        Owner Contact: ${ownerContact}
        Entry Date: ${entryDate}
        Entry Time: ${entryTime}
        Parking Spot: ${parkingSpot}
        ================================
        Please keep this ticket safe!
        Present this ticket when exiting.
        ================================
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Parking Ticket - ${ticketId}</title>
                <style>
                    body { 
                        font-family: monospace; 
                        white-space: pre-line; 
                        padding: 20px; 
                        text-align: center; 
                        margin: 0;
                        font-size: 14px;
                    }
                    @media print { 
                        body { margin: 0; padding: 10px; font-size: 12px; } 
                    }
                </style>
            </head>
            <body>
                ${printContent}
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 1000);
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Function to print updated ticket
function printUpdatedTicket(ticketId, vehicleNo, ownerName, ownerContact, entryDate, entryTime, parkingSpot) {
    const printContent = `
        ================================
           QUICKPARK UPDATED TICKET
        ================================
        Ticket ID: ${ticketId}
        Vehicle Number: ${vehicleNo}
        Owner Name: ${ownerName}
        Owner Contact: ${ownerContact}
        Entry Date: ${entryDate}
        Entry Time: ${entryTime}
        Parking Spot: ${parkingSpot}
        ================================
        *** UPDATED INFORMATION ***
        This ticket contains updated details.
        Please keep this ticket safe!
        Present this ticket when exiting.
        ================================
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Updated Parking Ticket - ${ticketId}</title>
                <style>
                    body { 
                        font-family: monospace; 
                        white-space: pre-line; 
                        padding: 20px; 
                        text-align: center; 
                        margin: 0;
                        font-size: 14px;
                    }
                    @media print { 
                        body { margin: 0; padding: 10px; font-size: 12px; } 
                    }
                </style>
            </head>
            <body>
                ${printContent}
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 1000);
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

// Function to reset the booking form
function resetBookingForm() {
    document.getElementById('parkForm').reset();
    document.getElementById('response').innerHTML = '';
}

// Function to toggle edit form visibility
function toggleEditForm(ticketId) {
    const editForm = document.getElementById(`editForm-${ticketId}`);
    const toggleBtn = document.getElementById('editToggleBtn');
    
    if (editForm.style.display === 'none') {
        editForm.style.display = 'block';
        toggleBtn.textContent = '❌ Cancel Edit';
        toggleBtn.className = 'btn btn-small btn-outline';
    } else {
        editForm.style.display = 'none';
        toggleBtn.textContent = '✏️ Edit Details';
        toggleBtn.className = 'btn btn-small';
        // Clear any update responses
        document.getElementById(`updateResponse-${ticketId}`).innerHTML = '';
    }
}

// Function to update vehicle details
async function updateVehicleDetails(ticketId) {
    let type = document.getElementById(`editVehicleType-${ticketId}`).value;
    let vehicleNo = document.getElementById(`editVehicleNumber-${ticketId}`).value;
    let ownerName = document.getElementById(`editOwnerName-${ticketId}`).value;
    let ownerContact = document.getElementById(`editOwnerContact-${ticketId}`).value;
    const responseDiv = document.getElementById(`updateResponse-${ticketId}`);

    if (!type || !vehicleNo || !ownerName || !ownerContact) {
        responseDiv.innerHTML = `
            <div class="alert alert-error" style="padding: 10px; font-size: 0.9em;">
                ❌ Please fill in all required fields.
            </div>
        `;
        return;
    }

    // remove trailing and leading and in-between spaces
    vehicleNo = vehicleNo.trim().replace(/\s+/g, '');
    ownerName = ownerName.trim().replace(/\s+/g, ' ');
    ownerContact = ownerContact.trim().replace(/\s+/g, '');

    if (!validateVehicleDetails(vehicleNo, ownerName, ownerContact)) {
        responseDiv.innerHTML = `
            <div class="alert alert-error" style="padding: 10px; font-size: 0.9em;">
                ❌ Please provide valid vehicle and personal details.
            </div>
        `;
        return;
    }

    // Show loading message
    responseDiv.innerHTML = `
        <div class="alert alert-info" style="padding: 10px; font-size: 0.9em;">
            ⏳ Updating vehicle details...
        </div>
    `;

    // Create the update request object (same structure as parking request, without ticketId in body)
    const updateRequest = {
        type: type,
        vehicleNo: vehicleNo,
        ownerName: ownerName,
        ownerContact: ownerContact
    };

    console.log('Update request:', updateRequest);
    console.log('Ticket ID (path param):', ticketId);

    try {
        // Log the HTTP method and URL being called
        const apiUrl = baseUrl + `update-ticket/${ticketId}`;
        // console.log('Making API call:');
        // console.log('Method: PUT');
        // console.log('URL:', apiUrl);
        // console.log('Full URL:', `http://localhost:8080/quickpark/update-ticket/${ticketId}`);
        
        // Use the backend endpoint with ticketId as path parameter
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updateRequest)
        });

        console.log('Response received:');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        if (response.ok) {
            const result = await response.text();
            try {
                // Try to parse the result as JSON to get the updated ticket
                const updatedTicket = JSON.parse(result);
                console.log('Updated ticket received:', updatedTicket);
                
                // Extract updated date and time
                let formattedEntryDate = 'N/A';
                let formattedEntryTime = 'N/A';
                
                if (updatedTicket.entryDate) {
                    try {
                        const entryDate = new Date(updatedTicket.entryDate);
                        if (!isNaN(entryDate.getTime())) {
                            formattedEntryDate = entryDate.toLocaleDateString();
                        } else {
                            formattedEntryDate = updatedTicket.entryDate;
                        }
                    } catch (e) {
                        formattedEntryDate = updatedTicket.entryDate;
                    }
                }
                
                if (updatedTicket.entryTime) {
                    formattedEntryTime = updatedTicket.entryTime;
                }
                
                // Extract updated parking spot info
                const updatedParkingSpotInfo = updatedTicket.parkingSpot ? 
                    `${updatedTicket.parkingSpot.type.toUpperCase()}-${updatedTicket.parkingSpot.location}` : 
                    'Assigned';
                
                responseDiv.innerHTML = `
                    <div class="alert alert-success" style="padding: 10px; font-size: 0.9em;">
                        <h5 style="margin: 0 0 5px 0;">✅ Details Updated Successfully!</h5>
                        <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 12px; margin: 10px 0; color: #000;">
                            <p style="margin: 5px 0; font-size: 0.85em;"><strong>Updated Ticket ID:</strong> ${updatedTicket.id || ticketId}</p>
                            <p style="margin: 5px 0; font-size: 0.85em;"><strong>Vehicle Number:</strong> ${updatedTicket.vehicleNo || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 0.85em;"><strong>Owner Name:</strong> ${updatedTicket.ownerName || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 0.85em;"><strong>Owner Contact:</strong> ${updatedTicket.ownerContact || 'N/A'}</p>
                            <p style="margin: 5px 0; font-size: 0.85em;"><strong>Entry Date:</strong> ${formattedEntryDate}</p>
                            <p style="margin: 5px 0; font-size: 0.85em;"><strong>Entry Time:</strong> ${formattedEntryTime}</p>
                            <p style="margin: 5px 0; font-size: 0.85em;"><strong>Parking Spot:</strong> ${updatedParkingSpotInfo}</p>
                        </div>
                        <div style="display: flex; gap: 8px; margin-top: 10px;">
                            <button onclick="printUpdatedTicket('${updatedTicket.id || ticketId}', '${updatedTicket.vehicleNo}', '${updatedTicket.ownerName}', '${updatedTicket.ownerContact}', '${formattedEntryDate}', '${formattedEntryTime}', '${updatedParkingSpotInfo}')" 
                                    class="btn btn-secondary" style="flex: 1; padding: 6px 10px; font-size: 0.8em;">
                                🖨️ Print Updated Ticket
                            </button>
                            <button onclick="location.reload()" class="btn btn-small" style="flex: 1; padding: 6px 10px; font-size: 0.8em;">
                                🔄 Refresh Page
                            </button>
                        </div>
                    </div>
                `;
            } catch (e) {
                // If response is not JSON, show simple success message
                responseDiv.innerHTML = `
                    <div class="alert alert-success" style="padding: 10px; font-size: 0.9em;">
                        <h5 style="margin: 0 0 5px 0;">✅ Details Updated Successfully!</h5>
                        <p style="margin: 0; font-size: 0.85em;">${result}</p>
                        <button onclick="location.reload()" class="btn btn-small" style="margin-top: 8px; padding: 4px 8px; font-size: 0.8em;">
                            🔄 Refresh Page
                        </button>
                    </div>
                `;
            }
            
            // Update the displayed ticket information
            updateDisplayedTicketInfo(ticketId, updateRequest);
            
        } else {
            const errorText = await response.text();
            responseDiv.innerHTML = `
                <div class="alert alert-error" style="padding: 10px; font-size: 0.9em;">
                    <h5 style="margin: 0 0 5px 0;">❌ Update Failed</h5>
                    <p style="margin: 0; font-size: 0.85em;">${errorText}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error updating vehicle details:', error);
        responseDiv.innerHTML = `
            <div class="alert alert-error" style="padding: 10px; font-size: 0.9em;">
                <h5 style="margin: 0 0 5px 0;">❌ Network Error</h5>
                <p style="margin: 0; font-size: 0.85em;">Failed to update details. Please check your connection and try again.</p>
            </div>
        `;
    }
}

// Function to update the displayed ticket information after successful edit
function updateDisplayedTicketInfo(ticketId, newDetails) {
    // Update the ticket details display with new information
    const ticketDetails = document.querySelector('.ticket-details');
    if (ticketDetails) {
        // You can update specific elements or show a message that page refresh is needed
        const refreshMessage = document.createElement('div');
        refreshMessage.style.cssText = 'background: #d4edda; border: 1px solid #c3e6cb; padding: 8px; margin-top: 10px; border-radius: 4px; font-size: 0.9em; color: #155724;';
        refreshMessage.innerHTML = `
            <strong>📝 Details Updated:</strong> The information has been updated in the system. 
            <button onclick="location.reload()" style="margin-left: 10px; padding: 2px 6px; font-size: 0.8em; background: #28a745; color: white; border: none; border-radius: 3px; cursor: pointer;">
                Refresh to see changes
            </button>
        `;
        ticketDetails.appendChild(refreshMessage);
    }
}

// Unpark Vehicle Functions

// Add form submission handler for unpark form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const unparkForm = document.getElementById('unparkForm');
    if (unparkForm) {
        unparkForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            unparkVehicle(); // Call our custom function
        });
    }
});

async function unparkVehicle() {
    const ticketId = document.getElementById('ticketId').value.trim();
    const responseDiv = document.getElementById('unparkResponse');

    if (!ticketId || ticketId.length !== 10) {
        responseDiv.innerHTML = `
            <div class="alert alert-error">
                ❌ Please enter a valid ticket ID.
            </div>
        `;
        return;
    }

    // Show loading message
    responseDiv.innerHTML = `
        <div class="alert alert-info">
            ⏳ Processing unpark request...
        </div>
    `;

    console.log('Unpark request for ticket ID:', ticketId);

    try {
        // Log the HTTP method and URL being called
        const apiUrl = baseUrl + 'unpark';
        console.log('Making unpark API call:');
        console.log('Method: DELETE');
        // console.log('URL:', apiUrl);
        // console.log('Full URL:', `http://localhost:8080/quickpark/unpark`);
        console.log('Request body:', ticketId);

        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: ticketId
        });

        console.log('Unpark response received:');
        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        if (response.ok) {
            const result = await response.text();
            try {
                const freeRequest = JSON.parse(result);
                console.log('Received unpark data:', freeRequest);
                
                // Convert total time from minutes to hours and minutes
                const totalMinutes = freeRequest.totalTime || 0;
                const hours = Math.floor(totalMinutes / 60);
                const minutes = totalMinutes % 60;
                const formattedDuration = `${hours}h ${minutes}m`;
                
                // Display the bill
                displayUnparkBill(freeRequest, formattedDuration);
                
            } catch (e) {
                // If response is not JSON, show the text response
                responseDiv.innerHTML = `
                    <div class="alert alert-error">
                        <h4>❌ Unpark Response Error</h4>
                        <p>${result}</p>
                        <button onclick="document.getElementById('unparkResponse').innerHTML = ''" class="btn btn-outline" style="margin-top: 10px;">
                            🔄 Try Again
                        </button>
                    </div>
                `;
            }
        } else {
            const errorText = await response.text();
            responseDiv.innerHTML = `
                <div class="alert alert-error">
                    <h4>❌ Unpark Failed</h4>
                    <p>${errorText}</p>
                    <button onclick="document.getElementById('unparkResponse').innerHTML = ''" class="btn btn-outline" style="margin-top: 10px;">
                        🔄 Try Again
                    </button>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error unparking vehicle:', error);
        responseDiv.innerHTML = `
            <div class="alert alert-error">
                <h4>❌ Network Error</h4>
                <p>An error occurred while processing the unpark request. Please check your connection and try again.</p>
                <button onclick="document.getElementById('unparkResponse').innerHTML = ''" class="btn btn-outline" style="margin-top: 10px;">
                    🔄 Try Again
                </button>
            </div>
        `;
    }
}

function displayUnparkBill(freeRequest, formattedDuration) {
    const responseDiv = document.getElementById('unparkResponse');
    
    responseDiv.innerHTML = `
        <div class="alert alert-success">
            <h4>✅ Vehicle Unparked Successfully!</h4>
            <div class="bill-details" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 15px 0; color: #212529;">
                <div style="text-align: center; margin-bottom: 15px; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
                    <h3 style="margin: 0; color: #28a745;">🧾 QUICKPARK BILL</h3>
                    <p style="margin: 5px 0; font-size: 0.9em; color: #666;">Thank you for using QuickPark!</p>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div>
                        <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Ticket ID:</strong></p>
                        <p style="margin: 0; color: #000; font-family: monospace; font-size: 1.1em;">${freeRequest.ticketId || 'N/A'}</p>
                    </div>
                    <div>
                        <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Vehicle Number:</strong></p>
                        <p style="margin: 0; color: #000;">${freeRequest.vehicleNo || 'N/A'}</p>
                    </div>
                    <div>
                        <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Owner Name:</strong></p>
                        <p style="margin: 0; color: #000;">${freeRequest.ownerName || 'N/A'}</p>
                    </div>
                    <div>
                        <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Contact Number:</strong></p>
                        <p style="margin: 0; color: #000;">${freeRequest.ownerContact || 'N/A'}</p>
                    </div>
                    <div>
                        <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Vehicle Type:</strong></p>
                        <p style="margin: 0; color: #000; text-transform: capitalize;">${freeRequest.type || 'N/A'}</p>
                    </div>
                    <div>
                        <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong style="color: #495057;">Parking Duration:</strong></p>
                        <p style="margin: 0; color: #000; font-weight: 600;">${formattedDuration}</p>
                    </div>
                </div>
                
                <div style="background: #e9ecef; padding: 15px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0; color: #000; font-size: 1.2em; font-weight: 600;">
                        <strong style="color: #495057;">Total Amount:</strong> 
                        <span style="color: #28a745; font-size: 1.3em;">₹${freeRequest.totalCost || 0}</span>
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">
                        ${freeRequest.totalCost === 0 ? '🎉 Free parking (under 30 minutes)' : 'Payment due on exit'}
                    </p>
                </div>
            </div>
            
            <div class="bill-actions" style="margin-top: 20px; display: flex; gap: 10px;">
                <button onclick="printBill('${freeRequest.ticketId}', '${freeRequest.vehicleNo}', '${freeRequest.ownerName}', '${freeRequest.ownerContact}', '${freeRequest.type}', '${formattedDuration}', ${freeRequest.totalCost})" 
                        class="btn btn-secondary" style="flex: 1;">
                    🖨️ Print Bill
                </button>
                <button onclick="resetUnparkForm()" class="btn btn-outline" style="flex: 1;">
                    🔄 Unpark Another Vehicle
                </button>
                <button onclick="window.location.href='index.html'" class="btn btn-primary" style="flex: 1;">
                    🏠 Back to Home
                </button>
            </div>
            
            <p style="margin-top: 15px; font-size: 0.9rem; color: #495057; font-weight: 500; text-align: center;">
                <strong>Thank you for choosing QuickPark!</strong><br>
                Have a safe journey ahead! 🚗
            </p>
        </div>
    `;
}

function printBill(ticketId, vehicleNo, ownerName, ownerContact, vehicleType, duration, totalCost) {
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    const printContent = `
        ================================
             QUICKPARK BILL
        ================================
        Date: ${currentDate}
        Time: ${currentTime}
        
        Ticket ID: ${ticketId}
        Vehicle Number: ${vehicleNo}
        Owner Name: ${ownerName}
        Contact Number: ${ownerContact}
        Vehicle Type: ${vehicleType.charAt(0).toUpperCase() + vehicleType.slice(1)}
        
        --------------------------------
        Parking Duration: ${duration}
        Total Amount: ₹${totalCost}
        --------------------------------
        
        ${totalCost === 0 ? '🎉 FREE PARKING' : 'Payment Status: Due on Exit'}
        
        ================================
        Thank you for using QuickPark!
        Have a safe journey ahead! 🚗
        ================================
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>QuickPark Bill - ${ticketId}</title>
                <style>
                    body { 
                        font-family: monospace; 
                        white-space: pre-line; 
                        padding: 20px; 
                        text-align: center; 
                        margin: 0;
                        font-size: 14px;
                        line-height: 1.4;
                    }
                    @media print { 
                        body { margin: 0; padding: 10px; font-size: 12px; } 
                    }
                </style>
            </head>
            <body>
                ${printContent}
                <script>
                    window.onload = function() {
                        window.print();
                        setTimeout(function() {
                            window.close();
                        }, 1000);
                    };
                </script>
            </body>
        </html>
    `);
    printWindow.document.close();
}

function resetUnparkForm() {
    document.getElementById('unparkForm').reset();
    document.getElementById('unparkResponse').innerHTML = '';
}

// Parking Status Functions

// Helper function to safely update element content
function updateElementIfExists(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = value;
        return true;
    }
    console.log(`Element ${elementId} not found`);
    return false;
}

// Helper function to get status class based on availability percentage
function getStatusClass(availabilityPercentage) {
    if (availabilityPercentage > 50) return 'available';
    if (availabilityPercentage > 20) return 'limited';
    return 'full';
}

// Helper function to get status text
function getStatusText(availabilityPercentage) {
    if (availabilityPercentage > 50) return 'Available';
    if (availabilityPercentage > 20) return 'Limited';
    return 'Full';
}

// Helper function to get status class based on occupancy percentage (for progress bars)
function getOccupancyStatusClass(occupancyPercentage) {
    if (occupancyPercentage < 50) return 'available';  // Low occupancy = green
    if (occupancyPercentage < 80) return 'limited';    // Medium occupancy = yellow
    return 'full';                                     // High occupancy = red
}

// Update detailed availability display for status page
function updateDetailedAvailability(type, available, total) {
    const occupied = total - available;
    const availabilityPercentage = (available / total) * 100;
    const occupancyPercentage = (occupied / total) * 100;
    const occupancyRate = occupancyPercentage.toFixed(1);

    console.log(`Updating ${type}: available=${available}, occupied=${occupied}, occupancyPercentage=${occupancyRate}%`);

    // Update main status cards
    updateElementIfExists(`${type}Available`, available);
    updateElementIfExists(`${type}Occupied`, occupied);
    updateElementIfExists(`${type}Percentage`, occupancyRate + '%'); // This shows occupancy percentage

    // Update progress bars (should show occupancy, not availability)
    const progressBar = document.getElementById(`${type}Progress`);
    if (progressBar) {
        progressBar.style.width = occupancyPercentage + '%';
        progressBar.className = `progress-fill ${getOccupancyStatusClass(occupancyPercentage)}`;
        console.log(`Progress bar ${type}: width=${occupancyPercentage}%, class=${getOccupancyStatusClass(occupancyPercentage)}`);
    } else {
        console.log(`Progress bar element ${type}Progress not found`);
    }

    // Update status indicators (should be based on availability for "Available/Limited/Full" status)
    const indicator = document.getElementById(`${type}Indicator`);
    if (indicator) {
        indicator.className = `status-indicator ${getStatusClass(availabilityPercentage)}`;
        console.log(`Status indicator ${type}: class=${getStatusClass(availabilityPercentage)}`);
    } else {
        console.log(`Status indicator element ${type}Indicator not found`);
    }
    
    // Update status text
    const statusText = document.getElementById(`${type}StatusText`);
    if (statusText) {
        statusText.textContent = getStatusText(availabilityPercentage);
        console.log(`Status text ${type}: ${getStatusText(availabilityPercentage)}`);
    } else {
        console.log(`Status text element ${type}StatusText not found`);
    }
}

// Load detailed parking status for status page
async function loadDetailedParkingStatus() {
    try {
        console.log('Loading detailed parking status...');
        const response = await fetch('http://localhost:8080/quickpark/free-parking-spots');
        const data = await response.json();
        console.log('Detailed parking status data:', data);

        // Update status page specific elements
        updateDetailedAvailability('mini', data.mini || 0, 50);
        updateDetailedAvailability('compact', data.compact || 0, 75);
        updateDetailedAvailability('large', data.large || 0, 25);

        // Update overview stats
        const totalSpots = 150;
        const totalAvailable = (data.mini || 0) + (data.compact || 0) + (data.large || 0);
        const occupiedSpots = totalSpots - totalAvailable;
        const occupancyRate = Math.round((occupiedSpots / totalSpots) * 100);

        // Update overview elements
        updateElementIfExists('totalSpots', totalSpots);
        updateElementIfExists('availableSpots', totalAvailable);
        updateElementIfExists('occupiedSpots', occupiedSpots);
        updateElementIfExists('occupancyRate', occupancyRate + '%');

        // Update last updated time
        const lastUpdated = new Date().toLocaleString();
        updateElementIfExists('lastUpdated', lastUpdated);

        console.log('Successfully updated all parking status data');

    } catch (error) {
        console.error('Error loading detailed parking status:', error);
        // Set fallback values for status page elements
        setFallbackValues();
    }
}

// Set fallback values when API fails
function setFallbackValues() {
    const fallbackElements = [
        'miniAvailable', 'compactAvailable', 'largeAvailable',
        'miniOccupied', 'compactOccupied', 'largeOccupied',
        'miniPercentage', 'compactPercentage', 'largePercentage',
        'availableSpots', 'occupiedSpots', 'occupancyRate',
        'lastUpdated'
    ];

    fallbackElements.forEach(elementId => {
        updateElementIfExists(elementId, '--');
    });

    // Update status text to show offline status
    updateElementIfExists('miniStatusText', 'Offline');
    updateElementIfExists('compactStatusText', 'Offline');
    updateElementIfExists('largeStatusText', 'Offline');
}

// Refresh status manually for status page
function refreshDetailedStatus() {
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        const originalText = refreshBtn.innerHTML;
        refreshBtn.style.opacity = '0.6';
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<span>🔄</span> Refreshing...';
    }

    loadDetailedParkingStatus().then(() => {
        setTimeout(() => {
            if (refreshBtn) {
                refreshBtn.style.opacity = '1';
                refreshBtn.disabled = false;
                refreshBtn.innerHTML = '<span>🔄</span> Refresh Status';
            }
        }, 1000);
    });
}

// Enable notifications function
function enableNotifications() {
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            new Notification("QuickPark Notifications", {
                body: "You will now receive notifications about parking updates!",
                icon: "🅿️"
            });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    new Notification("QuickPark Notifications", {
                        body: "You will now receive notifications about parking updates!",
                        icon: "🅿️"
                    });
                }
            });
        } else {
            alert("Please enable notifications in your browser settings to receive parking updates.");
        }
    } else {
        alert("Your browser doesn't support notifications.");
    }
}

// Initialize status page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the status page by looking for status-specific elements
    if (document.getElementById('miniProgress') || document.getElementById('compactProgress') || document.getElementById('largeProgress')) {
        console.log('Status page detected, loading detailed parking status...');
        loadDetailedParkingStatus();
        // Note: No auto-refresh - only manual refresh via button
    }
});

// Export functions for global access
window.loadDetailedParkingStatus = loadDetailedParkingStatus;
window.refreshDetailedStatus = refreshDetailedStatus;
window.enableNotifications = enableNotifications;

// Alias functions for compatibility with status.html (only on status page)
if (window.location.pathname.includes('status.html')) {
    window.loadStatus = loadDetailedParkingStatus;
    window.refreshStatus = refreshDetailedStatus;
}

// Admin Login Functions
function initializeAdminLogin() {
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            const errorDiv = document.getElementById('errorMessage');
            const successDiv = document.getElementById('successMessage');
            
            // Hide previous messages
            errorDiv.style.display = 'none';
            successDiv.style.display = 'none';
            
            // Basic validation
            if (!username || !password) {
                showError('Please enter both username and password.');
                return;
            }
            
            // Show loading message during authentication
            showSuccess('Validating credentials...');
            
            // Validate admin credentials using the API endpoint
            validateAdminCredentials(username, password);
        });
        
        // Clear error/success messages when user starts typing
        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');
        
        if (usernameInput) usernameInput.addEventListener('input', clearMessages);
        if (passwordInput) passwordInput.addEventListener('input', clearMessages);
    }
}

// Function to validate admin credentials using API
async function validateAdminCredentials(username, password) {
    try {
        // Call the admin validation API endpoint
        const apiUrl = `${baseUrl}admin/validate-admin/${encodeURIComponent(username)}/${encodeURIComponent(password)}`;
        console.log('Validating admin credentials');
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Admin validation response status:', response.status);
        
        if (response.ok) {
            const isValid = await response.json();
            console.log('Admin validation result:', isValid);
            
            if (isValid === true) {
                // Store login state
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminUsername', username);
                localStorage.setItem('adminLoginTime', new Date().toISOString());
                
                showSuccess('Login successful! Redirecting to dashboard...');
                
                // Redirect to admin dashboard page
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 1500);
            } else {
                showError('Invalid username or password. Please try again.');
            }
        } else {
            // Handle HTTP error responses
            const errorText = await response.text();
            console.error('Admin validation failed:', errorText);
            showError('Authentication failed. Please check your credentials and try again.');
        }
    } catch (error) {
        console.error('Error validating admin credentials:', error);
        showError('Network error. Please check your connection and try again.');
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }
}

function clearMessages() {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'none';
}

// Initialize admin login when page loads (only for admin-login.html)
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin-login.html')) {
        initializeAdminLogin();
    } else if (window.location.pathname.includes('admin.html')) {
        // Check authentication for admin dashboard
        if (checkAdminAuthentication()) {
            // Initialize admin dashboard navigation
            initializeAdminNavigation();
            // Load parking status for admin dashboard stats
            loadParkingStatus();
            // Initialize vehicle filtering (default to parked vehicles)
            filterVehicles();
            // Load revenue analytics data for the analytics section
            loadRevenueAnalytics();
        }
    }
    
    // Initialize mobile menu functionality
    initializeMobileMenu();
    
    // Initialize park form if it exists
    const parkForm = document.getElementById('parkForm');
    if (parkForm) {
        parkForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            parkVehicle(); // Call our custom function
        });
    }
    
    // Initialize unpark form if it exists
    const unparkForm = document.getElementById('unparkForm');
    if (unparkForm) {
        unparkForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Prevent default form submission
            unparkVehicle(); // Call our custom function
        });
    }
    
    // Check if we're on the status page by looking for status-specific elements
    if (document.getElementById('miniProgress') || document.getElementById('compactProgress') || document.getElementById('largeProgress')) {
        console.log('Status page detected, loading detailed parking status...');
        loadDetailedParkingStatus();
        // Note: No auto-refresh - only manual refresh via button
    }
});

// Initialize admin dashboard specific navigation
function initializeAdminNavigation() {
    // Handle admin navigation links properly
    const adminNavLinks = document.querySelectorAll('.nav-menu .nav-link[href^="#"]');
    adminNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    
    // Set initial active state
    const currentHash = window.location.hash.substring(1) || 'vehicles';
    updateActiveNavLink(currentHash);
}

// Mobile Menu Functions
function initializeMobileMenu() {
    // Close mobile menu when clicking on nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only close menu for on-page links (those starting with #)
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                scrollToSection(targetId);
            }
            closeMobileMenu();
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const navMenu = document.getElementById('navMenu');
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        
        if (navMenu && hamburgerMenu && 
            !navMenu.contains(e.target) && 
            !hamburgerMenu.contains(e.target) && 
            navMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Handle escape key to close menu
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    
    if (navMenu && hamburgerMenu) {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            navMenu.classList.add('active');
            hamburgerMenu.classList.add('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = 'hidden';
        }
    }
}

function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    
    if (navMenu && hamburgerMenu) {
        navMenu.classList.remove('active');
        hamburgerMenu.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        // Close mobile menu first
        closeMobileMenu();
        
        // Smooth scroll to section
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
        
        // Update active nav link
        updateActiveNavLink(sectionId);
    }
}

function updateActiveNavLink(activeSectionId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeSectionId}`) {
            link.classList.add('active');
        } else if (href.startsWith('#')) {
            link.classList.remove('active');
        }
    });
}

// Admin Logout Function
function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Clear any stored authentication data
        localStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminLoginTime');
        
        // Clear any cookies if they exist
        document.cookie = 'adminSession=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Show logout message
        const messageContainer = document.getElementById('messageContainer');
        if (messageContainer) {
            messageContainer.innerHTML = `
                <div class="success-message" style="display: block; margin: 20px; padding: 15px; background: #d4edda; color: #155724; border: 1px solid #c3e6cb; border-radius: 5px;">
                    ✅ Logged out successfully! Redirecting to login page...
                </div>
            `;
        }
        
        // Redirect to admin login page after a short delay
        setTimeout(() => {
            window.location.href = 'admin-login.html';
        }, 1500);
    }
}

// Admin Vehicle Management Functions

// Global variables to store vehicle data
let parkedVehiclesData = [];
let completedVehiclesData = [];

// Function to load parked vehicles data from API
async function loadParkedVehicles() {
    try {
        const response = await fetch(baseUrl + 'admin/active-vehicles');
        if (response.ok) {
            parkedVehiclesData = await response.json();
            console.log('Loaded parked vehicles');
            // Debug: Log the first vehicle to see its structure
            // if (parkedVehiclesData.length > 0) {
            //     console.log('First parked vehicle structure:', parkedVehiclesData[0]);
            //     console.log('Available properties:', Object.keys(parkedVehiclesData[0]));
            // }
            displayParkedVehicles(parkedVehiclesData);
        } else {
            console.error('Failed to load parked vehicles:', response.statusText);
            displayParkedVehiclesError();
        }
    } catch (error) {
        console.error('Error loading parked vehicles:', error);
        displayParkedVehiclesError();
    }
}

// Function to load completed vehicles data from API
async function loadCompletedVehicles() {
    try {
        const response = await fetch(baseUrl + 'admin/all-vehicles');
        if (response.ok) {
            const allVehicles = await response.json();
            // Filter only completed vehicles (those with exit time/date)
            completedVehiclesData = allVehicles.filter(vehicle => 
                vehicle.exitTime || vehicle.exitDate || vehicle.isCompleted || 
                vehicle.status === 'COMPLETED' || vehicle.status === 'EXITED'
            );
            console.log('Loaded completed vehicles:');
            // Debug: Log the first completed vehicle to see its structure
            // if (completedVehiclesData.length > 0) {
            //     console.log('First completed vehicle structure:', completedVehiclesData[0]);
            //     console.log('Available properties:', Object.keys(completedVehiclesData[0]));
            // }
            displayCompletedVehicles(completedVehiclesData);
        } else {
            console.error('Failed to load completed vehicles:', response.statusText);
            displayCompletedVehiclesError();
        }
    } catch (error) {
        console.error('Error loading completed vehicles:', error);
        displayCompletedVehiclesError();
    }
}

// Function to display parked vehicles in the table
function displayParkedVehicles(vehicles) {
    const tableBody = document.getElementById('parkedVehiclesBody');
    if (!tableBody) return;

    if (!vehicles || vehicles.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="no-data">No currently parked vehicles found</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = vehicles.map(vehicle => {
        const entryDate = vehicle.entryDate ? new Date(vehicle.entryDate).toLocaleDateString() : 'N/A';
        const entryTime = vehicle.entryTime || 'N/A';
        const parkingSpot = vehicle.parkingSpot ? 
            `${vehicle.parkingSpot.type}-${vehicle.parkingSpot.location}` : 'N/A';
        
        // Get vehicle type from parkingSpot.type
        const vehicleType = vehicle.parkingSpot?.type || 'N/A';
        
        // Calculate duration if entry time is available
        let duration = 'N/A';
        if (vehicle.entryDate && vehicle.entryTime) {
            try {
                const entryDateTime = new Date(`${vehicle.entryDate}T${vehicle.entryTime}`);
                const now = new Date();
                const diffMinutes = Math.floor((now - entryDateTime) / (1000 * 60));
                const hours = Math.floor(diffMinutes / 60);
                const minutes = diffMinutes % 60;
                duration = `${hours}h ${minutes}m`;
            } catch (e) {
                duration = 'N/A';
            }
        }

        return `
            <tr>
                <td>${vehicle.id || 'N/A'}</td>
                <td>${vehicle.vehicleNo || 'N/A'}</td>
                <td>${vehicle.ownerName || 'N/A'}</td>
                <td>${vehicle.ownerContact || 'N/A'}</td>
                <td>${vehicleType}</td>
                <td>${parkingSpot}</td>
                <td>${entryDate} ${entryTime}</td>
                <td>${duration}</td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="viewVehicleDetails('${vehicle.id}')">
                        👁️ View
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Function to display completed vehicles in the table
function displayCompletedVehicles(vehicles) {
    const tableBody = document.getElementById('completedVehiclesBody');
    if (!tableBody) return;

    if (!vehicles || vehicles.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="no-data">No completed vehicles found</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = vehicles.map(vehicle => {
        const entryDate = vehicle.entryDate ? new Date(vehicle.entryDate).toLocaleDateString() : 'N/A';
        const entryTime = vehicle.entryTime || 'N/A';
        const exitDate = vehicle.exitDate ? new Date(vehicle.exitDate).toLocaleDateString() : 'N/A';
        const exitTime = vehicle.exitTime || 'N/A';
        const parkingSpot = vehicle.parkingSpot ? 
            `${vehicle.parkingSpot.type}-${vehicle.parkingSpot.location}` : 'N/A';
        
        // Get vehicle type from parkingSpot.type
        const vehicleType = vehicle.parkingSpot?.type || 'N/A';
        
        // Calculate duration
        let duration = 'N/A';
        if (vehicle.totalTime) {
            const totalMinutes = vehicle.totalTime;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            duration = `${hours}h ${minutes}m`;
        } else if (vehicle.entryDate && vehicle.entryTime && vehicle.exitDate && vehicle.exitTime) {
            try {
                const entryDateTime = new Date(`${vehicle.entryDate}T${vehicle.entryTime}`);
                const exitDateTime = new Date(`${vehicle.exitDate}T${vehicle.exitTime}`);
                const diffMinutes = Math.floor((exitDateTime - entryDateTime) / (1000 * 60));
                const hours = Math.floor(diffMinutes / 60);
                const minutes = diffMinutes % 60;
                duration = `${hours}h ${minutes}m`;
            } catch (e) {
                duration = 'N/A';
            }
        }

        const cost = vehicle.totalCost !== undefined ? `₹${vehicle.totalCost}` : 'N/A';

        return `
            <tr>
                <td>${vehicle.id || 'N/A'}</td>
                <td>${vehicle.vehicleNo || 'N/A'}</td>
                <td>${vehicle.ownerName || 'N/A'}</td>
                <td>${vehicleType}</td>
                <td>${parkingSpot}</td>
                <td>${entryDate} ${entryTime}</td>
                <td>${exitDate} ${exitTime}</td>
                <td>${duration}</td>
                <td>${cost}</td>
            </tr>
        `;
    }).join('');
}

// Function to display error message for parked vehicles
function displayParkedVehiclesError() {
    const tableBody = document.getElementById('parkedVehiclesBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="error-row" style="color: #dc3545; padding: 20px; text-align: center;">
                    ❌ Failed to load parked vehicles. Please try refreshing.
                </td>
            </tr>
        `;
    }
}

// Function to display error message for completed vehicles
function displayCompletedVehiclesError() {
    const tableBody = document.getElementById('completedVehiclesBody');
    if (tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9" class="error-row" style="color: #dc3545; padding: 20px; text-align: center;">
                    ❌ Failed to load completed vehicles. Please try refreshing.
                </td>
            </tr>
        `;
    }
}

// Function to filter vehicles based on the selected option
function filterVehicles() {
    const filterValue = document.getElementById('vehicleFilter').value;
    const parkedSection = document.getElementById('parkedVehiclesSection');
    const completedSection = document.getElementById('completedVehiclesSection');

    if (!parkedSection || !completedSection) return;

    // Hide both sections first
    parkedSection.style.display = 'none';
    completedSection.style.display = 'none';

    // Show only the selected section
    if (filterValue === 'parked') {
        parkedSection.style.display = 'block';
        loadParkedVehicles(); // Load fresh data
    } else if (filterValue === 'completed') {
        completedSection.style.display = 'block';
        loadCompletedVehicles(); // Load fresh data
    }

    console.log(`Vehicle filter changed to: ${filterValue}`);
}

// Function to refresh vehicle data based on current filter
function refreshVehicleData() {
    const filterValue = document.getElementById('vehicleFilter').value;
    
    // Show loading message
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        const originalText = refreshBtn.innerHTML;
        refreshBtn.style.opacity = '0.6';
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '🔄 Refreshing...';
        
        // Reset button after operation
        setTimeout(() => {
            refreshBtn.style.opacity = '1';
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = originalText;
        }, 1500);
    }

    // Refresh based on current filter
    if (filterValue === 'parked') {
        loadParkedVehicles();
    } else if (filterValue === 'completed') {
        loadCompletedVehicles();
    }

    console.log(`Refreshing vehicle data for filter: ${filterValue}`);
}

// Function to view vehicle details (placeholder)
function viewVehicleDetails(vehicleId) {
    const vehicle = parkedVehiclesData.find(v => v.id === vehicleId);
    if (vehicle) {
        alert(`Vehicle Details:\n\nTicket ID: ${vehicle.id}\nVehicle No: ${vehicle.vehicleNo}\nOwner: ${vehicle.ownerName}\nContact: ${vehicle.ownerContact}\nType: ${vehicle.type}\nEntry: ${vehicle.entryDate} ${vehicle.entryTime}`);
    } else {
        alert('Vehicle details not found.');
    }
}

// Function to edit vehicle details (placeholder)
function editVehicleDetails(vehicleId) {
    alert(`Edit functionality for vehicle ${vehicleId} will be implemented soon.`);
}

// Function to check admin authentication
function checkAdminAuthentication() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Access denied. Please login as admin first.');
        window.location.href = 'admin-login.html';
        return false;
    }
    return true;
}

// Initialize admin dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('admin-login.html')) {
        initializeAdminLogin();
    } else if (window.location.pathname.includes('admin.html')) {
        // Check authentication for admin dashboard
        if (checkAdminAuthentication()) {
            // Initialize admin dashboard navigation
            initializeAdminNavigation();
            // Load parking status for admin dashboard stats
            loadParkingStatus();
            // Initialize vehicle filtering (default to parked vehicles)
            filterVehicles();
        }
    }
    
    // Initialize mobile menu functionality
    initializeMobileMenu();
});

// Check if admin is logged in (for admin dashboard page)
function checkAdminAuthentication() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const currentPage = window.location.pathname;
    
    //Only check authentication on admin.html page
    if (currentPage.includes('admin.html') && !isLoggedIn) {
        // Redirect to login page if not authenticated
        window.location.href = 'admin-login.html';
        return false;
    }
    
    return true;
}

// Gate Management Functions

// Global variables for gate data
let activeGatesData = [];
let inactiveGatesData = [];

// Function to toggle add gate form visibility
function toggleAddGateForm() {
    const form = document.getElementById('addGateForm');
    const editForm = document.getElementById('editGateForm');
    
    // Hide edit form if open
    editForm.style.display = 'none';
    
    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
        resetGateForm();
    }
}

// Function to reset the add gate form
function resetGateForm() {
    document.getElementById('gateForm').reset();
    document.getElementById('addGateResponse').innerHTML = '';
}

// Function to add a new gate
async function addNewGate(event) {
    event.preventDefault();
    
    const gateId = document.getElementById('gateId').value.trim();
    const gateName = document.getElementById('gateName').value.trim();
    const gateType = document.getElementById('gateType').value;
    const guardName = document.getElementById('guardName').value.trim();
    const gateStatus = document.getElementById('gateStatus').value === 'true';
    const responseDiv = document.getElementById('addGateResponse');

    if (!gateId || !gateName || !gateType || !guardName) {
        responseDiv.innerHTML = `
            <div class="alert alert-error">
                ❌ Please fill in all required fields.
            </div>
        `;
        return;
    }

    // Show loading message
    responseDiv.innerHTML = `
        <div class="alert alert-info">
            ⏳ Adding gate...
        </div>
    `;

    const gateData = {
        id: gateId,
        name: gateName,
        type: gateType,
        guardName: guardName,
        status: gateStatus
    };

    console.log('Adding gate:', gateData);

    try {
        const response = await fetch(baseUrl + 'admin/addGate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gateData)
        });

        if (response.ok) {
            const result = await response.json();
            responseDiv.innerHTML = `
                <div class="alert alert-success">
                    <h4>✅ Gate Added Successfully!</h4>
                    <p><strong>Gate ID:</strong> ${result.id}</p>
                    <p><strong>Name:</strong> ${result.name}</p>
                    <p><strong>Type:</strong> ${result.type}</p>
                    <p><strong>Guard:</strong> ${result.guardName}</p>
                    <p><strong>Status:</strong> ${result.status ? 'Active' : 'Inactive'}</p>
                </div>
            `;
            
            // Reset form after successful addition
            document.getElementById('gateForm').reset();
            
            // Refresh any loaded gate data
            refreshGateData();
            
        } else {
            const errorText = await response.text();
            responseDiv.innerHTML = `
                <div class="alert alert-error">
                    <h4>❌ Failed to Add Gate</h4>
                    <p>${errorText}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error adding gate:', error);
        responseDiv.innerHTML = `
            <div class="alert alert-error">
                <h4>❌ Network Error</h4>
                <p>Failed to add gate. Please check your connection and try again.</p>
            </div>
        `;
    }
}

// Function to load active gates
async function loadActiveGates() {
    const section = document.getElementById('activeGatesSection');
    const tableBody = document.getElementById('activeGatesBody');
    
    // Show section and loading message
    section.style.display = 'block';
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="loading-row">⏳ Loading active gates...</td>
        </tr>
    `;

    try {
        const response = await fetch(baseUrl + 'admin/active-gates');
        if (response.ok) {
            activeGatesData = await response.json();
            console.log('Loaded active gates:', activeGatesData);
            displayActiveGates(activeGatesData);
        } else {
            console.error('Failed to load active gates:', response.statusText);
            displayActiveGatesError();
        }
    } catch (error) {
        console.error('Error loading active gates:', error);
        displayActiveGatesError();
    }
}

// Function to load inactive gates
async function loadInactiveGates() {
    const section = document.getElementById('inactiveGatesSection');
    const tableBody = document.getElementById('inactiveGatesBody');
    
    // Show section and loading message
    section.style.display = 'block';
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="loading-row">⏳ Loading inactive gates...</td>
        </tr>
    `;

    try {
        const response = await fetch(baseUrl + 'admin/inactive-gates');
        if (response.ok) {
            inactiveGatesData = await response.json();
            console.log('Loaded inactive gates:', inactiveGatesData);
            displayInactiveGates(inactiveGatesData);
        } else {
            console.error('Failed to load inactive gates:', response.statusText);
            displayInactiveGatesError();
        }
    } catch (error) {
        console.error('Error loading inactive gates:', error);
        displayInactiveGatesError();
    }
}

// Function to display active gates in the table
function displayActiveGates(gates) {
    const tableBody = document.getElementById('activeGatesBody');
    
    if (!gates || gates.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">No active gates found</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = gates.map(gate => `
        <tr>
            <td>${gate.id || 'N/A'}</td>
            <td>${gate.name || 'N/A'}</td>
            <td>${gate.type || 'N/A'}</td>
            <td>${gate.guardName || 'N/A'}</td>
            <td><span class="status-badge status-active">Active</span></td>
            <td>
                <button class="btn btn-small btn-primary" onclick="viewGateDetails('${gate.id}')">
                    👁️ View
                </button>
                <button class="btn btn-small btn-outline" onclick="editGateDetails('${gate.id}')">
                    ✏️ Edit
                </button>
            </td>
        </tr>
    `).join('');
}

// Function to display inactive gates in the table
function displayInactiveGates(gates) {
    const tableBody = document.getElementById('inactiveGatesBody');
    
    if (!gates || gates.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="no-data">No inactive gates found</td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = gates.map(gate => `
        <tr>
            <td>${gate.id || 'N/A'}</td>
            <td>${gate.name || 'N/A'}</td>
            <td>${gate.type || 'N/A'}</td>
            <td>${gate.guardName || 'N/A'}</td>
            <td><span class="status-badge status-inactive">Inactive</span></td>
            <td>
                <button class="btn btn-small btn-primary" onclick="viewGateDetails('${gate.id}')">
                    👁️ View
                </button>
                <button class="btn btn-small btn-outline" onclick="editGateDetails('${gate.id}')">
                    ✏️ Edit
                </button>
            </td>
        </tr>
    `).join('');
}

// Function to display error for active gates
function displayActiveGatesError() {
    const tableBody = document.getElementById('activeGatesBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="error-row" style="color: #dc3545; padding: 20px; text-align: center;">
                ❌ Failed to load active gates. Please try refreshing.
            </td>
        </tr>
    `;
}

// Function to display error for inactive gates
function displayInactiveGatesError() {
    const tableBody = document.getElementById('inactiveGatesBody');
    tableBody.innerHTML = `
        <tr>
            <td colspan="6" class="error-row" style="color: #dc3545; padding: 20px; text-align: center;">
                ❌ Failed to load inactive gates. Please try refreshing.
            </td>
        </tr>
    `;
}

// Function to refresh gate data
function refreshGateData() {
    // Show loading message
    const refreshBtn = document.querySelector('.section-controls .btn-outline');
    if (refreshBtn) {
        const originalText = refreshBtn.innerHTML;
        refreshBtn.style.opacity = '0.6';
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '🔄 Refreshing...';
        
        // Reset button after operation
        setTimeout(() => {
            refreshBtn.style.opacity = '1';
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = originalText;
        }, 1500);
    }

    // Refresh any currently visible sections
    const activeSection = document.getElementById('activeGatesSection');
    const inactiveSection = document.getElementById('inactiveGatesSection');
    
    if (activeSection.style.display === 'block') {
        loadActiveGates();
    }
    
    if (inactiveSection.style.display === 'block') {
        loadInactiveGates();
    }

    console.log('Gate data refreshed');
}

// Function to view gate details (placeholder)
function viewGateDetails(gateId) {
    const gate = [...activeGatesData, ...inactiveGatesData].find(g => g.id === gateId);
    if (gate) {
        alert(`Gate Details:\n\nID: ${gate.id}\nName: ${gate.name}\nType: ${gate.type}\nGuard: ${gate.guardName}\nStatus: ${gate.status ? 'Active' : 'Inactive'}`);
    } else {
        alert('Gate details not found.');
    }
}

// Function to edit gate details (placeholder)
function editGateDetails(gateId) {
    const gate = [...activeGatesData, ...inactiveGatesData].find(g => g.id === gateId);
    if (gate) {
        showEditGateForm(gate);
    } else {
        alert('Gate details not found.');
    }
}

// Function to show edit gate form with pre-filled data
function showEditGateForm(gate) {
    // Hide add form if open
    document.getElementById('addGateForm').style.display = 'none';
    
    // Show edit form
    const editForm = document.getElementById('editGateForm');
    editForm.style.display = 'block';
    
    // Clear any previous response messages
    document.getElementById('editGateResponse').innerHTML = '';
    
    // Pre-fill form with current gate data
    document.getElementById('editGateId').value = gate.id;
    document.getElementById('editGateName').value = gate.name || '';
    document.getElementById('editGateType').value = gate.type || '';
    document.getElementById('editGuardName').value = gate.guardName || '';
    document.getElementById('editGateStatus').value = gate.status ? 'true' : 'false';
    
    // Scroll to form
    editForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Function to hide edit gate form
function hideEditGateForm() {
    document.getElementById('editGateForm').style.display = 'none';
    document.getElementById('editGateResponse').innerHTML = '';
}

// Function to update gate details
async function updateGateDetails(event) {
    event.preventDefault();
    
    const gateId = document.getElementById('editGateId').value;
    const gateName = document.getElementById('editGateName').value.trim();
    const gateType = document.getElementById('editGateType').value;
    const guardName = document.getElementById('editGuardName').value.trim();
    const gateStatus = document.getElementById('editGateStatus').value === 'true';
    const responseDiv = document.getElementById('editGateResponse');

    if (!gateName || !gateType || !guardName) {
        responseDiv.innerHTML = `
            <div class="alert alert-error">
                ❌ Please fill in all required fields.
            </div>
        `;
        return;
    }

    // Show loading message
    responseDiv.innerHTML = `
        <div class="alert alert-info">
            ⏳ Updating gate...
        </div>
    `;

    const gateData = {
        id: gateId,
        name: gateName,
        type: gateType,
        guardName: guardName,
        status: gateStatus
    };

    console.log('Updating gate:', gateData);

    try {
        const response = await fetch(baseUrl + `admin/updateGate/${gateId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gateData)
        });

        if (response.ok) {
            const result = await response.text();
            responseDiv.innerHTML = `
                <div class="alert alert-success">
                    <h4>✅ Gate Updated Successfully!</h4>
                    <p><strong>Gate ID:</strong> ${gateData.id}</p>
                    <p><strong>Name:</strong> ${gateData.name}</p>
                    <p><strong>Type:</strong> ${gateData.type}</p>
                    <p><strong>Guard:</strong> ${gateData.guardName}</p>
                    <p><strong>Status:</strong> ${gateData.status ? 'Active' : 'Inactive'}</p>
                    <p><em>${result}</em></p>
                    <button onclick="hideEditGateForm()" class="btn btn-outline" style="margin-top: 10px;">
                        ✅ Close Form
                    </button>
                </div>
            `;
            
            // Refresh any loaded gate data
            refreshGateData();
            
        } else {
            const errorText = await response.text();
            responseDiv.innerHTML = `
                <div class="alert alert-error">
                    <h4>❌ Failed to Update Gate</h4>
                    <p>${errorText}</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error updating gate:', error);
        responseDiv.innerHTML = `
            <div class="alert alert-error">
                <h4>❌ Network Error</h4>
                <p>Failed to update gate. Please check your connection and try again.</p>
            </div>
        `;
    }
}

// Initialize gate form submission handler
document.addEventListener('DOMContentLoaded', function() {
    const gateForm = document.getElementById('gateForm');
    if (gateForm) {
        gateForm.addEventListener('submit', addNewGate);
    }
    
    const editGateForm = document.getElementById('editGateFormElement');
    if (editGateForm) {
        editGateForm.addEventListener('submit', updateGateDetails);
    }
});