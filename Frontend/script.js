const baseUrl = 'http://localhost:8080/quickpark/'; // Change port if needed

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

        // Update availability numbers
        updateAvailability('mini', data.mini || 0, 50);
        updateAvailability('compact', data.compact || 0, 75);
        updateAvailability('large', data.large || 0, 25);

        // Update total available spots (only if element exists)
        const totalAvailable = (data.mini || 0) + (data.compact || 0) + (data.large || 0);
        const availableSpotsElement = document.getElementById('availableSpots');
        if (availableSpotsElement) {
            availableSpotsElement.textContent = totalAvailable;
        }

    } catch (error) {
        console.error('Error loading parking status:', error);
        // Set fallback values (only if elements exist)
        const miniCountElement = document.getElementById('miniCount');
        const compactCountElement = document.getElementById('compactCount');
        const largeCountElement = document.getElementById('largeCount');
        const availableSpotsElement = document.getElementById('availableSpots');
        
        if (miniCountElement) miniCountElement.textContent = '--';
        if (compactCountElement) compactCountElement.textContent = '--';
        if (largeCountElement) largeCountElement.textContent = '--';
        if (availableSpotsElement) availableSpotsElement.textContent = '--';
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

async function parkVehicle() {
    // Get form values
    const type = document.getElementById('vehicleType').value;
    const vehicleNo = document.getElementById('vehicleNumber').value;
    const ownerName = document.getElementById('ownerName').value;
    const ownerContact = document.getElementById('ownerContact').value;
    const responseDiv = document.getElementById('response');

    if (!type || !vehicleNo || !ownerName || !ownerContact) {
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
    const type = document.getElementById(`editVehicleType-${ticketId}`).value;
    const vehicleNo = document.getElementById(`editVehicleNumber-${ticketId}`).value;
    const ownerName = document.getElementById(`editOwnerName-${ticketId}`).value;
    const ownerContact = document.getElementById(`editOwnerContact-${ticketId}`).value;
    const responseDiv = document.getElementById(`updateResponse-${ticketId}`);

    if (!type || !vehicleNo || !ownerName || !ownerContact) {
        responseDiv.innerHTML = `
            <div class="alert alert-error" style="padding: 10px; font-size: 0.9em;">
                ❌ Please fill in all required fields.
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

    if (!ticketId) {
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
