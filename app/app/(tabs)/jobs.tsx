import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import API_URL from '@/constants/config';
import { Link, useFocusEffect, useRouter } from 'expo-router';
import JobDetailsModal from '../../components/JobDetailsModal';

const COLORS = {
    primary: '#0EA5E9',
    background: '#020617',
    surface: '#0F172A',
    text: '#FFFFFF',
    textSecondary: '#9CA3AF',
    border: '#1E293B',
    success: '#22C55E',
};

const CATEGORIES = ['All', 'Software', 'Design', 'Marketing', 'Sales', 'Remote', 'Internship'];

export default function JobsScreen() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    const fetchJobs = async () => {
        try {
            const params: any = {};
            if (searchTerm) params.q = searchTerm;

            const response = await axios.get(`${API_URL}/jobs`, { params });

            if (response.data.status === 'success') {
                let jobsList = response.data.data;
                if (activeCategory !== 'All') {
                    jobsList = jobsList.filter((job: any) =>
                        JSON.stringify(job).toLowerCase().includes(activeCategory.toLowerCase())
                    );
                }
                setJobs(jobsList);
            }
        } catch (error) {
            console.error('Fetch jobs error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchJobs();
        }, [searchTerm, activeCategory])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchJobs();
    };

    const getTimeAgo = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
        return past.toLocaleDateString();
    };

    const renderJobItem = ({ item }: { item: any }) => {
        const handlePress = () => {
            console.log('Opening modal for job:', item._id);
            setSelectedJobId(item._id);
            setModalVisible(true);
        };

        return (
            <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={handlePress}>
                <View style={styles.cardHeader}>
                    <View style={styles.logoContainer}>
                        {item.companyId?.logoUrl ? (
                            <Image source={{ uri: item.companyId.logoUrl }} style={styles.logo} />
                        ) : (
                            <Text style={styles.logoText}>{item.companyId?.name?.charAt(0) || 'C'}</Text>
                        )}
                    </View>
                    <View style={styles.headerContent}>
                        <Text style={styles.jobTitle} numberOfLines={1}>{item.title}</Text>
                        <Text style={styles.companyName} numberOfLines={1}>{item.companyId?.name || 'Company'}</Text>
                    </View>
                    <Ionicons name="bookmark-outline" size={22} color={COLORS.textSecondary} />
                </View>

                <View style={styles.tagsRow}>
                    {item.location && (
                        <View style={styles.tag}>
                            <Ionicons name="location-outline" size={12} color={COLORS.textSecondary} />
                            <Text style={styles.tagText}>{item.location}</Text>
                        </View>
                    )}
                    {item.type && (
                        <View style={styles.tag}>
                            <Ionicons name="briefcase-outline" size={12} color={COLORS.textSecondary} />
                            <Text style={styles.tagText}>{item.type}</Text>
                        </View>
                    )}
                    {item.skills && (
                        <View style={styles.tag}>
                            <Ionicons name="code-outline" size={12} color={COLORS.primary} />
                            <Text style={[styles.tagText, { color: COLORS.primary }]}>{item.skills.join('  ')}</Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardFooter}>
                    <Text style={styles.timeAgo}>{getTimeAgo(item.createdAt)}</Text>
                    <View style={styles.applyLink}>
                        <Text style={styles.applyText}>View Details</Text>
                        <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Find your next</Text>
                    <Text style={styles.heading}>Dream Job</Text>
                </View>
                <TouchableOpacity style={styles.profileBtn}>
                    <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color={COLORS.textSecondary} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for roles, companies..."
                        placeholderTextColor={COLORS.textSecondary}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
                <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="options" size={20} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.categoriesContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catContent}>
                    {CATEGORIES.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
                            onPress={() => setActiveCategory(cat)}
                        >
                            <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {loading && !refreshing ? (
                <View style={styles.loadingCenter}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <FlatList
                    data={jobs}
                    renderItem={renderJobItem}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="search-outline" size={64} color={COLORS.border} />
                            <Text style={styles.emptyText}>No jobs found</Text>
                        </View>
                    }
                />
            )}

            <JobDetailsModal
                visible={modalVisible}
                jobId={selectedJobId}
                onClose={() => {
                    setModalVisible(false);
                    setSelectedJobId(null);
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { paddingHorizontal: 20, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    greeting: { fontSize: 16, color: COLORS.textSecondary },
    heading: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginTop: 4 },
    profileBtn: { padding: 8, backgroundColor: COLORS.surface, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border },
    searchContainer: { flexDirection: 'row', paddingHorizontal: 20, marginTop: 20, gap: 12 },
    searchBar: { flex: 1, height: 50, backgroundColor: COLORS.surface, borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.border },
    searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: COLORS.text },
    filterBtn: { width: 50, height: 50, backgroundColor: COLORS.primary, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    categoriesContainer: { marginTop: 20, marginBottom: 10 },
    catContent: { paddingHorizontal: 20, gap: 10 },
    catChip: { paddingVertical: 8, paddingHorizontal: 16, backgroundColor: COLORS.surface, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
    catChipActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary, borderWidth: 0 },
    catText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: '600' },
    catTextActive: { color: '#FFFFFF' },
    listContent: { padding: 20, gap: 16 },
    card: { backgroundColor: COLORS.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: COLORS.border },
    cardHeader: { flexDirection: 'row', alignItems: 'center' },
    logoContainer: { width: 48, height: 48, borderRadius: 12, backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
    logo: { width: 32, height: 32, resizeMode: 'contain' },
    logoText: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
    headerContent: { flex: 1, marginLeft: 14 },
    jobTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.text, marginBottom: 2 },
    companyName: { fontSize: 14, color: COLORS.textSecondary },
    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 },
    tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.border, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, gap: 4 },
    tagText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '500' },
    cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
    timeAgo: { fontSize: 12, color: COLORS.textSecondary },
    applyLink: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    applyText: { fontSize: 13, fontWeight: '600', color: COLORS.primary },
    loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyState: { alignItems: 'center', marginTop: 60 },
    emptyText: { marginTop: 16, fontSize: 16, color: COLORS.textSecondary }
});
