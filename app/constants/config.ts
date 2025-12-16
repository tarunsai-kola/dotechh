import Constants from 'expo-constants';
import { Platform } from 'react-native';

const getBackendUrl = () => {
    // IMPORTANT: When using Expo tunnel mode, the tunnel URL only works for the Expo packager,
    // NOT for your backend server. The backend must be accessed directly via local IP.

    // For physical devices on the same network, use your machine's local IP
    // Replace this with your actual IP address (check with: ipconfig on Windows / ifconfig on Mac/Linux)
    const LOCAL_IP = '192.168.31.53'; // Your PC's local IP address

    // For physical devices using your local network
    if (Constants.expoConfig?.hostUri) {
        // We're using Expo (Go or tunnel), but backend needs direct IP access
        return `http://${LOCAL_IP}:5000/api`;
    }

    // Fallback for emulators/simulators
    if (Platform.OS === 'android') {
        return 'http://10.0.2.2:5000/api';
    }

    return 'http://localhost:5000/api';
};

const API_URL = getBackendUrl();

export default API_URL;
