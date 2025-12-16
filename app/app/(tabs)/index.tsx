import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import API_URL from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import JobDetailsModal from '../../components/JobDetailsModal';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ applied: 0, interview: 0, rejected: 0, offer: 0 });
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const fetchDashboardData = async () => {
    try {
      // Fetch profile
      try {
        const profileRes = await axios.get(`${API_URL}/profile/me`);
        if (profileRes.data.status === 'success') {
          setUserProfile(profileRes.data.profile);
        }
      } catch (err) {
        console.log('Profile fetch failed, using fallback');
      }

      const response = await axios.get(`${API_URL}/applications/my-applications`);

      if (response.data.status === 'success') {
        const apps = response.data.data;
        setRecentApps(apps.slice(0, 5));

        const newStats = { applied: 0, interview: 0, rejected: 0, offer: 0 };
        apps.forEach((app: any) => {
          let status = app.status.toLowerCase();
          if (status === 'accepted' || status === 'hired') status = 'offer';
          if (status === 'shortlisted') status = 'interview';

          if (status === 'applied') newStats.applied++;
          else if (status === 'interview') newStats.interview++;
          else if (status === 'rejected') newStats.rejected++;
          else if (status === 'offer') newStats.offer++;
          else newStats.applied++;
        });
        setStats(newStats);
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const StatCard = ({ label, value, color, icon }: any) => (
    <View style={[styles.statCard, { borderLeftColor: color }]}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  const getStatusColor = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'offer' || statusLower === 'accepted') return '#22C55E';
    if (statusLower === 'rejected') return '#EF4444';
    if (statusLower === 'interview' || statusLower === 'shortlisted') return '#8B5CF6';
    return '#9CA3AF';
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Brand Header */}
      <View style={styles.brandContainer}>
        <Text style={styles.brandText}>doltec</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.statsGrid}>
          <StatCard label="Applied" value={stats.applied} color="#9CA3AF" icon="paper-plane" />
          <StatCard label="Interviews" value={stats.interview} color="#8B5CF6" icon="people" />
          <StatCard label="Offers" value={stats.offer} color="#22C55E" icon="checkmark-circle" />
          <StatCard label="Rejected" value={stats.rejected} color="#EF4444" icon="close-circle" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Applications</Text>
          <TouchableOpacity onPress={() => router.push('/application-history' as any)}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0EA5E9" />
        ) : recentApps.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No applications yet.</Text>
            <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(tabs)/jobs')}>
              <Text style={styles.browseBtnText}>Browse Jobs</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {recentApps.map((app) => (
              <TouchableOpacity
                key={app._id}
                style={styles.appCard}
                onPress={() => {
                  if (app.jobId?._id) {
                    setSelectedJobId(app.jobId._id);
                    setModalVisible(true);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.companyLogo}>
                  <Text style={styles.companyInitial}>
                    {app.jobId?.companyId?.name?.charAt(0) || 'C'}
                  </Text>
                </View>
                <View style={styles.appInfo}>
                  <Text style={styles.jobTitle}>{app.jobId?.title || 'Unknown Job'}</Text>
                  <Text style={styles.companyName}>{app.jobId?.companyId?.name || 'Unknown Company'}</Text>
                  <Text style={styles.date}>{new Date(app.appliedAt).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(app.status) + '20' }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(app.status) }]}>
                    {app.status}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <JobDetailsModal
        visible={modalVisible}
        jobId={selectedJobId}
        onClose={() => {
          setModalVisible(false);
          setSelectedJobId(null);
        }}
        hideApplyButton={true}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  scrollContent: {
    padding: 24,
  },
  brandContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#0F172A',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  brandText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0EA5E9',
    letterSpacing: 1,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  seeAll: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },
  appCard: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  companyLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  companyInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0EA5E9',
  },
  appInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  companyName: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  browseBtn: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
