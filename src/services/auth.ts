import { apiClient } from './apiClient';

interface LoginCredentials {
    email: string;
    password: string;
}

interface LoginResponse {
    message?: string; 
}

export const loginUser = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    return apiClient<LoginResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

export const logoutUser = async (): Promise<void> => {
    await apiClient<void>('/auth/logout', { 
        method: 'POST' 
    });
}; 