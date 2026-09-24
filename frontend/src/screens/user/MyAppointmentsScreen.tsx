import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import api from '../../services/api';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  qualification?: string;
  experience?: number;
  consultationFee?: number;
  image?: string;
}

interface Appointment {
  _id: string;
  date: string;
  slot: string;
  tokenNumber: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  doctor: Doctor;
}

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  UserHome: undefined;
  AdminDashboard: undefined;
  DoctorList: undefined;
  DoctorDetails: {
    doctor: Doctor;
  };
  BookAppointment: {
    doctor: Doctor;
  };
  MyAppointments: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'MyAppointments'>;

const MyAppointmentsScreen = ({ navigation }: Props) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    try {
      setError('');

      const response = await api.get('/appointments/my');

      setAppointments(response.data.appointments);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Failed to load appointments. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, []),
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAppointments();
    setRefreshing(false);
  };

  const getStatusStyle = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return styles.confirmedStatus;

      case 'cancelled':
        return styles.cancelledStatus;

      case 'completed':
        return styles.completedStatus;

      default:
        return styles.pendingStatus;
    }
  };

  const getStatusTextStyle = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return styles.confirmedStatusText;

      case 'cancelled':
        return styles.cancelledStatusText;

      case 'completed':
        return styles.completedStatusText;

      default:
        return styles.pendingStatusText;
    }
  };

  const renderAppointment = (appointment: Appointment) => {
    return (
      <View key={appointment._id} style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.avatarText}>DR</Text>
          </View>

          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>{appointment.doctor.name}</Text>

            <Text style={styles.specialization}>
              {appointment.doctor.specialization}
            </Text>
          </View>

          <View
            style={[styles.statusBadge, getStatusStyle(appointment.status)]}
          >
            <Text
              style={[
                styles.statusText,
                getStatusTextStyle(appointment.status),
              ]}
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{appointment.date}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Time</Text>
            <Text style={styles.detailValue}>{appointment.slot}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Token</Text>
            <Text style={styles.detailValue}>#{appointment.tokenNumber}</Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0F9D9A" />
          <Text style={styles.loadingText}>Loading appointments...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0F9D9A']}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>MY APPOINTMENTS</Text>

          <Text style={styles.title}>Your appointments</Text>

          <Text style={styles.subtitle}>
            View and track all your doctor appointments.
          </Text>
        </View>

        {/* Error */}
        {error ? (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Something went wrong</Text>

            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Empty */}
        {!error && appointments.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Text style={styles.emptyIconText}>+</Text>
            </View>

            <Text style={styles.emptyTitle}>No appointments yet</Text>

            <Text style={styles.emptyText}>
              Book an appointment with a doctor to see it here.
            </Text>
          </View>
        ) : null}

        {/* Appointments */}
        {appointments.map(renderAppointment)}
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
    paddingTop: 20,
    paddingBottom: 35,
  },

  header: {
    marginBottom: 22,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#0F9D9A',
    marginBottom: 5,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    marginTop: 5,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },

  doctorInfo: {
    flex: 1,
  },

  doctorName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },

  specialization: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F9D9A',
  },

  statusBadge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  pendingStatus: {
    backgroundColor: '#FEF3C7',
  },

  pendingStatusText: {
    color: '#92400E',
  },

  confirmedStatus: {
    backgroundColor: '#DCFCE7',
  },

  confirmedStatusText: {
    color: '#166534',
  },

  cancelledStatus: {
    backgroundColor: '#FEE2E2',
  },

  cancelledStatusText: {
    color: '#991B1B',
  },

  completedStatus: {
    backgroundColor: '#DBEAFE',
  },

  completedStatusText: {
    color: '#1E40AF',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 15,
  },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  emptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  emptyIconText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#0F9D9A',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    textAlign: 'center',
  },

  errorCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#FECACA',
    marginBottom: 16,
  },

  errorTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
    marginBottom: 4,
  },

  errorText: {
    fontSize: 12,
    color: '#B91C1C',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 10,
  },
});

export default MyAppointmentsScreen;
