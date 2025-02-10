import { config } from '@/config';

export const API_ENDPOINTS = {
    auth: {
        login: `${config.endpoints.baseUrl}/auth/login`,
        register: `${config.endpoints.baseUrl}/auth/register`,
        logout: `${config.endpoints.baseUrl}/auth/logout`,
    },
    users: {
        profile: `${config.endpoints.baseUrl}/users/profile`,
        update: `${config.endpoints.baseUrl}/users/update`,
    },
    // Add more endpoints as needed
};

export const apiService = {
    async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                // Add any default headers here
            },
            ...options,
        };

        try {
            const response = await fetch(endpoint, defaultOptions);
            if (!response.ok) {
                throw new Error(`API call failed: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    }
};