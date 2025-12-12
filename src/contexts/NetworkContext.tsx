import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { networkService, NetworkStatus } from '../services/networkService';

interface NetworkContextType {
    isConnected: boolean;
    isInternetReachable: boolean | null;
    isServerReachable: boolean;
    networkType: string | null;
    refresh: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

interface NetworkProviderProps {
    children: ReactNode;
}

export const NetworkProvider: React.FC<NetworkProviderProps> = ({ children }) => {
    const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
        isConnected: false,
        isInternetReachable: null,
        isServerReachable: false,
        type: null,
    });

    useEffect(() => {
        // Initialize network service
        networkService.initialize();

        // Subscribe to network status changes
        const unsubscribe = networkService.subscribe((status) => {
            setNetworkStatus(status);
        });

        // Cleanup on unmount
        return () => {
            unsubscribe();
            networkService.cleanup();
        };
    }, []);

    const refresh = async () => {
        await networkService.refresh();
    };

    const value: NetworkContextType = {
        isConnected: networkStatus.isConnected,
        isInternetReachable: networkStatus.isInternetReachable,
        isServerReachable: networkStatus.isServerReachable,
        networkType: networkStatus.type,
        refresh,
    };

    return (
        <NetworkContext.Provider value={value}>
            {children}
        </NetworkContext.Provider>
    );
};

export const useNetwork = (): NetworkContextType => {
    const context = useContext(NetworkContext);
    if (context === undefined) {
        throw new Error('useNetwork must be used within a NetworkProvider');
    }
    return context;
};
