import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { API_BASE_URL } from '../api/client';

export type NetworkStatus = {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    isServerReachable: boolean;
    type: string | null;
};

type NetworkChangeListener = (status: NetworkStatus) => void;

class NetworkService {
    private listeners: Set<NetworkChangeListener> = new Set();
    private currentStatus: NetworkStatus = {
        isConnected: false,
        isInternetReachable: null,
        isServerReachable: true, // Start optimistic to avoid false alerts
        type: null,
    };
    private serverCheckInterval: ReturnType<typeof setInterval> | null = null;
    private unsubscribeNetInfo: (() => void) | null = null;

    /**
     * Initialize the network service
     */
    async initialize(): Promise<void> {
        // Subscribe to network state changes
        this.unsubscribeNetInfo = NetInfo.addEventListener(this.handleNetworkChange);

        // Get initial network state
        const state = await NetInfo.fetch();
        await this.handleNetworkChange(state);

        // Start periodic server health checks (every 30 seconds)
        this.startServerHealthCheck();
    }

    /**
     * Clean up resources
     */
    cleanup(): void {
        if (this.unsubscribeNetInfo) {
            this.unsubscribeNetInfo();
            this.unsubscribeNetInfo = null;
        }
        if (this.serverCheckInterval) {
            clearInterval(this.serverCheckInterval);
            this.serverCheckInterval = null;
        }
        this.listeners.clear();
    }

    /**
     * Handle network state changes from NetInfo
     */
    private handleNetworkChange = async (state: NetInfoState): Promise<void> => {
        const wasConnected = this.currentStatus.isConnected;

        this.currentStatus = {
            isConnected: state.isConnected ?? false,
            isInternetReachable: state.isInternetReachable,
            isServerReachable: this.currentStatus.isServerReachable,
            type: state.type,
        };

        // If network just came back online, check server immediately
        if (!wasConnected && this.currentStatus.isConnected) {
            await this.checkServerHealth();
        } else if (!this.currentStatus.isConnected) {
            // If network is down, server is definitely unreachable
            this.updateServerStatus(false);
        }

        this.notifyListeners();
    };

    /**
     * Start periodic server health checks
     */
    private startServerHealthCheck(): void {
        // Check every 30 seconds
        this.serverCheckInterval = setInterval(() => {
            if (this.currentStatus.isConnected) {
                this.checkServerHealth();
            }
        }, 30000);
    }

    /**
     * Check if the backend server is reachable
     */
    async checkServerHealth(): Promise<boolean> {
        if (!this.currentStatus.isConnected) {
            this.updateServerStatus(false);
            return false;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

            // Use dedicated health endpoint
            const response = await fetch(`${API_BASE_URL}/actuator/health`, {
                method: 'GET',
                signal: controller.signal,
            });

            clearTimeout(timeoutId);

            console.log('Server health check response:', response.status);

            // Server is healthy if we get 200 OK
            const isReachable = response.ok;
            this.updateServerStatus(isReachable);
            return isReachable;
        } catch (error: any) {
            console.log('Server health check failed:', error.message || error);
            this.updateServerStatus(false);
            return false;
        }
    }

    /**
     * Update server reachability status
     */
    private updateServerStatus(isReachable: boolean): void {
        if (this.currentStatus.isServerReachable !== isReachable) {
            this.currentStatus.isServerReachable = isReachable;
            this.notifyListeners();
        }
    }

    /**
     * Subscribe to network status changes
     */
    subscribe(listener: NetworkChangeListener): () => void {
        this.listeners.add(listener);
        // Immediately notify with current status
        listener(this.currentStatus);

        // Return unsubscribe function
        return () => {
            this.listeners.delete(listener);
        };
    }

    /**
     * Notify all listeners of status change
     */
    private notifyListeners(): void {
        this.listeners.forEach(listener => listener(this.currentStatus));
    }

    /**
     * Get current network status
     */
    getStatus(): NetworkStatus {
        return { ...this.currentStatus };
    }

    /**
     * Manually trigger a server health check
     */
    async refresh(): Promise<NetworkStatus> {
        const state = await NetInfo.fetch();
        await this.handleNetworkChange(state);
        await this.checkServerHealth();
        return this.getStatus();
    }
}

// Export singleton instance
export const networkService = new NetworkService();
