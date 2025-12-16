import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import API_URL from '../constants/config';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

type UserRole = 'student' | 'company' | 'admin' | 'hr';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');
    const router = useRouter();
    const { signIn } = useAuth();

    const renderRoleButton = (role: UserRole, icon: any, label: string) => (
        <TouchableOpacity
            style={[styles.roleButton, selectedRole === role && styles.roleButtonActive]}
            onPress={() => setSelectedRole(role)}
        >
            <Ionicons
                name={icon}
                size={24}
                color={selectedRole === role ? '#0EA5E9' : '#64748b'}
            />
            <Text style={[styles.roleText, selectedRole === role && styles.roleTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );


    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            console.log(`Attempting login to: ${API_URL}/auth/login`);
            console.log(`Login attempt with email: ${email}`);

            const response = await axios.post(`${API_URL}/auth/login`, {
                email,
                password,
            }, {
                timeout: 15000, // 15 second timeout
                validateStatus: (status) => status < 500, // Don't throw on 4xx errors
            });

            console.log('Login response status:', response.status);
            console.log('Login response data:', JSON.stringify(response.data, null, 2));

            if (response.status === 200 && response.data.accessToken) {
                await signIn(response.data);
            } else {
                const message = response.data?.message || 'Login failed. Please try again.';
                Alert.alert('Login Failed', message);
            }

        } catch (error: any) {
            console.error('Login error:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                response: error.response?.data,
                isNetworkError: error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || !error.response
            });

            let message = 'Please check your credentials and try again';

            if (error.code === 'ECONNABORTED') {
                message = 'Connection timeout. Please check your internet connection and try again.';
            } else if (error.code === 'ERR_NETWORK' || !error.response) {
                message = `Cannot connect to server at ${API_URL}. Please ensure:\n• Backend is running\n• Your device is on the same network\n• Firewall allows port 5000`;
            } else if (error.response?.data?.message) {
                message = error.response.data.message;
            }

            Alert.alert('Login Failed', message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.brandText}>doltec</Text>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to your account</Text>
                </View>

                {/* Role Selection Grid */}
                <View style={styles.roleContainer}>
                    <View style={styles.roleRow}>
                        {renderRoleButton('student', 'school-outline', 'Student')}
                        {renderRoleButton('company', 'briefcase-outline', 'Company')}
                    </View>
                    <View style={styles.roleRow}>
                        {renderRoleButton('hr', 'people-outline', 'HR')}
                        {renderRoleButton('admin', 'shield-checkmark-outline', 'Admin')}
                    </View>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            placeholderTextColor="#64748b"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#64748b"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <Link href="/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.link}>Sign up</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 40,
        alignItems: 'center',
    },
    brandText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0EA5E9',
        letterSpacing: 1,
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#9CA3AF',
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    input: {
        backgroundColor: '#0F172A',
        borderWidth: 1,
        borderColor: '#1E293B',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#FFFFFF',
    },
    button: {
        backgroundColor: '#0EA5E9',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#0EA5E9',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: '#9CA3AF',
        fontSize: 14,
    },
    link: {
        color: '#0EA5E9',
        fontWeight: '600',
        fontSize: 14,
    },
    roleContainer: {
        flexDirection: 'column',
        gap: 12,
        marginBottom: 24,
    },
    roleRow: {
        flexDirection: 'row',
        gap: 12,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#1E293B',
        backgroundColor: '#0F172A',
    },
    roleButtonActive: {
        borderColor: '#0EA5E9',
        backgroundColor: '#0EA5E915',
    },
    roleText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748b',
    },
    roleTextActive: {
        color: '#0EA5E9',
    },
});

