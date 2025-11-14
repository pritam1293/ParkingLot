import axios from 'axios';

/**
 * Creates an axios instance with common configuration and interceptors
 * @param {string} baseURL - The base URL for the API
 * @returns {object} - Configured axios instance
 */
export const createAxiosInstance = (baseURL) => {
    const instance = axios.create({
        baseURL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    // Add request interceptor to include auth token
    instance.interceptors.request.use(
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

    // Add response interceptor to handle expired tokens
    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            // Check if error is due to expired/invalid token
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                // Check if the error message indicates token expiration
                const errorMessage = error.response.data?.message || error.response.data || '';
                const isTokenExpired =
                    errorMessage.toLowerCase().includes('expired') ||
                    errorMessage.toLowerCase().includes('jwt') ||
                    error.response.status === 401;

                if (isTokenExpired) {
                    // Clear auth data
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');

                    // Redirect to signin page
                    window.location.href = '/signin';

                    // Return a rejected promise with a user-friendly message
                    return Promise.reject({
                        message: 'Your session has expired. Please sign in again.',
                        sessionExpired: true
                    });
                }
            }
            return Promise.reject(error);
        }
    );

    return instance;
};
