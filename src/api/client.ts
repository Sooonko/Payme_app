import Constants from 'expo-constants';

const getApiBaseUrl = () => {
    if (__DEV__) {
        // Get the IP address of the machine running the Metro bundler
        const debuggerHost = Constants.expoConfig?.hostUri;
        const localhost = debuggerHost?.split(':')[0];

        if (localhost) {
            return `http://${localhost}:8080`;
        }
    }
    // Fallback for production or if debuggerHost is missing
    return 'http://localhost:8080';
};

export const API_BASE_URL = getApiBaseUrl();

export interface RegisterResponse {
    success: boolean;
    message: string;
    errorCode: string | null;
    data: {
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            createdAt: string;
        };
    } | null;
    timestamp: string;
    metadata: any;
}

export interface RegisterRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
}

export const registerUser = async (data: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
};

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    errorCode: string | null;
    data: {
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
            createdAt: string;
        };
    } | null;
    timestamp: string;
}

export const loginUser = async (data: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};
