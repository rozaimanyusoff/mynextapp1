import { config } from '@/config';
import { LoginResponse, LoginCredentials } from '@/types/auth';

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
        try {
            const response = await fetch(endpoint, options);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API call failed');
            }

            return data;
        } catch (error) {
            console.error('API call error:', error);
            throw error;
        }
    },

    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await fetch(API_ENDPOINTS.auth.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        const data = await response.json();

        if (data.status !== 'Success') {
            throw new Error(data.message || 'Login failed');
        }

        return data;
    }
};