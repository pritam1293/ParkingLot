import axios from 'axios';

const USER_API_BASE_URL = 'http://localhost:8080/quickpark/api/user';

// Create axios instance with default config
const apiClient = axios.create({
    baseURL: USER_API_BASE_URL,
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

// User Authentication APIs
export const authAPI = {
    // Sign up new user
    signup: async (userData) => {
        try {
            const response = await apiClient.post('/auth/signup', {
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                email: userData.email || '',
                contactNo: userData.contactNo || '',
                password: userData.password || '',
                address: userData.address || ''
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Sign in existing user
    signin: async (credentials) => {
        try {
            const response = await apiClient.post('/auth/signin', {
                email: credentials.email || '',
                contactNo: credentials.contactNo || '',
                password: credentials.password || ''
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update user details
    updateUser: async (userData) => {
        try {
            const response = await apiClient.put('/auth/update', userData ? userData : {});
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Generate OTP
    generateOTP: async (email) => {
        try {
            const response = await apiClient.post('/auth/otp/generate', email ? email : {});
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Verify OTP
    verifyOTP: async (email, otp) => {
        try {
            const response = await apiClient.post('/auth/otp/verify', {
                email: email || '',
                otp: otp || ''
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Reset password
    resetPassword: async (newPassword) => {
        try {
            const response = await apiClient.put('/auth/reset-password', newPassword ? newPassword : '');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Reset contact number
    resetContactNumber: async (newContactNo) => {
        try {
            const response = await apiClient.put('/auth/reset-contact', newContactNo ? newContactNo : '');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get user profile
    getProfile: async () => {
        try {
            const response = await apiClient.get('/profile');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get user parking history
    getHistory: async () => {
        try {
            const response = await apiClient.get('/history');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default apiClient;
