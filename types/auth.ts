export interface LoginResponse {
    status: string;
    token: string;
    refreshToken: string;
    user: any; // Replace 'any' with specific user interface
}

export interface LoginCredentials {
    username: string;
    password: string;
}