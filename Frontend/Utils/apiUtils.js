const API_CONFIG = {
    baseUrl: 'http://localhost:8080/quickpark/',
    headers: {
        'Content-Type': 'application/json'
    }
};

// Generic API call function with error handling
async function apiCall(endpoint, options = {}) {
    const url = API_CONFIG.baseUrl + endpoint;
    const config = {
        headers: API_CONFIG.headers,
        ...options
    };

    try {
        console.log(`API Call: ${config.method || 'GET'} ${url}`);
        const response = await fetch(url, config);

        console.log(`Response: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || `HTTP ${response.status}: ${response.statusText}`);
        }

        return response;
    } catch (error) {
        console.error(`API Error for ${endpoint}:`, error);
        throw error;
    }
}

// Safe JSON parsing with fallback
function safeJsonParse(text, fallback = null) {
    try {
        return JSON.parse(text);
    } catch (e) {
        console.warn('Failed to parse JSON:', e);
        return fallback;
    }
}

// API call that expects JSON response
async function apiCallJson(endpoint, options = {}) {
    const response = await apiCall(endpoint, options);
    const text = await response.text();
    return safeJsonParse(text) || text;
}

// API call that expects text response
async function apiCallText(endpoint, options = {}) {
    const response = await apiCall(endpoint, options);
    return await response.text();
}

// GET request helpers
const API = {
    // Parking status
    async getParkingStatus() {
        return await apiCallJson('free-parking-spots');
    },

    // Admin endpoints
    async getCompletedVehiclesToday() {
        return await apiCallJson('admin/unparked-today');
    },

    async getActiveGatesCount() {
        return await apiCallJson('admin/count-active-gates');
    },

    async getTodaysRevenue() {
        return await apiCallJson('admin/revenue-today');
    },

    async getWeeklyRevenue() {
        return await apiCallJson('admin/revenue-week');
    },

    async getMonthlyRevenue() {
        return await apiCallJson('admin/revenue-month');
    },

    async getParkingStatistics() {
        return await apiCallJson('admin/parking-statistics');
    },

    async getActiveVehicles() {
        return await apiCallJson('admin/active-vehicles');
    },

    async getAllVehicles() {
        return await apiCallJson('admin/all-vehicles');
    },

    async getActiveGates() {
        return await apiCallJson('admin/active-gates');
    },

    async getInactiveGates() {
        return await apiCallJson('admin/inactive-gates');
    },

    // Vehicle operations
    async parkVehicle(vehicleData) {
        return await apiCallJson('park', {
            method: 'POST',
            body: JSON.stringify(vehicleData)
        });
    },

    async unparkVehicle(ticketId) {
        return await apiCallJson('unpark', {
            method: 'DELETE',
            headers: { 'Content-Type': 'text/plain' },
            body: ticketId
        });
    },

    async updateVehicleDetails(ticketId, vehicleData) {
        return await apiCallJson(`update-ticket/${ticketId}`, {
            method: 'PUT',
            body: JSON.stringify(vehicleData)
        });
    },

    // Admin authentication
    async validateAdmin(username, password) {
        return await apiCallJson(`admin/validate-admin/${encodeURIComponent(username)}/${encodeURIComponent(password)}`);
    },

    // Gate management
    async addGate(gateData) {
        return await apiCallJson('admin/addGate', {
            method: 'POST',
            body: JSON.stringify(gateData)
        });
    },

    async updateGate(gateId, gateData) {
        return await apiCallText(`admin/updateGate/${gateId}`, {
            method: 'PUT',
            body: JSON.stringify(gateData)
        });
    }
};

// Standard error messages
const ERROR_MESSAGES = {
    NETWORK: 'Network error. Please check your connection and try again.',
    VALIDATION: 'Please fill in all required fields.',
    INVALID_DETAILS: 'Please provide valid vehicle and personal details.',
    AUTHENTICATION_FAILED: 'Authentication failed. Please check your credentials and try again.',
    GENERIC: 'An error occurred. Please try again.'
};

// Create standardized error response
function createErrorResponse(message, isNetworkError = false) {
    return {
        success: false,
        error: message,
        isNetworkError
    };
}

// Create standardized success response
function createSuccessResponse(data, message = 'Operation completed successfully') {
    return {
        success: true,
        data,
        message
    };
}