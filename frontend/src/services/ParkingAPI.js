import axios from 'axios';

const PARKING_API_BASE_URL = 'http://localhost:8080/quickpark/api';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: PARKING_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Parking APIs
export const parkingAPI = {
    // Park a vehicle
    parkVehicle: async (vehicleData) => {
        try {
            const response = await apiClient.post('/park', {
                vehicleNo: vehicleData.vehicleNumber,
                vehicleModel: vehicleData.vehicleModel,
                type: vehicleData.vehicleType
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                // Server responded with error
                throw new Error(error.response.data || error.response.statusText);
            } else if (error.request) {
                // Request made but no response
                throw new Error('No response from server. Please check your connection.');
            } else {
                // Something else happened
                throw new Error(error.message || 'Failed to park vehicle');
            }
        }
    },

    // Unpark a vehicle
    unparkVehicle: async (ticketId) => {
        try {
            console.log("Unparking vehicle with ticket ID:", ticketId);
            console.log("method: DELETE, endpoint: /unpark");
            const response = await apiClient.delete('/unpark', {
                params: {
                    ticketId: ticketId
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data || error.response.statusText);
            } else if (error.request) {
                throw new Error('No response from server. Please check your connection.');
            } else {
                throw new Error(error.message || 'Failed to unpark vehicle');
            }
        }
    },

    // Get vehicle details by ticket ID
    getVehicleByTicket: async (ticketId) => {
        try {
            const response = await apiClient.get(`/ticket/${ticketId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data || error.response.statusText);
            } else if (error.request) {
                throw new Error('No response from server. Please check your connection.');
            } else {
                throw new Error(error.message || 'Failed to fetch vehicle details');
            }
        }
    },

    // Get all parked vehicles (if admin endpoint exists)
    getAllParkedVehicles: async () => {
        try {
            const response = await apiClient.get('/vehicles/parked');
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data || error.response.statusText);
            } else if (error.request) {
                throw new Error('No response from server. Please check your connection.');
            } else {
                throw new Error(error.message || 'Failed to fetch parked vehicles');
            }
        }
    },

    // Get parking status/availability
    getParkingStatus: async () => {
        try {
            const response = await apiClient.get('/status');
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data || error.response.statusText);
            } else if (error.request) {
                throw new Error('No response from server. Please check your connection.');
            } else {
                throw new Error(error.message || 'Failed to fetch parking status');
            }
        }
    },

    // Calculate parking fee (if endpoint exists)
    calculateFee: async (ticketId) => {
        try {
            const response = await apiClient.get(`/calculate-fee/${ticketId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw new Error(error.response.data || error.response.statusText);
            } else if (error.request) {
                throw new Error('No response from server. Please check your connection.');
            } else {
                throw new Error(error.message || 'Failed to calculate parking fee');
            }
        }
    }
};

export default apiClient;
