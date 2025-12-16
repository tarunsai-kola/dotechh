import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_URL from '../../constants/config';
import { useAuth } from '../../context/AuthContext';

const COLORS = {
    primary: '#2563eb',
    background: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    border: '#f1f5f9',
    success: '#10b981',
};

export default function JobDetails() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { user } = useAuth();

    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [hasApplied, setHasApplied] = useState(false);
    const [forceUpdateCounter, setForceUpdateCounter] = useState(0);

    useEffect(() => {
        console.log('=== JobDetails Effect Running ===');
        console.log('ID:', id);

        if (!id) {
            console.log('No ID, aborting');
            setLoading(false);
            return;
        }

        const fetchDetails = async () => {
            console.log('Fetching job details...');
            try {
                const jobRes = await axios.get(`${API_URL}/jobs/${id}`);
                console.log('Job fetch complete:', jobRes.data?.data?.title);

                if (jobRes.data?.status === 'success') {
                    console.log('About to call setJob with:', jobRes.data.data.title);
                    setJob(jobRes.data.data);
                    console.log('setJob called - job should update now');
                    // Force re-render
                    setTimeout(() => {
                        console.log('Forcing re-render...');
                        setForceUpdateCounter(prev => prev + 1);
                    }, 50);
                }

                // Check application status
                if (user) {
                    try {
                        const statusRes = await axios.get(`${API_URL}/applications/check/${id}`);
                        if (statusRes.data?.hasApplied) {
                            setHasApplied(true);
                        }
                    } catch (e) {
                        // Not applied
                    }
                }
            } catch (error) {
                console.error('Fetch error:', error);
            } finally {
                console.log('About to call setLoading(false)');
                setLoading(false);
                console.log('setLoading called');
                console.log('=== Fetch Complete ===');
            }
        };

        fetchDetails();

        return () => {
            console.log('!!! COMPONENT UNMOUNTING !!!');
        };
    }, [id]);

    // Track state changes
    useEffect(() => {
        console.log('>>> STATE CHANGE - Job:', job?.title || 'null', 'Loading:', loading);
    }, [job, loading]);

    const handleApply = async () => {
        if (!user) {
            return Alert.alert('Sign In Required', 'Please sign in to apply.', [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Sign In', onPress: () => router.push('/login') }
            ]);
        }

        setApplying(true);
        try {
            await axios.post(`${API_URL}/applications/${id}`, {});
            setHasApplied(true);
            Alert.alert('Success!', 'Application submitted!', [
                { text: 'Dashboard', onPress: () => router.push('/(tabs)') }
            ]);
        } catch (error: any) {
            const msg = error.response?.data?.message || 'Failed to apply';
            Alert.alert('Error', msg);
        } finally {
            setApplying(false);
        }
    };

    const shareJob = async () => {
        if (!job) return;
        try {
            await Share.share({
                message: `Check out this ${job.title} role at ${job.companyId?.name}!`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    console.log('Rendering - Loading:', loading, 'Job:', !!job);

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 16, color: COLORS.textSecondary }}>Loading job details...</Text>
            </View>
        );
    }

    if (!job) {
        return (
            <View style={styles.centerContainer}>
                <Text style={{ color: COLORS.textSecondary, fontSize: 16 }}>Job not found</Text>
                <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
                    <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const isApplyDisabled = hasApplied || applying;
    const applyButtonText = hasApplied ? 'Applied' : 'Easy Apply';

    return (
        <View style={styles.container}>
            <View style={styles.navBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.navTitle} numberOfLines={1}>{job.companyId?.name || 'Job Details'}</Text>
                <TouchableOpacity style={styles.backBtn} onPress={shareJob}>
                    <Ionicons name="share-social-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <View style={styles.logoWrapper}>
                        {job.companyId?.logoUrl ? (
                            <Image source={{ uri: job.companyId.logoUrl }} style={styles.logo} />
                        ) : (
                            <Text style={styles.logoText}>{job.companyId?.name?.charAt(0) || 'C'}</Text>
                        )}
                    </View>
                    <Text style={styles.title}>{job.title}</Text>
                    <Text style={styles.companyName}>
                        {job.companyId?.name} • {job.location} • {job.employmentType || job.type}
                    </Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>About the job</Text>
                    <Text style={styles.bodyText}>{job.description}</Text>

                    {job.salaryRange && job.salaryRange.max > 0 && (
                        <View style={styles.infoBox}>
                            <View style={styles.infoRow}>
                                <Ionicons name="cash-outline" size={20} color={COLORS.text} />
                                <View style={{ marginLeft: 12 }}>
                                    <Text style={styles.infoTitle}>Salary</Text>
                                    <Text style={styles.infoValue}>
                                        ${job.salaryRange.min?.toLocaleString()} - ${job.salaryRange.max?.toLocaleString()} / yr
                                    </Text>
                                </View>
                            </View>
                        </View>
                    )}

                    {job.skills && job.skills.length > 0 && (
                        <View style={{ marginTop: 24 }}>
                            <Text style={styles.subHeader}>Skills Required</Text>
                            <View style={styles.tagsContainer}>
                                {job.skills.map((skill: string, index: number) => (
                                    <View key={index} style={styles.tag}>
                                        <Text style={styles.tagText}>{skill}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {job.requirements && job.requirements.length > 0 && (
                        <View style={{ marginTop: 24 }}>
                            <Text style={styles.subHeader}>Requirements</Text>
                            {job.requirements.map((item: string, i: number) => (
                                <View key={i} style={styles.bulletRow}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bodyText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {job.responsibilities && job.responsibilities.length > 0 && (
                        <View style={{ marginTop: 24 }}>
                            <Text style={styles.subHeader}>Responsibilities</Text>
                            {job.responsibilities.map((item: string, i: number) => (
                                <View key={i} style={styles.bulletRow}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bodyText}>{item}</Text>
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>About the company</Text>
                    <Text style={styles.bodyText}>
                        {job.companyId?.description || `${job.companyId?.name} is a leading company in the industry.`}
                    </Text>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            <SafeAreaView edges={['bottom']} style={styles.footer}>
                <TouchableOpacity
                    style={[styles.applyBtn, isApplyDisabled && styles.disabledBtn]}
                    onPress={handleApply}
                    disabled={isApplyDisabled}
                >
                    {applying ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.applyBtnText}>{applyButtonText}</Text>
                    )}
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    navBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, backgroundColor: '#fff' },
    navTitle: { fontSize: 16, fontWeight: '600', color: COLORS.text, maxWidth: '70%' },
    backBtn: { padding: 8 },
    scrollContent: { paddingBottom: 40 },
    header: { padding: 24, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: COLORS.border },
    logoWrapper: { width: 64, height: 64, borderRadius: 12, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
    logo: { width: 40, height: 40, resizeMode: 'contain' },
    logoText: { fontSize: 24, fontWeight: 'bold', color: COLORS.textSecondary },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginBottom: 8 },
    companyName: { fontSize: 16, color: COLORS.textSecondary, marginBottom: 16 },
    section: { padding: 24, borderBottomWidth: 8, borderBottomColor: '#f8fafc' },
    sectionHeader: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 16 },
    subHeader: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: 12 },
    bodyText: { fontSize: 15, lineHeight: 24, color: '#334155' },
    infoBox: { marginTop: 24, padding: 16, backgroundColor: '#f8fafc', borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoTitle: { fontSize: 14, color: COLORS.textSecondary },
    infoValue: { fontSize: 15, fontWeight: '600', color: COLORS.text, marginTop: 2 },
    tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tag: { backgroundColor: '#eff6ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
    tagText: { fontSize: 14, color: COLORS.primary, fontWeight: '500' },
    bulletRow: { flexDirection: 'row', marginBottom: 8, paddingRight: 10 },
    bullet: { fontSize: 16, color: COLORS.textSecondary, marginRight: 12, marginTop: -2 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 5 },
    applyBtn: { backgroundColor: COLORS.primary, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
    disabledBtn: { backgroundColor: COLORS.textSecondary },
    applyBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
