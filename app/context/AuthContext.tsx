import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import API_URL from '../constants/config';
import { useRouter, useSegments } from 'expo-router';

type AuthContextType = {
    signIn: (data: any) => Promise<void>; // Modified to take response data object
    signOut: () => Promise<void>;
    user: any | null;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    signIn: async () => { },
    signOut: async () => { },
    user: null,
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    // Configure Axios Interceptors for Token Refresh
    useEffect(() => {
        // Request Interceptor
        const requestInterceptor = axios.interceptors.request.use(
            async (config) => {
                if (!config.headers['Authorization']) {
                    const token = await SecureStore.getItemAsync('accessToken');
                    if (token) {
                        config.headers['Authorization'] = `Bearer ${token}`;
                    }
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response Interceptor
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                // If 403/401 and not retried yet
                if ((error.response?.status === 403 || error.response?.status === 401) && !originalRequest._retry) {
                    originalRequest._retry = true;
                    try {
                        const refreshToken = await SecureStore.getItemAsync('refreshToken');
                        if (!refreshToken) throw new Error('No refresh token');

                        // Attempt refresh
                        const response = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
                        const { accessToken, refreshToken: newRefreshToken } = response.data;

                        if (accessToken) {
                            await SecureStore.setItemAsync('accessToken', accessToken);
                            if (newRefreshToken) {
                                await SecureStore.setItemAsync('refreshToken', newRefreshToken);
                            }

                            // Retry original request
                            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                            return axios(originalRequest);
                        }
                    } catch (refreshError) {
                        // Failed to refresh - logout
                        await signOut();
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
        };
    }, []);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = await SecureStore.getItemAsync('user');
                const accessToken = await SecureStore.getItemAsync('accessToken');

                if (userData && accessToken) {
                    setUser(JSON.parse(userData));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                }
            } catch (e) {
                console.error('Failed to load user', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    // Session Heartbeat
    useEffect(() => {
        if (!user) return;

        const pingHeartbeat = async () => {
            try {
                await axios.post(`${API_URL}/auth/heartbeat`, {}, {
                    headers: { Authorization: `Bearer ${await SecureStore.getItemAsync('accessToken')}` }
                });
            } catch (error) {
                console.log("Heartbeat failed (silent)");
            }
        };

        const interval = setInterval(pingHeartbeat, 60000); // 1 minute
        pingHeartbeat(); // Initial ping

        return () => clearInterval(interval);
    }, [user]);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(tabs)' || segments[0] === '(company-tabs)';
        const inCompanyRoute = segments[0] === 'company';
        const inJobRoute = segments[0] === 'job';
        const inAdminRoute = segments[0] === 'admin';
        const inHrRoute = segments[0] === 'hr';

        if (!user && inAuthGroup) {
            router.replace('/login');
        } else if (user && !inAuthGroup && !inCompanyRoute && !inJobRoute && !inAdminRoute && !inHrRoute) {
            if (user.role === 'company') {
                router.replace('/(company-tabs)');
            } else if (user.role === 'admin') {
                router.replace('/admin');
            } else if (user.role === 'hr') {
                router.replace('/hr');
            } else {
                router.replace('/(tabs)');
            }
        }
    }, [user, segments, isLoading]);

    const signIn = async (data: any) => {
        try {
            console.log('SignIn Data:', JSON.stringify(data, null, 2));
            const { accessToken, refreshToken, user: userData } = data;

            console.log('Storing tokens and user data...');

            if (accessToken && typeof accessToken === 'string') {
                await SecureStore.setItemAsync('accessToken', accessToken);
                console.log('✓ Access token stored');
            } else {
                console.warn('Invalid accessToken:', accessToken);
            }

            if (refreshToken && typeof refreshToken === 'string') {
                await SecureStore.setItemAsync('refreshToken', refreshToken);
                console.log('✓ Refresh token stored');
            }

            if (userData) {
                await SecureStore.setItemAsync('user', JSON.stringify(userData));
                setUser(userData);
                console.log('✓ User data stored:', { role: userData.role, email: userData.email });
            } else {
                console.warn('Invalid userData:', userData);
            }

            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            // Role-based navigation
            console.log('Navigating user based on role:', userData?.role);

            if (userData?.role === 'company') {
                console.log('→ Redirecting to company dashboard: /(company-tabs)');
                router.replace('/(company-tabs)');
            } else if (userData?.role === 'admin') {
                console.log('→ Redirecting to admin dashboard: /admin');
                router.replace('/admin');
            } else if (userData?.role === 'hr') {
                console.log('→ Redirecting to HR dashboard: /hr');
                router.replace('/hr');
            } else {
                console.log('→ Redirecting to student dashboard: /(tabs)');
                router.replace('/(tabs)');
            }

            console.log('SignIn completed successfully');
        } catch (e) {
            console.error('Sign in error', e);
            throw e;
        }
    };

    const signOut = async () => {
        try {
            await SecureStore.deleteItemAsync('accessToken');
            await SecureStore.deleteItemAsync('refreshToken');
            await SecureStore.deleteItemAsync('user');
            delete axios.defaults.headers.common['Authorization'];
            setUser(null);
            router.replace('/login');
        } catch (e) {
            console.error('Sign out error', e);
        }
    };

    return (
        <AuthContext.Provider value={{ signIn, signOut, user, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
