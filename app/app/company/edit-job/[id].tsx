import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import API_URL from '../../../constants/config';
import { useAuth } from '../../../context/AuthContext';

export default function EditJob() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { user } = useAuth();
    const scrollViewRef = useRef<ScrollView>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        type: 'Full-time',
        skills: '',
        experienceMin: '0',
        experienceMax: '5',
        requirements: '',
        responsibilities: '',
        status: 'published'
    });

    const companyId = user?.companyId;

    useEffect(() => {
        loadJob();
    }, [id]);

    const loadJob = async () => {
        try {
            const response = await axios.get(`${API_URL}/jobs/${id}`);
            const job = response.data.data;
            setFormData({
                title: job.title || '',
                description: job.description || '',
                location: job.location || '',
                type: job.employmentType || 'Full-time',
                skills: (job.skills || []).join(', '),
                experienceMin: (job.experienceMin || 0).toString(),
                experienceMax: (job.experienceMax || 5).toString(),
                requirements: (job.requirements || []).join('\n'),
                responsibilities: (job.responsibilities || []).join('\n'),
                status: job.status || 'published'
            });
        } catch (error) {
            console.error('Failed to load job:', error);
            Alert.alert('Error', 'Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.title || !formData.description || !formData.location) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(s => s);
            const reqArray = formData.requirements.split('\n').filter(r => r.trim());
            const respArray = formData.responsibilities.split('\n').filter(r => r.trim());

            await axios.put(`${API_URL}/companies/${companyId}/jobs/${id}`, {
                title: formData.title,
                description: formData.description,
                location: formData.location,
                employmentType: formData.type,
                skills: skillsArray,
                experienceMin: parseInt(formData.experienceMin),
                experienceMax: parseInt(formData.experienceMax),
                requirements: reqArray,
                responsibilities: respArray,
                status: formData.status
            });

            Alert.alert('Success', 'Job updated successfully!');
            router.back();
        } catch (error: any) {
            console.error('Failed to update job', error);
            Alert.alert('Error', `Failed to update job: ${error.response?.data?.message || error.message}`);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0EA5E9" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Edit Job</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 400 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Job Title *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.title}
                        onChangeText={(text) => setFormData({ ...formData, title: text })}
                        placeholder="e.g. Senior Frontend Engineer"
                        placeholderTextColor="#64748b"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Employment Type</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.type}
                            onValueChange={(value) => setFormData({ ...formData, type: value })}
                            style={styles.picker}
                            dropdownIconColor="#FFFFFF"
                        >
                            <Picker.Item label="Full-time" value="Full-time" />
                            <Picker.Item label="Part-time" value="Part-time" />
                            <Picker.Item label="Contract" value="Contract" />
                            <Picker.Item label="Internship" value="Internship" />
                            <Picker.Item label="Remote" value="Remote" />
                            <Picker.Item label="Hybrid" value="Hybrid" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Location *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.location}
                        onChangeText={(text) => setFormData({ ...formData, location: text })}
                        placeholder="e.g. New York, NY or Remote"
                        placeholderTextColor="#64748b"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Description *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={formData.description}
                        onChangeText={(text) => setFormData({ ...formData, description: text })}
                        placeholder="Describe the role..."
                        placeholderTextColor="#64748b"
                        multiline
                        numberOfLines={5}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Skills (comma separated)</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.skills}
                        onChangeText={(text) => setFormData({ ...formData, skills: text })}
                        placeholder="React, Node.js, TypeScript"
                        placeholderTextColor="#64748b"
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Min Exp</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.experienceMin}
                            onChangeText={(text) => setFormData({ ...formData, experienceMin: text })}
                            placeholder="0"
                            placeholderTextColor="#64748b"
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Max Exp</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.experienceMax}
                            onChangeText={(text) => setFormData({ ...formData, experienceMax: text })}
                            placeholder="5"
                            placeholderTextColor="#64748b"
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Status</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                            style={styles.picker}
                            dropdownIconColor="#FFFFFF"
                        >
                            <Picker.Item label="Published" value="published" />
                            <Picker.Item label="Draft" value="draft" />
                        </Picker>
                    </View>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#020617',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 10,
        backgroundColor: '#0F172A',
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
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
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
        marginBottom: 40,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#0F172A',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    cancelButtonText: {
        color: '#64748b',
        fontSize: 16,
        fontWeight: '600',
    },
    saveButton: {
        flex: 1,
        backgroundColor: '#0EA5E9',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
