import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_URL from '../../constants/config';
import { useAuth } from '../../context/AuthContext';

interface Application {
    _id: string;
    jobId: { title: string; _id: string };
    profileId: {
        fullName: string;
        _id: string;
        email?: string;
        phone?: string;
        bio?: string;
        skills?: string[];
        experience?: any[];
        education?: any[];
    };
    studentUserId?: { email: string };
    status: string;
    appliedAt: string;
    resumeUrl?: string;
}

export default function CompanyApplicants() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [applications, setApplications] = useState<Application[]>([]);
    const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
    const [selectedApplicant, setSelectedApplicant] = useState<Application | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const companyId = user?.companyId;

    const loadApplicants = async () => {
        try {
            if (companyId) {
                console.log('===== LOADING APPLICANTS =====');
                console.log('Company ID:', companyId);

                // First, get all jobs for this company
                const jobsResponse = await axios.get(`${API_URL}/companies/${companyId}/jobs`);
                const jobs = jobsResponse.data.data || [];
                console.log('Jobs found:', jobs.length);

                if (jobs.length === 0) {
                    setApplications([]);
                    setLoading(false);
                    setRefreshing(false);
                    return;
                }

                // Get applications for all jobs
                const allApplications: Application[] = [];
                for (const job of jobs) {
                    try {
                        console.log(`Fetching applications for job: ${job.title} (${job._id})`);
                        const appResponse = await axios.get(
                            `${API_URL}/companies/${companyId}/jobs/${job._id}/applications`
                        );
                        const apps = appResponse.data.data || [];
                        console.log(`Found ${apps.length} applications for ${job.title}`);

                        // Log each application's structure
                        apps.forEach((app: any, index: number) => {
                            console.log(`\n=== Application ${index + 1} ===`);
                            console.log('Application ID:', app._id);
                            console.log('Status:', app.status, 'Type:', typeof app.status);
                            console.log('ProfileId type:', typeof app.profileId);
                            console.log('ProfileId value:', app.profileId);
                            console.log('JobId type:', typeof app.jobId);
                            console.log('JobId value:', app.jobId);
                            if (app.profileId) {
                                console.log('Profile fullName:', app.profileId.fullName);
                                console.log('Profile _id:', app.profileId._id);
                            }
                        });

                        allApplications.push(...apps);
                    } catch (err) {
                        console.log(`No applications for job ${job._id}`, err);
                    }
                }

                console.log('\n===== TOTAL APPLICATIONS:', allApplications.length, '=====\n');
                setApplications(allApplications);
            }
        } catch (error) {
            console.error('Failed to load applicants', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadApplicants();
    }, [companyId]);

    const onRefresh = () => {
        setRefreshing(true);
        loadApplicants();
    };

    const updateApplicationStatus = async (applicationId: string, newStatus: string) => {
        try {
            await axios.put(`${API_URL}/applications/${applicationId}/status`, {
                status: newStatus
            });
            Alert.alert('Success', `Application ${newStatus}`);
            loadApplicants();
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Error', 'Failed to update application status');
        }
    };

    const filteredApplications = applications.filter(app => {
        if (filter === 'all') return true;
        return app.status === filter;
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
                <Text style={styles.headerTitle}>Applicants</Text>
                <Text style={styles.headerSubtitle}>{applications.length} total applications</Text>
            </View>

            {/* Filters */}
            <View style={styles.filters}>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                        All ({applications.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
                    onPress={() => setFilter('pending')}
                >
                    <Text style={[styles.filterText, filter === 'pending' && styles.filterTextActive]}>
                        Pending ({applications.filter(a => a.status === 'pending').length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'accepted' && styles.filterButtonActive]}
                    onPress={() => setFilter('accepted')}
                >
                    <Text style={[styles.filterText, filter === 'accepted' && styles.filterTextActive]}>
                        Accepted ({applications.filter(a => a.status === 'accepted').length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'rejected' && styles.filterButtonActive]}
                    onPress={() => setFilter('rejected')}
                >
                    <Text style={[styles.filterText, filter === 'rejected' && styles.filterTextActive]}>
                        Rejected ({applications.filter(a => a.status === 'rejected').length})
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Applications List */}
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#0EA5E9" />
                }
            >
                {filteredApplications.length > 0 ? (
                    filteredApplications.map((app) => (
                        <TouchableOpacity
                            key={app._id}
                            style={styles.applicationCard}
                            onPress={() => {
                                setSelectedApplicant(app);
                                setModalVisible(true);
                            }}
                            activeOpacity={0.7}
                        >
                            <View style={styles.applicantHeader}>
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        {app.profileId?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                    </Text>
                                </View>
                                <View style={styles.applicantInfo}>
                                    <Text style={styles.applicantName}>
                                        {app.profileId?.fullName || 'Unknown Applicant'}
                                    </Text>
                                    <Text style={styles.jobTitle}>
                                        Applied for: {app.jobId?.title || 'Unknown Job'}
                                    </Text>
                                    <Text style={styles.appliedDate}>
                                        {new Date(app.appliedAt).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View style={[
                                    styles.statusBadge,
                                    app.status === 'accepted' && styles.statusAccepted,
                                    app.status === 'rejected' && styles.statusRejected,
                                    (app.status === 'pending' || app.status === 'applied') && styles.statusPending,
                                ]}>
                                    <Text style={[
                                        styles.statusText,
                                        app.status === 'accepted' && styles.statusTextAccepted,
                                        app.status === 'rejected' && styles.statusTextRejected,
                                        (app.status === 'pending' || app.status === 'applied') && styles.statusTextPending,
                                    ]}>
                                        {String(app.status || 'pending').toUpperCase()}
                                    </Text>
                                </View>
                            </View>

                            {app.status === 'pending' || app.status === 'applied' ? (
                                <View style={styles.cardActions}>
                                    <TouchableOpacity
                                        style={styles.cardAcceptButton}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            updateApplicationStatus(app._id, 'accepted');
                                        }}
                                    >
                                        <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                                        <Text style={styles.cardAcceptText}>Accept</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.cardRejectButton}
                                        onPress={(e) => {
                                            e.stopPropagation();
                                            updateApplicationStatus(app._id, 'rejected');
                                        }}
                                    >
                                        <Ionicons name="close-circle" size={18} color="#EF4444" />
                                        <Text style={styles.cardRejectText}>Reject</Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.cardActionsPlaceholder} />
                            )}
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Ionicons name="people-outline" size={64} color="#64748b" />
                        <Text style={styles.emptyText}>No applicants found</Text>
                        {filter !== 'all' && (
                            <Text style={styles.emptySubtext}>Try changing the filter</Text>
                        )}
                    </View>
                )}
            </ScrollView>

            {/* Applicant Detail Modal */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={false}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>Applicant Details</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <Ionicons name="close" size={28} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalContent}>
                        {selectedApplicant && (
                            <>
                                <View style={styles.modalSection}>
                                    <View style={styles.largeAvatar}>
                                        <Text style={styles.largeAvatarText}>
                                            {selectedApplicant.profileId?.fullName?.charAt(0)?.toUpperCase() || 'U'}
                                        </Text>
                                    </View>
                                    <Text style={styles.modalName}>
                                        {selectedApplicant.profileId?.fullName || 'Unknown'}
                                    </Text>
                                    <Text style={styles.modalEmail}>
                                        {selectedApplicant.studentUserId?.email || 'No email'}
                                    </Text>
                                </View>

                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionLabel}>Applied For</Text>
                                    <Text style={styles.sectionValue}>
                                        {selectedApplicant.jobId?.title || 'Unknown Job'}
                                    </Text>
                                </View>

                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionLabel}>Applied Date</Text>
                                    <Text style={styles.sectionValue}>
                                        {new Date(selectedApplicant.appliedAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Text>
                                </View>

                                <View style={styles.modalSection}>
                                    <Text style={styles.sectionLabel}>Status</Text>
                                    <View style={[
                                        styles.statusBadge,
                                        selectedApplicant.status === 'accepted' && styles.statusAccepted,
                                        selectedApplicant.status === 'rejected' && styles.statusRejected,
                                        (selectedApplicant.status === 'pending' || selectedApplicant.status === 'applied') && styles.statusPending,
                                    ]}>
                                        <Text style={[
                                            styles.statusText,
                                            selectedApplicant.status === 'accepted' && styles.statusTextAccepted,
                                            selectedApplicant.status === 'rejected' && styles.statusTextRejected,
                                            (selectedApplicant.status === 'pending' || selectedApplicant.status === 'applied') && styles.statusTextPending,
                                        ]}>
                                            {String(selectedApplicant.status || 'pending').charAt(0).toUpperCase() + String(selectedApplicant.status || 'pending').slice(1)}
                                        </Text>
                                    </View>
                                </View>

                                {selectedApplicant.profileId?.bio && (
                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionLabel}>Bio</Text>
                                        <Text style={styles.sectionValue}>
                                            {selectedApplicant.profileId.bio}
                                        </Text>
                                    </View>
                                )}

                                {selectedApplicant.profileId?.skills && selectedApplicant.profileId.skills.length > 0 && (
                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionLabel}>Skills</Text>
                                        <View style={styles.skillsContainer}>
                                            {selectedApplicant.profileId.skills.map((skill, index) => (
                                                <View key={index} style={styles.skillChip}>
                                                    <Text style={styles.skillText}>{skill.name || skill}</Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                )}

                                {selectedApplicant.profileId?.phone && (
                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionLabel}>Phone</Text>
                                        <Text style={styles.sectionValue}>
                                            {selectedApplicant.profileId.phone}
                                        </Text>
                                    </View>
                                )}

                                {selectedApplicant.resumeUrl && (
                                    <View style={styles.modalSection}>
                                        <Text style={styles.sectionLabel}>Resume</Text>
                                        <TouchableOpacity style={styles.resumeButton}>
                                            <Ionicons name="document-text" size={20} color="#0EA5E9" />
                                            <Text style={styles.resumeButtonText}>View Resume</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {selectedApplicant.status === 'pending' && (
                                    <View style={styles.modalActions}>
                                        <TouchableOpacity
                                            style={styles.modalAcceptButton}
                                            onPress={() => {
                                                updateApplicationStatus(selectedApplicant._id, 'accepted');
                                                setModalVisible(false);
                                            }}
                                        >
                                            <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                                            <Text style={styles.modalAcceptButtonText}>Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.modalRejectButton}
                                            onPress={() => {
                                                updateApplicationStatus(selectedApplicant._id, 'rejected');
                                                setModalVisible(false);
                                            }}
                                        >
                                            <Ionicons name="close-circle" size={20} color="#FFFFFF" />
                                            <Text style={styles.modalRejectButtonText}>Reject</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </>
                        )}
                    </ScrollView>
                </View>
            </Modal>
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
    },
    filters: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 8,
        marginBottom: 16,
        flexWrap: 'wrap',
    },
    filterButton: {
        paddingHorizontal: 12,
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
        fontSize: 12,
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
    applicationCard: {
        backgroundColor: '#0F172A',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#1E293B',
        marginBottom: 12,
    },
    applicantHeader: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#0EA5E915',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    applicantInfo: {
        flex: 1,
    },
    applicantName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    jobTitle: {
        fontSize: 14,
        color: '#94A3B8',
        marginBottom: 4,
    },
    appliedDate: {
        fontSize: 12,
        color: '#64748b',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    statusPending: {
        backgroundColor: '#F59E0B15',
    },
    statusAccepted: {
        backgroundColor: '#10B98115',
    },
    statusRejected: {
        backgroundColor: '#EF444415',
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    statusTextPending: {
        color: '#F59E0B',
    },
    statusTextAccepted: {
        color: '#10B981',
    },
    statusTextRejected: {
        color: '#EF4444',
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    acceptButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        backgroundColor: '#10B98115',
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#10B981',
    },
    acceptButtonText: {
        color: '#10B981',
        fontSize: 14,
        fontWeight: '600',
    },
    rejectButton: {
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
    rejectButtonText: {
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
    avatarText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0EA5E9',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#020617',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#0F172A',
        borderBottomWidth: 1,
        borderBottomColor: '#1E293B',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    modalSection: {
        marginBottom: 24,
    },
    largeAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#0EA5E915',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 16,
    },
    largeAvatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#0EA5E9',
    },
    modalName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 8,
    },
    modalEmail: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    sectionValue: {
        fontSize: 16,
        color: '#FFFFFF',
        lineHeight: 24,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillChip: {
        backgroundColor: '#0EA5E915',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#0EA5E9',
    },
    skillText: {
        fontSize: 14,
        color: '#0EA5E9',
        fontWeight: '500',
    },
    resumeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#0F172A',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#0EA5E9',
    },
    resumeButtonText: {
        fontSize: 14,
        color: '#0EA5E9',
        fontWeight: '600',
    },
    modalActions: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 20,
    },
    modalAcceptButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#10B981',
        paddingVertical: 14,
        borderRadius: 12,
    },
    modalAcceptButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalRejectButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#EF4444',
        paddingVertical: 14,
        borderRadius: 12,
    },
    modalRejectButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cardActions: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
    },
    cardAcceptButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        backgroundColor: '#10B98110',
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#10B981',
    },
    cardAcceptText: {
        color: '#10B981',
        fontSize: 13,
        fontWeight: '600',
    },
    cardRejectButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
        backgroundColor: '#EF444410',
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EF4444',
    },
    cardRejectText: {
        color: '#EF4444',
        fontSize: 13,
        fontWeight: '600',
    },
    cardActionsPlaceholder: {
        height: 0,
    },
});
