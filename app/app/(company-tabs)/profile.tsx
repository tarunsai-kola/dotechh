import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import API_URL from '../../constants/config';
import { useAuth } from '../../context/AuthContext';

interface CompanyData {
    name: string;
    description: string;
    website: string;
    industry: string;
    size: string;
    location: string;
    email: string;
    phone: string;
}

export default function CompanyProfile() {
    const { user, signOut } = useAuth();
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [company, setCompany] = useState<CompanyData | null>(null);
    const [formData, setFormData] = useState<CompanyData>({
        name: '',
        description: '',
        website: '',
        industry: '',
        size: '',
        location: '',
        email: '',
        phone: ''
    });

    const companyId = user?.companyId;

    const loadCompany = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/companies/${companyId}`);
            const data = response.data.data;
            setCompany(data);
            setFormData({
                name: data.name || '',
                description: data.description || '',
                website: data.website || '',
                industry: data.industry || '',
                size: data.size || '',
                location: data.location || '',
                email: data.email || '',
                phone: data.phone || ''
            });
        } catch (error) {
            console.error('Failed to load company:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCompany();
    }, [companyId]);

    const handleSave = async () => {
        try {
            setSaving(true);
            await axios.put(`${API_URL}/companies/${companyId}`, formData);
            await loadCompany();
            setEditing(false);
            Alert.alert('Success', 'Company profile updated successfully!');
        } catch (error: any) {
            console.error('Failed to update company:', error);
            Alert.alert('Error', `Failed to update: ${error.response?.data?.message || error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setEditing(false);
        if (company) {
            setFormData({
                name: company.name || '',
                description: company.description || '',
                website: company.website || '',
                industry: company.industry || '',
                size: company.size || '',
                location: company.location || '',
                email: company.email || '',
                phone: company.phone || ''
            });
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0EA5E9" />
            </View>
        );
    }

    if (!company) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.errorText}>Company not found</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <View style={styles.logoContainer}>
                        <Ionicons name="business" size={40} color="#0EA5E9" />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.companyName}>{company.name}</Text>
                        <Text style={styles.location}>
                            <Ionicons name="location" size={14} color="#94A3B8" /> {company.location || 'Location not specified'}
                        </Text>
                    </View>
                </View>
                {!editing && (
                    <TouchableOpacity style={styles.editButton} onPress={() => setEditing(true)}>
                        <Ionicons name="create-outline" size={20} color="#0EA5E9" />
                        <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Main Content */}
            <View style={styles.content}>
                {editing ? (
                    // Edit Mode
                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Company Name</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.name}
                                onChangeText={(text) => setFormData({ ...formData, name: text })}
                                placeholder="Company Name"
                                placeholderTextColor="#64748b"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={formData.description}
                                onChangeText={(text) => setFormData({ ...formData, description: text })}
                                placeholder="Tell us about your company..."
                                placeholderTextColor="#64748b"
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Website</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.website}
                                onChangeText={(text) => setFormData({ ...formData, website: text })}
                                placeholder="https://example.com"
                                placeholderTextColor="#64748b"
                                keyboardType="url"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Industry</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.industry}
                                onChangeText={(text) => setFormData({ ...formData, industry: text })}
                                placeholder="e.g., Technology, Healthcare"
                                placeholderTextColor="#64748b"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Company Size</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={formData.size}
                                    onValueChange={(value) => setFormData({ ...formData, size: value })}
                                    style={styles.picker}
                                    dropdownIconColor="#FFFFFF"
                                >
                                    <Picker.Item label="Select size" value="" />
                                    <Picker.Item label="1-10 employees" value="1-10" />
                                    <Picker.Item label="11-50 employees" value="11-50" />
                                    <Picker.Item label="51-200 employees" value="51-200" />
                                    <Picker.Item label="201-500 employees" value="201-500" />
                                    <Picker.Item label="501-1000 employees" value="501-1000" />
                                    <Picker.Item label="1000+ employees" value="1000+" />
                                </Picker>
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Location</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.location}
                                onChangeText={(text) => setFormData({ ...formData, location: text })}
                                placeholder="City, Country"
                                placeholderTextColor="#64748b"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                placeholder="contact@company.com"
                                placeholderTextColor="#64748b"
                                keyboardType="email-address"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Phone</Text>
                            <TextInput
                                style={styles.input}
                                value={formData.phone}
                                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                                placeholder="+1 (555) 123-4567"
                                placeholderTextColor="#64748b"
                                keyboardType="phone-pad"
                            />
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actions}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#FFFFFF" />
                                ) : (
                                    <>
                                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                                        <Text style={styles.saveButtonText}>Save Changes</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                                <Ionicons name="close" size={20} color="#64748b" />
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    // View Mode
                    <View style={styles.viewMode}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>ABOUT</Text>
                            <Text style={styles.sectionText}>
                                {company.description || 'No description provided yet.'}
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>COMPANY INFO</Text>
                            {company.industry && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="business-outline" size={18} color="#64748b" />
                                    <Text style={styles.infoText}>{company.industry}</Text>
                                </View>
                            )}
                            {company.size && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="people-outline" size={18} color="#64748b" />
                                    <Text style={styles.infoText}>{company.size} employees</Text>
                                </View>
                            )}
                            {company.location && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="location-outline" size={18} color="#64748b" />
                                    <Text style={styles.infoText}>{company.location}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>CONTACT</Text>
                            {company.email && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="mail-outline" size={18} color="#64748b" />
                                    <Text style={styles.infoText}>{company.email}</Text>
                                </View>
                            )}
                            {company.phone && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="call-outline" size={18} color="#64748b" />
                                    <Text style={styles.infoText}>{company.phone}</Text>
                                </View>
                            )}
                            {company.website && (
                                <View style={styles.infoRow}>
                                    <Ionicons name="globe-outline" size={18} color="#64748b" />
                                    <Text style={styles.infoText}>{company.website}</Text>
                                </View>
                            )}
                        </View>

                        <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                            <Text style={styles.logoutButtonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#020617',
    },
    errorText: {
        color: '#64748b',
        fontSize: 16,
    },
    header: {
        backgroundColor: '#0EA5E9',
        padding: 20,
        paddingTop: 10,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    logoContainer: {
        width: 64,
        height: 64,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    headerText: {
        flex: 1,
    },
    companyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    location: {
        fontSize: 14,
        color: '#E0F2FE',
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
        alignSelf: 'flex-start',
    },
    editButtonText: {
        color: '#0EA5E9',
        fontSize: 14,
        fontWeight: '600',
    },
    content: {
        padding: 20,
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
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        backgroundColor: '#0F172A',
        borderWidth: 1,
        borderColor: '#1E293B',
        borderRadius: 12,
        overflow: 'hidden',
    },
    picker: {
        color: '#FFFFFF',
    },
    actions: {
        gap: 12,
        marginTop: 8,
    },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0EA5E9',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F172A',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    cancelButtonText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '600',
    },
    viewMode: {
        gap: 24,
    },
    section: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#94A3B8',
        letterSpacing: 1,
    },
    sectionText: {
        fontSize: 15,
        color: '#CBD5E1',
        lineHeight: 22,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoText: {
        fontSize: 15,
        color: '#CBD5E1',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EF444415',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        borderWidth: 1,
        borderColor: '#EF4444',
        marginTop: 16,
    },
    logoutButtonText: {
        color: '#EF4444',
        fontSize: 16,
        fontWeight: '600',
    },
});
