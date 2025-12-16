import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert } from 'react-native';
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
    description: string;
    salaryRange?: { min: number; max: number };
}

export default function CompanyJobs() {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

    const companyId = user?.companyId;

    const loadJobs = async () => {
        try {
            if (companyId) {
                const response = await axios.get(`${API_URL}/companies/${companyId}/jobs`);
                console.log('Jobs loaded:', response.data);
                setJobs(response.data.data || []);
            }
        } catch (error) {
            console.error('Failed to load jobs', error);
            Alert.alert('Error', 'Failed to load jobs');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, [companyId]);

    const onRefresh = () => {
        setRefreshing(true);
        loadJobs();
    };

    const handleDeleteJob = async (jobId: string) => {
        Alert.alert(
            'Delete Job',
            'Are you sure you want to delete this job posting?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await axios.delete(`${API_URL}/companies/${companyId}/jobs/${jobId}`);
                            Alert.alert('Success', 'Job deleted successfully');
                            loadJobs();
                        } catch (error) {
                            console.error('Delete error:', error);
                            Alert.alert('Error', 'Failed to delete job');
                        }
                    }
                }
            ]
        );
    };

    const filteredJobs = jobs.filter(job => {
        if (filter === 'all') return true;
        return job.status === filter;
    });

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0EA5E9" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Manage Jobs</Text>
                <TouchableOpacity
                    style={styles.postButton}
                    onPress={() => router.push('/company/post-job')}
                >
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.postButtonText}>Post Job</Text>
                </TouchableOpacity>
            </View>

            {/* Filters */}
            <View style={styles.filters}>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                        All ({jobs.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'published' && styles.filterButtonActive]}
                    onPress={() => setFilter('published')}
                >
                    <Text style={[styles.filterText, filter === 'published' && styles.filterTextActive]}>
                        Published ({jobs.filter(j => j.status === 'published').length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'draft' && styles.filterButtonActive]}
                    onPress={() => setFilter('draft')}
                >
                    <Text style={[styles.filterText, filter === 'draft' && styles.filterTextActive]}>
                        Draft ({jobs.filter(j => j.status === 'draft').length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Jobs List */}
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0EA5E9" />
                }
            >
                {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                        <View key={job._id} style={styles.jobCard}>
                            <View style={styles.jobHeader}>
                                <Text style={styles.jobTitle}>{job.title}</Text>
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
                            <Text style={styles.jobLocation}>
                                <Ionicons name="location-outline" size={14} color="#64748b" /> {job.location}
                            </Text>
                            <Text style={styles.jobType}>{job.employmentType}</Text>
                            <Text style={styles.jobDescription} numberOfLines={2}>{job.description}</Text>

                            <View style={styles.jobActions}>
                                <TouchableOpacity
                                    style={styles.editButton}
                                    onPress={() => router.push(`/company/edit-job/${job._id}`)}
                                >
                                    <Ionicons name="create-outline" size={18} color="#0EA5E9" />
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => handleDeleteJob(job._id)}
                                >
                                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                                    <Text style={styles.deleteButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="briefcase-outline" size={64} color="#64748b" />
                        <Text style={styles.emptyText}>No jobs found</Text>
                        {filter !== 'all' && (
                            <Text style={styles.emptySubtext}>Try changing the filter</Text>
                        )}
                    </View>
                )}
            </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    postButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0EA5E9',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    postButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 16,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#0F172A',
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    filterButtonActive: {
        backgroundColor: '#0EA5E915',
        borderColor: '#0EA5E9',
    },
    filterText: {
        fontSize: 13,
        color: '#64748b',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#0EA5E9',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    jobCard: {
        backgroundColor: '#0F172A',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1E293B',
        marginBottom: 12,
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    jobTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#FFFFFF',
        flex: 1,
        marginRight: 8,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
    },
    statusPublished: {
        backgroundColor: '#10B98115',
    },
    statusDraft: {
        backgroundColor: '#64748b15',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    statusTextPublished: {
        color: '#10B981',
    },
    statusTextDraft: {
        color: '#64748b',
    },
    jobLocation: {
        fontSize: 14,
        color: '#64748b',
        marginBottom: 4,
    },
    jobType: {
        fontSize: 14,
        color: '#94A3B8',
        marginBottom: 8,
    },
    jobDescription: {
        fontSize: 14,
        color: '#94A3B8',
        lineHeight: 20,
        marginBottom: 16,
    },
    jobActions: {
        flexDirection: 'row',
        gap: 12,
    },
    editButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#0EA5E915',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#0EA5E9',
    },
    editButtonText: {
        color: '#0EA5E9',
        fontSize: 14,
        fontWeight: '600',
    },
    deleteButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#EF444415',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    deleteButtonText: {
        color: '#EF4444',
        fontSize: 14,
        fontWeight: '600',
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 80,
    },
    emptyText: {
        fontSize: 18,
        color: '#64748b',
        marginTop: 16,
        fontWeight: '500',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#475569',
        marginTop: 8,
    },
});
