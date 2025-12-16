import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_URL from '../../constants/config';
import { useAuth } from '../../context/AuthContext';

interface Job {
    _id: string;
    title: string;
    location: string;
    employmentType: string;
    status: string;
}

export default function CompanyDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [companyName, setCompanyName] = useState<string>('Company');
    const [stats, setStats] = useState({
        activeJobs: 0,
        totalApplicants: 0,
        interviews: 0,
        timeToHire: '18d'
    });

    const companyId = user?.companyId;

    const loadData = async () => {
        try {
            if (companyId) {
                // Load company info
                const companyResponse = await axios.get(`${API_URL}/companies/${companyId}`);
                const company = companyResponse.data.data;
                setCompanyName(company?.name || 'Company');

                // Load jobs from backend
                const response = await axios.get(`${API_URL}/companies/${companyId}/jobs`);
                console.log('Jobs loaded:', response.data);
                const jobsList = response.data.data || [];
                setJobs(jobsList);

                // Fetch applications count
                let totalApplicants = 0;
                for (const job of jobsList) {
                    try {
                        const appResponse = await axios.get(
                            `${API_URL}/companies/${companyId}/jobs/${job._id}/applications`
                        );
                        const apps = appResponse.data.data || [];
                        totalApplicants += apps.length;
                    } catch (err) {
                        console.log(`No applications for job ${job._id}`);
                    }
                }

                // Update stats
                setStats(prev => ({
                    ...prev,
                    activeJobs: jobsList.filter(j => j.status === 'published').length,
                    totalApplicants: totalApplicants
                }));
            }
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [companyId]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0EA5E9" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0EA5E9" />
            }
        >
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.companyName}>{companyName}</Text>
                </View>
                <TouchableOpacity
                    style={styles.postButton}
                    onPress={() => router.push('/company/post-job')}
                >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.postButtonText}>Post Job</Text>
                </TouchableOpacity>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsGrid}>
                <StatCard title="Active Jobs" value={stats.activeJobs} icon="briefcase" color="#3B82F6" />
                <StatCard title="Applicants" value={stats.totalApplicants} icon="people" color="#8B5CF6" />
                <StatCard title="Interviews" value={stats.interviews} icon="checkmark-circle" color="#10B981" />
                <StatCard title="Time to Hire" value={stats.timeToHire} icon="trending-up" color="#F59E0B" />
            </View>

            {/* Recent Jobs */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Jobs</Text>
                {jobs.length > 0 ? (
                    jobs.slice(0, 5).map((job) => (
                        <TouchableOpacity
                            key={job._id}
                            style={styles.jobCard}
                            onPress={() => router.push(`/company/edit-job/${job._id}`)}
                        >
                            <View style={styles.jobIcon}>
                                <Ionicons name="document-text" size={20} color="#0EA5E9" />
                            </View>
                            <View style={styles.jobInfo}>
                                <View style={styles.jobHeader}>
                                    <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
                                    <View style={[
                                        styles.statusBadge,
                                        job.status === 'published' ? styles.statusPublished : styles.statusDraft
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            job.status === 'published' ? styles.statusTextPublished : styles.statusTextDraft
                                        ]}>
                                            {job.status}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.jobDetails}>{job.location} • {job.employmentType}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="briefcase-outline" size={48} color="#64748b" />
                        <Text style={styles.emptyText}>No jobs posted yet</Text>
                        <TouchableOpacity
                            style={styles.emptyButton}
                            onPress={() => router.push('/company/post-job')}
                        >
                            <Text style={styles.emptyButtonText}>Post Your First Job</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

interface StatCardProps {
    title: string;
    value: number | string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

function StatCard({ title, value, icon, color }: StatCardProps) {
    return (
        <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: `${color}15` }]}>
                <Ionicons name={icon} size={24} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
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
        padding: 20,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginBottom: 16,
    },
    postButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0EA5E9',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        gap: 6,
        alignSelf: 'flex-start',
    },
    postButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 12,
        gap: 12,
    },
    statCard: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: '#0F172A',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    statIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    statTitle: {
        fontSize: 13,
        color: '#94A3B8',
        fontWeight: '500',
    },
    section: {
        padding: 20,
        paddingTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    jobCard: {
        flexDirection: 'row',
        backgroundColor: '#0F172A',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1E293B',
        marginBottom: 12,
        gap: 12,
    },
    jobIcon: {
        width: 40,
        height: 40,
        backgroundColor: '#0EA5E915',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    jobInfo: {
        flex: 1,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    jobTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusPublished: {
        backgroundColor: '#10B98115',
    },
    statusDraft: {
        backgroundColor: '#64748b15',
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    statusTextPublished: {
        color: '#10B981',
    },
    statusTextDraft: {
        color: '#64748b',
    },
    jobDetails: {
        fontSize: 13,
        color: '#64748b',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 48,
    },
    emptyText: {
        fontSize: 16,
        color: '#64748b',
        marginTop: 16,
        marginBottom: 24,
    },
    emptyButton: {
        backgroundColor: '#0EA5E9',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    emptyButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    greeting: {
        fontSize: 14,
        color: '#94A3B8',
        marginBottom: 4,
    },
    companyName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
