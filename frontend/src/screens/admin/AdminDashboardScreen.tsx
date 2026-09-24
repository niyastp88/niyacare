import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import api from '../../services/api';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  UserHome: undefined;
  AdminDashboard: undefined;
  AdminAppointments: undefined;
  AdminDoctors: undefined;
};

interface DashboardStats {
  totalDoctors: number;
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
}

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AdminDashboard'
>;

const AdminDashboardScreen = ({navigation}: Props) => {
  const [stats, setStats] = useState<DashboardStats>({
    totalDoctors: 0,
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  });

  const fetchDashboardStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');

      setStats(response.data);
    } catch (error: any) {
      console.log(
        'Dashboard stats error:',
        error?.response?.data || error,
      );
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('token');
              await AsyncStorage.removeItem('user');

              navigation.replace('Login');
            } catch (error) {
              console.log('Logout error:', error);

              Alert.alert(
                'Logout Failed',
                'Unable to logout. Please try again.',
              );
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              ADMIN PANEL
            </Text>

            <Text style={styles.title}>
              Dashboard
            </Text>

            <Text style={styles.subtitle}>
              Manage NiyaCare efficiently
            </Text>
          </View>
        </View>

        {/* Overview */}
        <Text style={styles.sectionTitle}>
          Overview
        </Text>

        <View style={styles.statsGrid}>
          {/* Doctors */}
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                styles.doctorIcon,
              ]}>
              <Text style={styles.statIconText}>
                +
              </Text>
            </View>

            <Text style={styles.statValue}>
              {stats.totalDoctors}
            </Text>

            <Text style={styles.statLabel}>
              Doctors
            </Text>
          </View>

          {/* Appointments */}
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                styles.appointmentIcon,
              ]}>
              <Text style={styles.statIconText}>
                ✓
              </Text>
            </View>

            <Text style={styles.statValue}>
              {stats.totalAppointments}
            </Text>

            <Text style={styles.statLabel}>
              Appointments
            </Text>
          </View>

          {/* Pending */}
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                styles.pendingIcon,
              ]}>
              <Text style={styles.statIconText}>
                !
              </Text>
            </View>

            <Text style={styles.statValue}>
              {stats.pendingAppointments}
            </Text>

            <Text style={styles.statLabel}>
              Pending
            </Text>
          </View>

          {/* Completed */}
          <View style={styles.statCard}>
            <View
              style={[
                styles.statIcon,
                styles.completedIcon,
              ]}>
              <Text style={styles.statIconText}>
                ✓
              </Text>
            </View>

            <Text style={styles.statValue}>
              {stats.completedAppointments}
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>
          </View>
        </View>

        {/* Management */}
        <Text style={styles.sectionTitle}>
          Management
        </Text>

        {/* Manage Doctors */}
        <TouchableOpacity
          style={styles.managementCard}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('AdminDoctors')
          }>
          <View
            style={[
              styles.managementIcon,
              styles.doctorManagementIcon,
            ]}>
            <Text style={styles.managementIconText}>
              +
            </Text>
          </View>

          <View style={styles.managementContent}>
            <Text style={styles.managementTitle}>
              Manage Doctors
            </Text>

            <Text style={styles.managementDescription}>
              Add, update and manage doctor availability
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </TouchableOpacity>

        {/* Manage Appointments */}
        <TouchableOpacity
          style={styles.managementCard}
          activeOpacity={0.8}
          onPress={() =>
            navigation.navigate('AdminAppointments')
          }>
          <View
            style={[
              styles.managementIcon,
              styles.appointmentManagementIcon,
            ]}>
            <Text style={styles.managementIconText}>
              ✓
            </Text>
          </View>

          <View style={styles.managementContent}>
            <Text style={styles.managementTitle}>
              Manage Appointments
            </Text>

            <Text style={styles.managementDescription}>
              Review and update appointment status
            </Text>
          </View>

          <Text style={styles.arrow}>
            ›
          </Text>
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.8}>
          <Text style={styles.logoutIcon}>
            ↪
          </Text>

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>

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
    paddingTop: 30,
    paddingBottom: 18,
  },

  header: {
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

  logoutButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 4,
  },

  logoutIcon: {
    fontSize: 20,
    color: '#DC2626',
    marginRight: 8,
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },

  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 18,
  },
});

export default AdminDashboardScreen;