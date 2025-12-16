import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import API_URL from '../constants/config';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

type UserRole = 'student' | 'company' | 'admin' | 'hr';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<UserRole>('student');
    const router = useRouter();
    const { signIn } = useAuth();

    // Helper to render role button
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

    const handleRegister = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (selectedRole === 'company' && (!companyName || !phone)) {
            Alert.alert('Error', 'Please fill in company name and phone');
            return;
        }

        setLoading(true);
        try {
            let response;

            if (selectedRole === 'company') {
                // Company registration
                console.log(`Attempting company register to: ${API_URL}/auth/register-company`);
                response = await axios.post(`${API_URL}/auth/register-company`, {
                    email: email.trim(),
                    password: password.trim(),
                    companyName: companyName.trim(),
                    phone: phone.trim(),
                }, {
                    timeout: 10000
                });
            } else {
                // Student/Admin/HR registration
                // Note: Admin/HR endpoints might differ in prod, but using signup for now with role
                console.log(`Attempting ${selectedRole} register to: ${API_URL}/auth/signup`);
                response = await axios.post(`${API_URL}/auth/signup`, {
                    email: email.trim(),
                    password: password.trim(),
                    role: selectedRole
                }, {
                    timeout: 10000
                });
            }

            console.log('Register Response:', response.data);

            if (response.data.status === 'success') {
                const { accessToken, token, user } = response.data;
                const finalToken = token || accessToken;

                if (finalToken && user) {
                    await signIn({
                        accessToken: finalToken,
                        user,
                        refreshToken: response.data.refreshToken
                    });
                } else {
                    Alert.alert('Registration Error', 'Invalid server response: Missing token or user data');
                }
            } else {
                Alert.alert('Registration Failed', JSON.stringify(response.data));
            }
        } catch (error: any) {
            console.error('Registration Error:', error);
            let errorMessage = 'Something went wrong';

            if (error.response) {
                if (error.response.status === 409) {
                    Alert.alert(
                        'Account Exists',
                        'This email is already registered. Please sign in instead.',
                        [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Go to Login', onPress: () => router.push('/login') }
                        ]
                    );
                    return;
                }
                errorMessage = error.response.data?.message || `Server Error (${error.response.status})`;
            } else if (error.request) {
                errorMessage = `Network Error: No response from ${API_URL}`;
            } else {
                errorMessage = `Request Error: ${error.message}`;
            }
            Alert.alert('Registration Failed', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.brandText}>doltec</Text>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join us today</Text>
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
                    {/* Company-specific fields */}
                    {selectedRole === 'company' && (
                        <>
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Company Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Acme Corp"
                                    placeholderTextColor="#64748b"
                                    value={companyName}
                                    onChangeText={setCompanyName}
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Phone Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="+91 9876543210"
                                    placeholderTextColor="#64748b"
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </>
                    )}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="you@university.edu"
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

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#64748b"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <Link href="/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.link}>Sign in</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    scrollContent: {
        flexGrow: 1,
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

