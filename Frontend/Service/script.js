const CONFIG = {
    PARKING_CAPACITY: {
        MINI: 50,
        COMPACT: 75,
        LARGE: 25,
        get TOTAL() { return this.MINI + this.COMPACT + this.LARGE; }
    }
};

// ============================================================================
// APPLICATION INITIALIZATION
// ============================================================================

// Main application initializer

class QuickParkApp {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.init();
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('admin-login.html')) return 'admin-login';
        if (path.includes('admin.html')) return 'admin';
        if (path.includes('park.html')) return 'park';
        if (path.includes('unpark.html')) return 'unpark';
        if (path.includes('status.html')) return 'status';
        return 'home';
    }

    init() {
        // Common initializations
        this.initializeNavigation();
        this.initializeMobileMenu();
        
        // Page-specific initializations
        switch (this.currentPage) {
            case 'home':
                this.initHomePage();
                break;
            case 'park':
                this.initParkPage();
                break;
            case 'unpark':
                this.initUnparkPage();
                break;
            case 'status':
                this.initStatusPage();
                break;
            case 'admin-login':
                this.initAdminLoginPage();
                break;
            case 'admin':
                this.initAdminPage();
                break;
        }
    }

    initHomePage() {
        this.loadBasicParkingStatus();
    }

    initParkPage() {
        this.loadBasicParkingStatus();
        this.initializeParkingForm();
    }

    initUnparkPage() {
        this.initializeUnparkForm();
    }

    initStatusPage() {
        this.loadDetailedParkingStatus();
    }

    initAdminLoginPage() {
        AdminLoginManager.initialize();
    }

    initAdminPage() {
        if (AdminAuth.checkAuthentication()) {
            AdminDashboard.initialize();
        }
    }

    initializeNavigation() {
        // Smooth scrolling for hash links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href').substring(1);
                if (Navigation.smoothScrollToSection(targetId)) {
                    Navigation.updateActiveNavLink(targetId);
                }
            });
        });

        // Update active nav on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavOnScroll();
        });
    }

    initializeMobileMenu() {
        // Mobile menu functionality
        document.addEventListener('click', (e) => {
            const navMenu = document.getElementById('navMenu');
            const hamburgerMenu = document.getElementById('hamburgerMenu');
            
            if (navMenu && hamburgerMenu && 
                !navMenu.contains(e.target) && 
                !hamburgerMenu.contains(e.target) && 
                navMenu.classList.contains('active')) {
                Navigation.closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                Navigation.closeMobileMenu();
            }
        });
    }

    initializeParkingForm() {
        const parkForm = document.getElementById('parkForm');
        if (parkForm) {
            parkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                VehicleManager.parkVehicle();
            });
        }
    }

    initializeUnparkForm() {
        const unparkForm = document.getElementById('unparkForm');
        if (unparkForm) {
            unparkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                VehicleManager.unparkVehicle();
            });
        }
    }

    updateActiveNavOnScroll() {
        const sections = ['home', 'park', 'unpark', 'status', 'contact'];
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const offsetTop = element.offsetTop;
                const offsetBottom = offsetTop + element.offsetHeight;

                if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
                    Navigation.updateActiveNavLink(section);
                }
            }
        });
    }

    async loadBasicParkingStatus() {
        try {
            const data = await API.getParkingStatus();
            ParkingStatusManager.updateBasicStatus(data);
        } catch (error) {
            console.error('Error loading parking status:', error);
            ParkingStatusManager.showBasicStatusError();
        }
    }

    async loadDetailedParkingStatus() {
        try {
            const data = await API.getParkingStatus();
            ParkingStatusManager.updateDetailedStatus(data);
        } catch (error) {
            console.error('Error loading detailed parking status:', error);
            ParkingStatusManager.showDetailedStatusError();
        }
    }
}

// ============================================================================
// PARKING STATUS MANAGEMENT
// ============================================================================

class ParkingStatusManager {
    static updateBasicStatus(data) {
        const availableMini = data.mini || 0;
        const availableCompact = data.compact || 0;
        const availableLarge = data.large || 0;
        const totalAvailable = availableMini + availableCompact + availableLarge;
        const totalParked = CONFIG.PARKING_CAPACITY.TOTAL - totalAvailable;

        // Update home page elements
        this.updateAvailabilityDisplay('mini', availableMini, CONFIG.PARKING_CAPACITY.MINI);
        this.updateAvailabilityDisplay('compact', availableCompact, CONFIG.PARKING_CAPACITY.COMPACT);
        this.updateAvailabilityDisplay('large', availableLarge, CONFIG.PARKING_CAPACITY.LARGE);

        updateElementIfExists('availableSpots', totalAvailable);
        updateElementIfExists('totalParkedVehicles', totalParked);

        // Load additional admin data if on admin page
        if (document.getElementById('totalParkedVehicles')) {
            this.loadAdminDashboardData();
        }
    }

    static updateDetailedStatus(data) {
        // Update detailed status page
        this.updateDetailedAvailability('mini', data.mini || 0, CONFIG.PARKING_CAPACITY.MINI);
        this.updateDetailedAvailability('compact', data.compact || 0, CONFIG.PARKING_CAPACITY.COMPACT);
        this.updateDetailedAvailability('large', data.large || 0, CONFIG.PARKING_CAPACITY.LARGE);

        // Update overview stats
        const totalAvailable = (data.mini || 0) + (data.compact || 0) + (data.large || 0);
        const occupiedSpots = CONFIG.PARKING_CAPACITY.TOTAL - totalAvailable;
        const occupancyRate = Math.round((occupiedSpots / CONFIG.PARKING_CAPACITY.TOTAL) * 100);

        updateElements([
            ['totalSpots', CONFIG.PARKING_CAPACITY.TOTAL],
            ['availableSpots', totalAvailable],
            ['occupiedSpots', occupiedSpots],
            ['occupancyRate', occupancyRate + '%'],
            ['lastUpdated', new Date().toLocaleString()]
        ]);
    }

    static updateAvailabilityDisplay(type, available, total) {
        updateElementIfExists(`${type}Count`, available);
        updateElementIfExists(`${type}Available`, available);

        const percentage = (available / total) * 100;
        StatusIndicator.updateProgressBar(`${type}Fill`, percentage);

        const fillElement = document.getElementById(`${type}Fill`);
        const indicatorElement = document.getElementById(`${type}Indicator`);

        if (fillElement && indicatorElement) {
            const statusClass = StatusIndicator.getStatusClass(percentage);
            fillElement.className = `status-fill ${statusClass}`;
            indicatorElement.className = `status-indicator ${statusClass}`;
        }
    }

    static updateDetailedAvailability(type, available, total) {
        const occupied = total - available;
        const availabilityPercentage = (available / total) * 100;
        const occupancyPercentage = (occupied / total) * 100;

        updateElements([
            [`${type}Available`, available],
            [`${type}Occupied`, occupied],
            [`${type}Percentage`, occupancyPercentage.toFixed(1) + '%']
        ]);

        StatusIndicator.updateProgressBar(`${type}Progress`, occupancyPercentage, true);

        const indicator = document.getElementById(`${type}Indicator`);
        const statusText = document.getElementById(`${type}StatusText`);
        if (indicator) indicator.className = `status-indicator ${StatusIndicator.getStatusClass(availabilityPercentage)}`;
        if (statusText) statusText.textContent = StatusIndicator.getStatusText(availabilityPercentage);
    }

    static showBasicStatusError() {
        const fallbackElements = ['miniCount', 'compactCount', 'largeCount', 'availableSpots', 'totalParkedVehicles'];
        fallbackElements.forEach(elementId => updateElementIfExists(elementId, '--'));
    }

    static showDetailedStatusError() {
        const fallbackElements = [
            'miniAvailable', 'compactAvailable', 'largeAvailable',
            'miniOccupied', 'compactOccupied', 'largeOccupied',
            'miniPercentage', 'compactPercentage', 'largePercentage',
            'availableSpots', 'occupiedSpots', 'occupancyRate', 'lastUpdated'
        ];
        fallbackElements.forEach(elementId => updateElementIfExists(elementId, '--'));

        updateElements([
            ['miniStatusText', 'Offline'],
            ['compactStatusText', 'Offline'],
            ['largeStatusText', 'Offline']
        ]);
    }

    static async loadAdminDashboardData() {
        try {
            await Promise.all([
                AdminDashboard.loadCompletedVehiclesToday(),
                AdminDashboard.loadActiveGatesCount(),
                AdminDashboard.loadTodaysRevenue()
            ]);
        } catch (error) {
            console.error('Error loading admin dashboard data:', error);
        }
    }
}

// ============================================================================
// VEHICLE MANAGEMENT
// ============================================================================

class VehicleManager {
    static async parkVehicle() {
        const formData = FormUtils.getFormData('parkForm');
        const responseDiv = document.getElementById('response');

        if (!formData) {
            MessageDisplay.showError('response', 'Form not found');
            return;
        }

        // Validate form data
        const validation = VehicleValidator.validateVehicleDetails(formData);
        if (!validation.isValid) {
            ValidationDisplay.showValidationErrors(validation.errors, 'response');
            return;
        }

        MessageDisplay.showInfo('response', 'Booking your parking spot...', '⏳ Processing');

        try {
            const result = await API.parkVehicle(validation.cleanData);
            this.handleParkingSuccess(result, responseDiv);
            FormUtils.resetForm('parkForm');
            // Refresh parking status
            app.loadBasicParkingStatus();
        } catch (error) {
            this.handleParkingError(error, responseDiv);
        }
    }

    static handleParkingSuccess(ticket, responseDiv) {
        const formattedEntryDate = DateTimeUtils.formatDate(ticket.entryDate);
        const formattedEntryTime = ticket.entryTime || 'N/A';
        const parkingSpotInfo = ticket.parkingSpot ? 
            `${ticket.parkingSpot.type.toUpperCase()}-${ticket.parkingSpot.location}` : 'Assigned';

        const actions = [
            `<button onclick="PrintUtils.printParkingTicket('${ticket.id}', '${ticket.vehicleNo}', '${ticket.ownerName}', '${ticket.ownerContact}', '${formattedEntryDate}', '${formattedEntryTime}', '${parkingSpotInfo}')" class="btn btn-secondary" style="margin-right: 10px;">🖨️ Print Ticket</button>`,
            `<button onclick="FormUtils.resetForm('parkForm'); MessageDisplay.clearMessages('response')" class="btn btn-outline">🔄 Book Another Vehicle</button>`
        ];

        const ticketDetailsHtml = `
            <div class="ticket-details" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 15px; margin: 15px 0; color: #212529;">
                <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong>Ticket ID:</strong> <span style="font-family: monospace; font-size: 1.1em;">${ticket.id}</span></p>
                <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong>Vehicle Number:</strong> ${ticket.vehicleNo}</p>
                <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong>Owner Name:</strong> ${ticket.ownerName}</p>
                <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong>Owner Contact:</strong> ${ticket.ownerContact}</p>
                <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong>Entry Date:</strong> ${formattedEntryDate}</p>
                <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong>Entry Time:</strong> ${formattedEntryTime}</p>
                <p style="margin: 8px 0; color: #000; font-weight: 500;"><strong>Parking Spot:</strong> ${parkingSpotInfo}</p>
            </div>
        `;

        responseDiv.innerHTML = MessageDisplay.createAlert('success', '✅ Parking Spot Booked Successfully!', ticketDetailsHtml, actions);
    }

    static handleParkingError(error, responseDiv) {
        console.error('Error parking vehicle:', error);
        const isNetworkError = error.message.includes('fetch') || error.message.includes('Network');
        const message = isNetworkError ? ERROR_MESSAGES.NETWORK : error.message;
        const title = isNetworkError ? '❌ Network Error' : '❌ Booking Failed';
        
        MessageDisplay.showError('response', message, title);
    }

    static async unparkVehicle() {
        const ticketId = document.getElementById('ticketId').value.trim();
        const responseDiv = document.getElementById('unparkResponse');

        const validation = VehicleValidator.validateTicketId(ticketId);
        if (!validation.isValid) {
            MessageDisplay.showError('unparkResponse', validation.message);
            return;
        }

        MessageDisplay.showInfo('unparkResponse', 'Processing unpark request...', '⏳ Processing');

        try {
            const result = await API.unparkVehicle(validation.cleanValue);
            this.handleUnparkSuccess(result, responseDiv);
            FormUtils.resetForm('unparkForm');
        } catch (error) {
            this.handleUnparkError(error, responseDiv);
        }
    }

    static handleUnparkSuccess(freeRequest, responseDiv) {
        const formattedDuration = DateTimeUtils.formatDuration(freeRequest.totalTime);
        
        const billData = {
            ticketId: freeRequest.ticketId,
            vehicleNo: freeRequest.vehicleNo,
            ownerName: freeRequest.ownerName,
            ownerContact: freeRequest.ownerContact,
            vehicleType: freeRequest.type,
            duration: formattedDuration,
            totalCost: freeRequest.totalCost
        };

        this.displayUnparkBill(billData, responseDiv);
    }

    static handleUnparkError(error, responseDiv) {
        console.error('Error unparking vehicle:', error);
        const isNetworkError = error.message.includes('fetch') || error.message.includes('Network');
        const message = isNetworkError ? ERROR_MESSAGES.NETWORK : error.message;
        const title = isNetworkError ? '❌ Network Error' : '❌ Unpark Failed';
        
        MessageDisplay.showError('unparkResponse', message, title);
    }

    static displayUnparkBill(billData, responseDiv) {
        const actions = [
            `<button onclick="PrintUtils.printVehicleBill('${billData.ticketId}', '${billData.vehicleNo}', '${billData.ownerName}', '${billData.ownerContact}', '${billData.vehicleType}', '${billData.duration}', ${billData.totalCost})" class="btn btn-secondary" style="flex: 1;">🖨️ Print Bill</button>`,
            `<button onclick="FormUtils.resetForm('unparkForm'); MessageDisplay.clearMessages('unparkResponse')" class="btn btn-outline" style="flex: 1;">🔄 Unpark Another Vehicle</button>`,
            `<button onclick="window.location.href='index.html'" class="btn btn-primary" style="flex: 1;">🏠 Back to Home</button>`
        ];

        const billDetailsHtml = `
            <div class="bill-details" style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin: 15px 0; color: #212529;">
                <div style="text-align: center; margin-bottom: 15px; border-bottom: 2px solid #28a745; padding-bottom: 10px;">
                    <h3 style="margin: 0; color: #28a745;">🧾 QUICKPARK BILL</h3>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                    <div><strong>Ticket ID:</strong><br>${billData.ticketId}</div>
                    <div><strong>Vehicle Number:</strong><br>${billData.vehicleNo}</div>
                    <div><strong>Owner Name:</strong><br>${billData.ownerName}</div>
                    <div><strong>Contact:</strong><br>${billData.ownerContact}</div>
                    <div><strong>Vehicle Type:</strong><br>${billData.vehicleType.charAt(0).toUpperCase() + billData.vehicleType.slice(1)}</div>
                    <div><strong>Duration:</strong><br>${billData.duration}</div>
                </div>
                <div style="background: #e9ecef; padding: 15px; border-radius: 6px; text-align: center;">
                    <p style="margin: 0; font-size: 1.2em; font-weight: 600;">
                        <strong>Total Amount:</strong> 
                        <span style="color: #28a745; font-size: 1.3em;">₹${billData.totalCost}</span>
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 0.9em; color: #666;">
                        ${billData.totalCost === 0 ? '🎉 Free parking (under 30 minutes)' : 'Payment due on exit'}
                    </p>
                </div>
            </div>
            <div style="display: flex; gap: 10px; margin-top: 20px;">${actions.join('')}</div>
        `;

        responseDiv.innerHTML = MessageDisplay.createAlert('success', '✅ Vehicle Unparked Successfully!', billDetailsHtml);
    }
}

// ============================================================================
// ADMIN AUTHENTICATION
// ============================================================================

class AdminAuth {
    static checkAuthentication() {
        const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true';
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('admin.html') && !isLoggedIn) {
            window.location.href = 'admin-login.html';
            return false;
        }
        
        return true;
    }

    static async validateCredentials(username, password) {
        try {
            const isValid = await API.validateAdmin(username, password);
            
            if (isValid === true) {
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminUsername', username);
                localStorage.setItem('adminLoginTime', new Date().toISOString());
                return { success: true };
            } else {
                return { success: false, error: 'Invalid username or password' };
            }
        } catch (error) {
            console.error('Admin validation error:', error);
            return { success: false, error: ERROR_MESSAGES.AUTHENTICATION_FAILED };
        }
    }

    static logout() {
        if (confirm('Are you sure you want to logout?')) {
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminUsername');
            localStorage.removeItem('adminLoginTime');
            
            MessageDisplay.showSuccess('messageContainer', 'Logged out successfully! Redirecting to login page...');
            
            setTimeout(() => {
                window.location.href = 'admin-login.html';
            }, 1500);
        }
    }
}

// ============================================================================
// ADMIN LOGIN MANAGER
// ============================================================================

class AdminLoginManager {
    static initialize() {
        const form = document.getElementById('adminLoginForm');
        if (form) {
            form.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Clear messages on input
        const inputs = ['username', 'password'];
        inputs.forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', () => {
                    document.getElementById('errorMessage').style.display = 'none';
                    document.getElementById('successMessage').style.display = 'none';
                });
            }
        });
    }

    static async handleLogin(e) {
        e.preventDefault();
        
        const formData = FormUtils.getFormData('adminLoginForm');
        const validation = AdminValidator.validateCredentials(formData.username, formData.password);
        
        if (!validation.isValid) {
            this.showError(validation.errors.join(', '));
            return;
        }

        this.showSuccess('Validating credentials...');
        
        const result = await AdminAuth.validateCredentials(validation.cleanData.username, validation.cleanData.password);
        
        if (result.success) {
            this.showSuccess('Login successful! Redirecting to dashboard...');
            setTimeout(() => {
                window.location.href = 'admin.html';
            }, 1500);
        } else {
            this.showError(result.error);
        }
    }

    static showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        if (errorDiv) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
        }
    }

    static showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        if (successDiv) {
            successDiv.textContent = message;
            successDiv.style.display = 'block';
        }
    }
}

// ============================================================================
// ADMIN DASHBOARD
// ============================================================================

class AdminDashboard {
    static initialize() {
        this.initializeNavigation();
        this.initializeVehicleManagement();
        this.initializeGateManagement();
        this.loadInitialData();
    }

    static initializeNavigation() {
        const adminNavLinks = document.querySelectorAll('.nav-menu .nav-link[href^="#"]');
        adminNavLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                Navigation.smoothScrollToSection(targetId);
                Navigation.updateActiveNavLink(targetId);
            });
        });
    }

    static initializeVehicleManagement() {
        // Initialize vehicle filter
        const vehicleFilter = document.getElementById('vehicleFilter');
        if (vehicleFilter) {
            vehicleFilter.addEventListener('change', VehicleManagement.filterVehicles);
            // Load initial parked vehicles
            VehicleManagement.filterVehicles();
        }
    }

    static initializeGateManagement() {
        // Initialize gate forms
        const gateForm = document.getElementById('gateForm');
        if (gateForm) {
            gateForm.addEventListener('submit', GateManagement.addNewGate);
        }

        const editGateForm = document.getElementById('editGateFormElement');
        if (editGateForm) {
            editGateForm.addEventListener('submit', GateManagement.updateGateDetails);
        }
    }

    static async loadInitialData() {
        try {
            await Promise.all([
                app.loadBasicParkingStatus(),
                this.loadRevenueAnalytics()
            ]);
        } catch (error) {
            console.error('Error loading initial admin data:', error);
        }
    }

    static async loadCompletedVehiclesToday() {
        try {
            const count = await API.getCompletedVehiclesToday();
            updateElementIfExists('totalCompletedVehicles', count);
        } catch (error) {
            console.error('Error loading completed vehicles:', error);
            updateElementIfExists('totalCompletedVehicles', '--');
        }
    }

    static async loadActiveGatesCount() {
        try {
            const count = await API.getActiveGatesCount();
            updateElementIfExists('totalGates', count);
        } catch (error) {
            console.error('Error loading active gates count:', error);
            updateElementIfExists('totalGates', '--');
        }
    }

    static async loadTodaysRevenue() {
        try {
            const revenue = await API.getTodaysRevenue();
            updateElementIfExists('todayRevenue', `₹${revenue}`);
            updateElementIfExists('todayRevenueAnalytics', `₹${revenue}`);
        } catch (error) {
            console.error('Error loading today\'s revenue:', error);
            updateElementIfExists('todayRevenue', '₹--');
            updateElementIfExists('todayRevenueAnalytics', '₹--');
        }
    }

    static async loadRevenueAnalytics() {
        try {
            const [weekly, monthly, stats] = await Promise.all([
                API.getWeeklyRevenue(),
                API.getMonthlyRevenue(),
                API.getParkingStatistics()
            ]);

            updateElementIfExists('weekRevenue', `₹${weekly}`);
            updateElementIfExists('monthRevenue', `₹${monthly}`);
            
            this.updateUtilizationStats(stats);
        } catch (error) {
            console.error('Error loading revenue analytics:', error);
            this.showAnalyticsError();
        }
    }

    static updateUtilizationStats(stats) {
        const totalOccupied = stats.mini + stats.compact + stats.large;
        
        if (totalOccupied > 0) {
            const miniPercent = ((stats.mini / totalOccupied) * 100).toFixed(1);
            const compactPercent = ((stats.compact / totalOccupied) * 100).toFixed(1);
            const largePercent = ((stats.large / totalOccupied) * 100).toFixed(1);

            updateElements([
                ['miniUtilizationText', `${miniPercent}%`],
                ['compactUtilizationText', `${compactPercent}%`],
                ['largeUtilizationText', `${largePercent}%`],
                ['miniUtilCount', stats.mini],
                ['compactUtilCount', stats.compact],
                ['largeUtilCount', stats.large]
            ]);

            StatusIndicator.updateProgressBar('miniUtilization', miniPercent);
            StatusIndicator.updateProgressBar('compactUtilization', compactPercent);
            StatusIndicator.updateProgressBar('largeUtilization', largePercent);
        } else {
            this.showAnalyticsError();
        }
    }

    static showAnalyticsError() {
        const fallbackElements = [
            'weekRevenue', 'monthRevenue', 'miniUtilizationText', 
            'compactUtilizationText', 'largeUtilizationText',
            'miniUtilCount', 'compactUtilCount', 'largeUtilCount'
        ];
        fallbackElements.forEach(elementId => updateElementIfExists(elementId, '--'));
    }
}

// ============================================================================
// VEHICLE MANAGEMENT (Admin)
// ============================================================================

class VehicleManagement {
    static parkedVehiclesData = [];
    static completedVehiclesData = [];

    static async filterVehicles() {
        const filterValue = document.getElementById('vehicleFilter').value;
        toggleElementDisplay('parkedVehiclesSection', filterValue === 'parked');
        toggleElementDisplay('completedVehiclesSection', filterValue === 'completed');

        if (filterValue === 'parked') {
            await this.loadParkedVehicles();
        } else if (filterValue === 'completed') {
            await this.loadCompletedVehicles();
        }
    }

    static async loadParkedVehicles() {
        TableUtils.showLoadingRow('parkedVehiclesBody', 9, '⏳ Loading parked vehicles...');
        
        try {
            this.parkedVehiclesData = await API.getActiveVehicles();
            this.displayParkedVehicles();
        } catch (error) {
            console.error('Error loading parked vehicles:', error);
            TableUtils.showErrorRow('parkedVehiclesBody', 9);
        }
    }

    static async loadCompletedVehicles() {
        TableUtils.showLoadingRow('completedVehiclesBody', 9, '⏳ Loading completed vehicles...');
        
        try {
            const allVehicles = await API.getAllVehicles();
            this.completedVehiclesData = allVehicles.filter(vehicle => 
                vehicle.exitTime || vehicle.exitDate || vehicle.isCompleted || 
                vehicle.status === 'COMPLETED' || vehicle.status === 'EXITED'
            );
            this.displayCompletedVehicles();
        } catch (error) {
            console.error('Error loading completed vehicles:', error);
            TableUtils.showErrorRow('completedVehiclesBody', 9);
        }
    }

    static displayParkedVehicles() {
        const rowGenerator = (vehicle) => {
            const entryDateTime = `${DateTimeUtils.formatDate(vehicle.entryDate)} ${vehicle.entryTime || ''}`.trim();
            const parkingSpot = vehicle.parkingSpot ? 
                `${vehicle.parkingSpot.type}-${vehicle.parkingSpot.location}` : 'N/A';
            const vehicleType = vehicle.parkingSpot?.type || 'N/A';
            
            let duration = 'N/A';
            if (vehicle.entryDate && vehicle.entryTime) {
                const entryDateTime = new Date(`${vehicle.entryDate}T${vehicle.entryTime}`);
                const diffMinutes = Math.floor((new Date() - entryDateTime) / (1000 * 60));
                duration = DateTimeUtils.formatDuration(diffMinutes);
            }

            return `
                <tr>
                    <td>${vehicle.id || 'N/A'}</td>
                    <td>${vehicle.vehicleNo || 'N/A'}</td>
                    <td>${vehicle.ownerName || 'N/A'}</td>
                    <td>${vehicle.ownerContact || 'N/A'}</td>
                    <td>${vehicleType}</td>
                    <td>${parkingSpot}</td>
                    <td>${entryDateTime}</td>
                    <td>${duration}</td>
                    <td>
                        <button class="btn btn-small btn-primary" onclick="VehicleManagement.viewVehicleDetails('${vehicle.id}')">
                            👁️ View
                        </button>
                    </td>
                </tr>
            `;
        };

        TableUtils.populateTable('parkedVehiclesBody', this.parkedVehiclesData, rowGenerator);
    }

    static displayCompletedVehicles() {
        const rowGenerator = (vehicle) => {
            const entryDateTime = `${DateTimeUtils.formatDate(vehicle.entryDate)} ${vehicle.entryTime || ''}`.trim();
            const exitDateTime = `${DateTimeUtils.formatDate(vehicle.exitDate)} ${vehicle.exitTime || ''}`.trim();
            const parkingSpot = vehicle.parkingSpot ? 
                `${vehicle.parkingSpot.type}-${vehicle.parkingSpot.location}` : 'N/A';
            const vehicleType = vehicle.parkingSpot?.type || 'N/A';
            const duration = DateTimeUtils.formatDuration(vehicle.totalTime);
            const cost = vehicle.totalCost !== undefined ? `₹${vehicle.totalCost}` : 'N/A';

            return `
                <tr>
                    <td>${vehicle.id || 'N/A'}</td>
                    <td>${vehicle.vehicleNo || 'N/A'}</td>
                    <td>${vehicle.ownerName || 'N/A'}</td>
                    <td>${vehicleType}</td>
                    <td>${parkingSpot}</td>
                    <td>${entryDateTime}</td>
                    <td>${exitDateTime}</td>
                    <td>${duration}</td>
                    <td>${cost}</td>
                </tr>
            `;
        };

        TableUtils.populateTable('completedVehiclesBody', this.completedVehiclesData, rowGenerator);
    }

    static viewVehicleDetails(vehicleId) {
        const vehicle = this.parkedVehiclesData.find(v => v.id === vehicleId);
        if (vehicle) {
            const details = `
                Vehicle Details:
                
                Ticket ID: ${vehicle.id}
                Vehicle No: ${vehicle.vehicleNo}
                Owner: ${vehicle.ownerName}
                Contact: ${vehicle.ownerContact}
                Type: ${vehicle.parkingSpot?.type || 'N/A'}
                Entry: ${DateTimeUtils.formatDate(vehicle.entryDate)} ${vehicle.entryTime || ''}
            `;
            alert(details);
        } else {
            alert('Vehicle details not found.');
        }
    }

    static refreshVehicleData() {
        const refreshBtn = document.querySelector('.btn-refresh');
        if (refreshBtn) {
            ButtonManager.withLoadingState(refreshBtn, async () => {
                await this.filterVehicles();
            }, '🔄 Refreshing...');
        } else {
            this.filterVehicles();
        }
    }
}

// ============================================================================
// GATE MANAGEMENT (Admin)
// ============================================================================

class GateManagement {
    static activeGatesData = [];
    static inactiveGatesData = [];

    static async addNewGate(event) {
        event.preventDefault();
        
        const formData = FormUtils.getFormData('gateForm');
        const validation = GateValidator.validateGateData(formData);
        
        if (!validation.isValid) {
            ValidationDisplay.showValidationErrors(validation.errors, 'addGateResponse');
            return;
        }

        MessageDisplay.showInfo('addGateResponse', 'Adding gate...', '⏳ Processing');

        try {
            const result = await API.addGate(validation.cleanData);
            this.handleAddGateSuccess(result);
            FormUtils.resetForm('gateForm');
            this.refreshGateData();
        } catch (error) {
            console.error('Error adding gate:', error);
            MessageDisplay.showError('addGateResponse', error.message, '❌ Failed to Add Gate');
        }
    }

    static handleAddGateSuccess(result) {
        const successMessage = `
            <p><strong>Gate ID:</strong> ${result.id}</p>
            <p><strong>Name:</strong> ${result.name}</p>
            <p><strong>Type:</strong> ${result.type}</p>
            <p><strong>Guard:</strong> ${result.guardName}</p>
            <p><strong>Status:</strong> ${result.status ? 'Active' : 'Inactive'}</p>
        `;
        MessageDisplay.showSuccess('addGateResponse', successMessage, '✅ Gate Added Successfully!');
    }

    static async updateGateDetails(event) {
        event.preventDefault();
        
        const formData = FormUtils.getFormData('editGateFormElement');
        const validation = GateValidator.validateGateData(formData);
        
        if (!validation.isValid) {
            ValidationDisplay.showValidationErrors(validation.errors, 'editGateResponse');
            return;
        }

        MessageDisplay.showInfo('editGateResponse', 'Updating gate...', '⏳ Processing');

        try {
            const result = await API.updateGate(validation.cleanData.id, validation.cleanData);
            this.handleUpdateGateSuccess(validation.cleanData, result);
            this.refreshGateData();
        } catch (error) {
            console.error('Error updating gate:', error);
            MessageDisplay.showError('editGateResponse', error.message, '❌ Failed to Update Gate');
        }
    }

    static handleUpdateGateSuccess(gateData, result) {
        const successMessage = `
            <p><strong>Gate ID:</strong> ${gateData.id}</p>
            <p><strong>Name:</strong> ${gateData.name}</p>
            <p><strong>Type:</strong> ${gateData.type}</p>
            <p><strong>Guard:</strong> ${gateData.guardName}</p>
            <p><strong>Status:</strong> ${gateData.status ? 'Active' : 'Inactive'}</p>
            <p><em>${result}</em></p>
            <button onclick="toggleElementDisplay('editGateForm', false)" class="btn btn-outline" style="margin-top: 10px;">✅ Close Form</button>
        `;
        MessageDisplay.showSuccess('editGateResponse', successMessage, '✅ Gate Updated Successfully!');
    }

    static async loadActiveGates() {
        toggleElementDisplay('activeGatesSection', true);
        TableUtils.showLoadingRow('activeGatesBody', 6, '⏳ Loading active gates...');

        try {
            this.activeGatesData = await API.getActiveGates();
            this.displayGates('activeGatesBody', this.activeGatesData, 'Active');
        } catch (error) {
            console.error('Error loading active gates:', error);
            TableUtils.showErrorRow('activeGatesBody', 6);
        }
    }

    static async loadInactiveGates() {
        toggleElementDisplay('inactiveGatesSection', true);
        TableUtils.showLoadingRow('inactiveGatesBody', 6, '⏳ Loading inactive gates...');

        try {
            this.inactiveGatesData = await API.getInactiveGates();
            this.displayGates('inactiveGatesBody', this.inactiveGatesData, 'Inactive');
        } catch (error) {
            console.error('Error loading inactive gates:', error);
            TableUtils.showErrorRow('inactiveGatesBody', 6);
        }
    }

    static displayGates(tableBodyId, gates, status) {
        const rowGenerator = (gate) => `
            <tr>
                <td>${gate.id || 'N/A'}</td>
                <td>${gate.name || 'N/A'}</td>
                <td>${gate.type || 'N/A'}</td>
                <td>${gate.guardName || 'N/A'}</td>
                <td><span class="status-badge status-${status.toLowerCase()}">${status}</span></td>
                <td>
                    <button class="btn btn-small btn-primary" onclick="GateManagement.viewGateDetails('${gate.id}')">👁️ View</button>
                    <button class="btn btn-small btn-outline" onclick="GateManagement.editGateDetails('${gate.id}')">✏️ Edit</button>
                </td>
            </tr>
        `;

        TableUtils.populateTable(tableBodyId, gates, rowGenerator);
    }

    static viewGateDetails(gateId) {
        const gate = [...this.activeGatesData, ...this.inactiveGatesData].find(g => g.id === gateId);
        if (gate) {
            const details = `
                Gate Details:
                
                ID: ${gate.id}
                Name: ${gate.name}
                Type: ${gate.type}
                Guard: ${gate.guardName}
                Status: ${gate.status ? 'Active' : 'Inactive'}
            `;
            alert(details);
        } else {
            alert('Gate details not found.');
        }
    }

    static editGateDetails(gateId) {
        const gate = [...this.activeGatesData, ...this.inactiveGatesData].find(g => g.id === gateId);
        if (gate) {
            this.showEditGateForm(gate);
        } else {
            alert('Gate details not found.');
        }
    }

    static showEditGateForm(gate) {
        toggleElementDisplay('addGateForm', false);
        toggleElementDisplay('editGateForm', true);
        MessageDisplay.clearMessages('editGateResponse');
        
        // Pre-fill form
        updateElements([
            ['editGateId', gate.id, 'value'],
            ['editGateName', gate.name || '', 'value'],
            ['editGateType', gate.type || '', 'value'],
            ['editGuardName', gate.guardName || '', 'value'],
            ['editGateStatus', gate.status ? 'true' : 'false', 'value']
        ]);
        
        document.getElementById('editGateForm').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    static toggleAddGateForm() {
        const isVisible = document.getElementById('addGateForm').style.display === 'block';
        toggleElementDisplay('addGateForm', !isVisible);
        toggleElementDisplay('editGateForm', false);
        
        if (!isVisible) {
            FormUtils.resetForm('gateForm');
            MessageDisplay.clearMessages('addGateResponse');
        }
    }

    static refreshGateData() {
        const refreshBtn = document.querySelector('.section-controls .btn-outline');
        if (refreshBtn) {
            ButtonManager.withLoadingState(refreshBtn, async () => {
                const activeSection = document.getElementById('activeGatesSection');
                const inactiveSection = document.getElementById('inactiveGatesSection');
                
                if (activeSection.style.display === 'block') {
                    await this.loadActiveGates();
                }
                
                if (inactiveSection.style.display === 'block') {
                    await this.loadInactiveGates();
                }
            }, '🔄 Refreshing...');
        }
    }
}

// GLOBAL FUNCTIONS (for backward compatibility)

// Navigation functions
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu && navMenu.classList.contains('active')) {
        Navigation.closeMobileMenu();
    } else {
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        if (navMenu && hamburgerMenu) {
            navMenu.classList.add('active');
            hamburgerMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }
}

function scrollToSection(sectionId) {
    Navigation.smoothScrollToSection(sectionId);
    Navigation.updateActiveNavLink(sectionId);
}

// Status refresh functions
function refreshStatus() {
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        ButtonManager.withLoadingState(refreshBtn, () => app.loadBasicParkingStatus(), '🔄 Refreshing...');
    }
}

function refreshDetailedStatus() {
    const refreshBtn = document.querySelector('.btn-refresh');
    if (refreshBtn) {
        ButtonManager.withLoadingState(refreshBtn, () => app.loadDetailedParkingStatus(), '🔄 Refreshing...');
    }
}

function refreshAnalytics() {
    const refreshBtn = document.querySelector('#analytics .btn-outline');
    if (refreshBtn) {
        ButtonManager.withLoadingState(refreshBtn, () => AdminDashboard.loadRevenueAnalytics(), '🔄 Refreshing...');
    }
}

// Vehicle management functions
function filterVehicles() {
    VehicleManagement.filterVehicles();
}

function refreshVehicleData() {
    VehicleManagement.refreshVehicleData();
}

function viewVehicleDetails(vehicleId) {
    VehicleManagement.viewVehicleDetails(vehicleId);
}

// Gate management functions
function toggleAddGateForm() {
    GateManagement.toggleAddGateForm();
}

function loadActiveGates() {
    GateManagement.loadActiveGates();
}

function loadInactiveGates() {
    GateManagement.loadInactiveGates();
}

function refreshGateData() {
    GateManagement.refreshGateData();
}

function viewGateDetails(gateId) {
    GateManagement.viewGateDetails(gateId);
}

function editGateDetails(gateId) {
    GateManagement.editGateDetails(gateId);
}

function hideEditGateForm() {
    toggleElementDisplay('editGateForm', false);
    MessageDisplay.clearMessages('editGateResponse');
}

// Admin functions
function logout() {
    AdminAuth.logout();
}

// Form reset functions
function resetBookingForm() {
    FormUtils.resetForm('parkForm');
    MessageDisplay.clearMessages('response');
}

function resetUnparkForm() {
    FormUtils.resetForm('unparkForm');
    MessageDisplay.clearMessages('unparkResponse');
}

// Notification function
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

// ============================================================================
// APPLICATION STARTUP
// ============================================================================

// Initialize application when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', function() {
    app = new QuickParkApp();
});

// Initialize status page functionality for backward compatibility
if (window.location.pathname.includes('status.html')) {
    window.loadStatus = () => app.loadDetailedParkingStatus();
    window.refreshStatus = refreshDetailedStatus;
    window.loadDetailedParkingStatus = () => app.loadDetailedParkingStatus();
    window.refreshDetailedStatus = refreshDetailedStatus;
}