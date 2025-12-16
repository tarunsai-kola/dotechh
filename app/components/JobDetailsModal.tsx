import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_URL from '../constants/config';
import { useAuth } from '../context/AuthContext';

const COLORS = {
    primary: '#0EA5E9',
    background: '#020617',
    surface: '#0F172A',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    border: '#1E293B',
    success: '#22C55E',
};

interface JobDetailsModalProps {
    visible: boolean;
    jobId: string | null;
    onClose: () => void;
    hideApplyButton?: boolean;
}

export default function JobDetailsModal({ visible, jobId, onClose, hideApplyButton = false }: JobDetailsModalProps) {
    const { user } = useAuth();
    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);

    useEffect(() => {
        if (visible && jobId) {
            fetchJobDetails();
        }
    }, [visible, jobId]);

    const fetchJobDetails = async () => {
        if (!jobId) return;

        setLoading(true);
        try {
            const jobRes = await axios.get(`${API_URL}/jobs/${jobId}`);
            if (jobRes.data?.status === 'success') {
                setJob(jobRes.data.data);
            }

            if (user) {
                try {
                    const statusRes = await axios.get(`${API_URL}/applications/check/${jobId}`);
                    if (statusRes.data?.hasApplied) {
                        setHasApplied(true);
                    }
                } catch (e) {
                    // Not applied
                }
            }
        } catch (error) {
            console.error('Failed to fetch job:', error);
            Alert.alert('Error', 'Could not load job details');
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async () => {
        if (!user) {
            return Alert.alert('Sign In Required', 'Please sign in to apply for this job.');
        }

        setApplying(true);
        try {
            await axios.post(`${API_URL}/applications/${jobId}`, {});
            setHasApplied(true);
            Alert.alert('Success!', 'Application submitted successfully!');
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to apply';
            Alert.alert('Error', msg);
        } finally {
            setApplying(false);
        }
    };

    const handleClose = () => {
        setJob(null);
        setHasApplied(false);
        onClose();
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="fullScreen"
            onRequestClose={handleClose}
        >
            <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
                        <Ionicons name="close" size={28} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Job Details</Text>
                    <View style={{ width: 40 }} />
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                        <Text style={styles.loadingText}>Loading...</Text>
                    </View>
                ) : !job ? (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.errorText}>Job not found</Text>
                    </View>
                ) : (
                    <>
                        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                            {/* Job Header */}
                            <View style={styles.jobHeader}>
                                <View style={styles.logoContainer}>
                                    {job.companyId?.logoUrl ? (
                                        <Image source={{ uri: job.companyId.logoUrl }} style={styles.logo} />
                                    ) : (
                                        <Text style={styles.logoText}>{job.companyId?.name?.charAt(0) || 'C'}</Text>
                                    )}
                                </View>
                                <Text style={styles.title}>{job.title}</Text>
                                <Text style={styles.companyName}>
                                    {job.companyId?.name} • {job.location}
                                </Text>
                            </View>

                            {/* Job Details */}
                            <View style={styles.section}>
                                <Text style={styles.sectionHeader}>About the Role</Text>
                                <Text style={styles.bodyText}>{job.description}</Text>
                            </View>

                            {job.salaryRange && job.salaryRange.max > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionHeader}>Salary</Text>
                                    <Text style={styles.salaryText}>
                                        ${job.salaryRange.min?.toLocaleString()} - ${job.salaryRange.max?.toLocaleString()} / year
                                    </Text>
                                </View>
                            )}

                            {job.skills && job.skills.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionHeader}>Required Skills</Text>
                                    <View style={styles.skillsContainer}>
                                        {job.skills.map((skill: string, index: number) => (
                                            <View key={index} style={styles.skillTag}>
                                                <Text style={styles.skillText}>{skill}</Text>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            )}

                            {job.requirements && job.requirements.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionHeader}>Requirements</Text>
                                    {job.requirements.map((req: string, i: number) => (
                                        <View key={i} style={styles.bulletItem}>
                                            <Text style={styles.bullet}>•</Text>
                                            <Text style={styles.bulletText}>{req}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <View style={{ height: 100 }} />
                        </ScrollView>

                        {/* Footer Button - only show if not hidden */}
                        {!hideApplyButton && (
                            <View style={styles.footer}>
                                <TouchableOpacity
                                    style={[styles.applyBtn, (hasApplied || applying) && styles.applyBtnDisabled]}
                                    onPress={handleApply}
                                    disabled={hasApplied || applying}
                                >
                                    {applying ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <Text style={styles.applyBtnText}>
                                            {hasApplied ? 'Already Applied' : 'Apply Now'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}
                    </>
                )}
            </SafeAreaView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.surface },
    closeBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 12, color: COLORS.textSecondary },
    errorText: { fontSize: 16, color: COLORS.textSecondary },
    scrollView: { flex: 1 },
    jobHeader: { padding: 24, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: COLORS.surface },
    logoContainer: { width: 80, height: 80, borderRadius: 16, backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginBottom: 16, borderWidth: 1, borderColor: COLORS.border },
    logo: { width: 60, height: 60, resizeMode: 'contain' },
    logoText: { fontSize: 32, fontWeight: 'bold', color: COLORS.primary },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 8, textAlign: 'center' },
    companyName: { fontSize: 16, color: COLORS.textSecondary },
    section: { padding: 24, borderBottomWidth: 1, borderBottomColor: COLORS.border },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 12 },
    bodyText: { fontSize: 15, lineHeight: 24, color: COLORS.textSecondary },
    salaryText: { fontSize: 20, fontWeight: '600', color: COLORS.success },
    skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    skillTag: { backgroundColor: COLORS.border, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    skillText: { fontSize: 14, color: COLORS.primary, fontWeight: '500' },
    bulletItem: { flexDirection: 'row', marginBottom: 8 },
    bullet: { fontSize: 18, color: COLORS.textSecondary, marginRight: 12 },
    bulletText: { flex: 1, fontSize: 15, lineHeight: 22, color: COLORS.textSecondary },
    footer: { padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border, backgroundColor: COLORS.surface },
    applyBtn: { backgroundColor: COLORS.primary, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
    applyBtnDisabled: { backgroundColor: COLORS.textSecondary },
    applyBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});

