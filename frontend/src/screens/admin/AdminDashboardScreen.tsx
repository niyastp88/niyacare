import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  UserHome: undefined;
  AdminDashboard: undefined;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminDashboard'
>;

const AdminDashboardScreen = ({navigation}: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>ADMIN PANEL</Text>
            <Text style={styles.title}>Dashboard</Text>
            <Text style={styles.subtitle}>
              Manage NiyaCare efficiently
            </Text>
          </View>

          <View style={styles.adminAvatar}>
            <Text style={styles.adminAvatarText}>A</Text>
          </View>
        </View>

        <TouchableOpacity
  onPress={() => navigation.replace('Login')}
  style={styles.logoutButton}>
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>

        {/* Overview */}
        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.doctorIcon]}>
              <Text style={styles.statIconText}>+</Text>
            </View>

            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Doctors</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.appointmentIcon]}>
              <Text style={styles.statIconText}>✓</Text>
            </View>

            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Appointments</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.pendingIcon]}>
              <Text style={styles.statIconText}>!</Text>
            </View>

            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIcon, styles.completedIcon]}>
              <Text style={styles.statIconText}>✓</Text>
            </View>

            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Management */}
        <Text style={styles.sectionTitle}>Management</Text>

        <TouchableOpacity
          style={styles.managementCard}
          activeOpacity={0.8}>
          <View style={[styles.managementIcon, styles.doctorManagementIcon]}>
            <Text style={styles.managementIconText}>+</Text>
          </View>

          <View style={styles.managementContent}>
            <Text style={styles.managementTitle}>Manage Doctors</Text>
            <Text style={styles.managementDescription}>
              Add, update and manage doctor availability
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.managementCard}
          activeOpacity={0.8}>
          <View
            style={[
              styles.managementIcon,
              styles.appointmentManagementIcon,
            ]}>
            <Text style={styles.managementIconText}>✓</Text>
          </View>

          <View style={styles.managementContent}>
            <Text style={styles.managementTitle}>
              Manage Appointments
            </Text>
            <Text style={styles.managementDescription}>
              Review and update appointment status
            </Text>
          </View>

          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>i</Text>
          </View>

          <Text style={styles.emptyTitle}>No recent activity</Text>

          <Text style={styles.emptyDescription}>
            New appointments and activities will appear here.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          NiyaCare Admin • Healthcare Management
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  container: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#0F9D9A',
    marginBottom: 4,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  adminAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  adminAvatarText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F766E',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  statIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  doctorIcon: {
    backgroundColor: '#CCFBF1',
  },

  appointmentIcon: {
    backgroundColor: '#DBEAFE',
  },

  pendingIcon: {
    backgroundColor: '#FEF3C7',
  },

  completedIcon: {
    backgroundColor: '#DCFCE7',
  },

  statIconText: {
    fontSize: 19,
    fontWeight: '700',
    color: '#0F766E',
  },

  statValue: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },

  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  managementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },

  managementIcon: {
    width: 46,
    height: 46,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  doctorManagementIcon: {
    backgroundColor: '#CCFBF1',
  },

  appointmentManagementIcon: {
    backgroundColor: '#DBEAFE',
  },

  managementIconText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F766E',
  },

  managementContent: {
    flex: 1,
  },

  managementTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },

  managementDescription: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748B',
  },

  arrow: {
    fontSize: 28,
    color: '#94A3B8',
    marginLeft: 8,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },

  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F9D9A',
    marginBottom: 14,
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 24,
    alignItems: 'center',
  },

  emptyIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  emptyIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748B',
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 5,
  },

  emptyDescription: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    textAlign: 'center',
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 28,
  },
  logoutButton: {
  backgroundColor: '#0F9D9A',
  borderRadius: 10,
  paddingVertical: 10,
  paddingHorizontal: 18,
  alignSelf: 'flex-end',
  marginBottom: 20,
},

logoutText: {
  color: '#FFFFFF',
  fontSize: 14,
  fontWeight: '700',
},
});

export default AdminDashboardScreen;