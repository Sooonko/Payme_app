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

/**
 * Network-aware fetch wrapper
 * Provides better error handling for network failures
 */
export class NetworkError extends Error {
    constructor(message: string, public isNetworkError: boolean = true) {
        super(message);
        this.name = 'NetworkError';
    }
}

export const fetchWithNetworkHandling = async (
    url: string,
    options?: RequestInit
): Promise<Response> => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return response;
    } catch (error: any) {
        // Check if it's a network error (no connection, timeout, etc.)
        if (error.name === 'AbortError') {
            throw new NetworkError('Хүсэлт хугацаа хэтэрсэн. Дахин оролдоно уу.');
        }
        if (error.message?.includes('Network request failed') ||
            error.message?.includes('Failed to fetch')) {
            throw new NetworkError('Сүлжээний холболт салсан байна.');
        }
        // Re-throw other errors
        throw error;
    }
};

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

export interface WalletResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        userId: string;
        balance: number;
        currency: string;
        createdAt: string;
    };
    timestamp: string;
}

import * as SecureStore from 'expo-secure-store';

export const getWallet = async (): Promise<WalletResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');

        const response = await fetch(`${API_BASE_URL}/api/v1/wallets/my-wallet`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('Get Wallet Status:', response.status);
        const text = await response.text();
        console.log('Get Wallet Response:', text);

        try {
            const responseData = JSON.parse(text);
            return responseData;
        } catch (e) {
            console.error('Failed to parse JSON:', e);
            throw new Error(`Server returned ${response.status}: ${text}`);
        }
    } catch (error) {
        console.error('Get Wallet error:', error);
        throw error;
    }
};

export interface TopUpResponse {
    success: boolean;
    message: string;
    data: {
        transactionId: number;
        amount: number;
        status: string;
        provider: string;
        qrCode: string | null;
        createdAt: string;
    };
    timestamp: string;
}

export const initiateTopUp = async (amount: number): Promise<TopUpResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/topup/initiate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ amount }),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Initiate Top Up error:', error);
        throw error;
    }
};

export const confirmTopUp = async (transactionId: number): Promise<TopUpResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/topup/confirm/${transactionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Confirm Top Up error:', error);
        throw error;
    }
};

export interface UserSearchResponse {
    success: boolean;
    message: string;
    data: {
        userId: string;
        name: string;
        phone: string;
        walletId: string;
    }[];
    timestamp: string;
}

export const searchUsers = async (query: string): Promise<UserSearchResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const url = `${API_BASE_URL}/api/v1/users/search?query=${encodeURIComponent(query)}`;
        console.log('Searching users with URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        console.log('Search response status:', response.status);
        const text = await response.text();
        console.log('Search response body:', text);

        const responseData = JSON.parse(text);
        return responseData;
    } catch (error) {
        console.error('Search Users error:', error);
        throw error;
    }
};

export interface SendMoneyRequest {
    toWalletId: string;
    amount: number;
    description?: string;
}

export interface SendMoneyResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        fromWalletId: string;
        toWalletId: string;
        amount: number;
        type: string;
        status: string;
        description: string;
        createdAt: string;
    };
    timestamp: string;
}

export const sendMoney = async (data: SendMoneyRequest): Promise<SendMoneyResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/transactions/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Send Money error:', error);
        throw error;
    }
};

export interface UserProfileResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        name: string;
        email: string;
        phone: string;
        createdAt: string;
    };
    timestamp: string;
}

export const getUserProfile = async (): Promise<UserProfileResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Get User Profile error:', error);
        throw error;
    }
};

export interface UpdateProfileRequest {
    name: string;
    email: string;
    phone: string;
    address?: string;
}

export interface UpdateProfileResponse {
    success: boolean;
    message: string;
    data?: any;
}

export const updateUserProfile = async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/users/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Update User Profile error:', error);
        throw error;
    }
};

export interface TransactionHistoryResponse {
    success: boolean;
    message: string;
    data: {
        id: string;
        fromWalletId: string;
        toWalletId: string;
        amount: number;
        type: string;
        status: string;
        description: string;
        createdAt: string;
        flow: string; // 'INFLOW' or 'OUTFLOW'
    }[];
    timestamp: string;
}

export const getTransactionHistory = async (): Promise<TransactionHistoryResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/transactions/history`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Get Transaction History error:', error);
        throw error;
    }
};

// ============================================
// CARD MANAGEMENT
// ============================================

export type CardType = 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | 'UNKNOWN';

export interface AddCardRequest {
    cardHolderName: string;
    cardNumberLast4: string;
    cardType: CardType;
    expiryMonth: number;
    expiryYear: number;
    cardToken: string;
    isDefault?: boolean;
}

export interface AddCardResponse {
    success: boolean;
    message: string;
    errorCode?: string;
    data: {
        id: string;
        cardHolderName: string;
        cardNumberLast4: string;
        cardType: CardType;
        expiryMonth: number;
        expiryYear: number;
        isDefault: boolean;
        isVerified: boolean;
        createdAt: string;
    } | null;
    timestamp: string;
}

export const addCard = async (data: AddCardRequest): Promise<AddCardResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/cards/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Add Card error:', error);
        throw error;
    }
};

export interface CardData {
    id: string;
    cardHolderName: string;
    cardNumberLast4: string;
    cardType: CardType;
    expiryMonth: number;
    expiryYear: number;
    isDefault: boolean;
    isVerified: boolean;
    createdAt: string;
}

export interface GetCardsResponse {
    success: boolean;
    message: string;
    data: CardData[];
    timestamp: string;
}

export const getCards = async (): Promise<GetCardsResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/cards`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Get Cards error:', error);
        throw error;
    }
};

// ============================================
// LOANS MANAGEMENT
// ============================================

export interface LoanProduct {
    id: string;
    name: string;
    description: string;
    minAmount: number;
    maxAmount: number;
    interestRate: number;
    minTermMonths: number;
    maxTermMonths: number;
}

export interface LoanApplication {
    id: string;
    userId: string;
    loanProduct: LoanProduct;
    maxEligibleAmount: number;
    requestedAmount: number;
    requestedTermMonths: number;
    creditScore: number;
    status: 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
    createdAt: string;
}

export interface ActiveLoan {
    id: string;
    principalAmount: number;
    remainingBalance: number;
    status: 'ACTIVE' | 'PAID' | 'OVERDUE';
    startDate: string;
    endDate: string;
}

export interface ApplyLoanRequest {
    productId: string;
    requestedAmount: number;
    requestedTermMonths: number;
}

export interface GenericResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
    timestamp: string;
}

export type ApplyLoanResponse = GenericResponse<LoanApplication>;
export type DisburseLoanResponse = GenericResponse<ActiveLoan>;
export type RepayLoanResponse = GenericResponse<null>;
export type GetMyLoansResponse = GenericResponse<ActiveLoan[]>;

export const applyForLoan = async (data: ApplyLoanRequest): Promise<ApplyLoanResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/loans/apply`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Apply for Loan error:', error);
        throw error;
    }
};

export const disburseLoan = async (applicationId: string): Promise<DisburseLoanResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/loans/disburse/${applicationId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Disburse Loan error:', error);
        throw error;
    }
};

export interface RepayLoanRequest {
    loanId: string;
    amount: number;
}

export const repayLoan = async (data: RepayLoanRequest): Promise<RepayLoanResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/loans/repay`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Repay Loan error:', error);
        throw error;
    }
};

export const getMyLoans = async (): Promise<GetMyLoansResponse> => {
    try {
        const token = await SecureStore.getItemAsync('userToken');
        const response = await fetch(`${API_BASE_URL}/api/v1/loans/my`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Get My Loans error:', error);
        throw error;
    }
};
