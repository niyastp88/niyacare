import React, {useCallback, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import api from '../../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  qualification?: string;
  consultationFee?: number;
}

interface Appointment {
  _id: string;
  user: User;
  doctor: Doctor;
  date: string;
  slot: string;
  tokenNumber: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

const AdminAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAppointments = async () => {
    try {
      const response = await api.get('/appointments/admin');

      setAppointments(response.data.appointments);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Failed to load appointments. Please try again.';

      Alert.alert('Error', message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAppointments();
    }, []),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchAppointments();
  };

  const handleStatusUpdate = async (
    appointmentId: string,
    status: 'confirmed' | 'cancelled' | 'completed',
  ) => {
    try {
      await api.put(`/appointments/${appointmentId}/status`, {
        status,
      });

      await fetchAppointments();
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Failed to update appointment status. Please try again.';

      Alert.alert('Update Failed', message);
    }
  };

  // Check whether appointment date is today
  const isToday = (date: string) => {
    const today = new Date();

    const todayString = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-');

    return date === todayString;
  };

  const getStatusStyle = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return styles.pendingBadge;

      case 'confirmed':
        return styles.confirmedBadge;

      case 'cancelled':
        return styles.cancelledBadge;

      case 'completed':
        return styles.completedBadge;

      default:
        return styles.pendingBadge;
    }
  };

  const getStatusTextStyle = (status: Appointment['status']) => {
    switch (status) {
      case 'pending':
        return styles.pendingText;

      case 'confirmed':
        return styles.confirmedText;

      case 'cancelled':
        return styles.cancelledText;

      case 'completed':
        return styles.completedText;

      default:
        return styles.pendingText;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0F766E" />

          <Text style={styles.loadingText}>
            Loading appointments...
          </Text>
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
            colors={['#0F766E']}
          />
        }>
        <View style={styles.header}>
          <Text style={styles.title}>Manage Appointments</Text>

          <Text style={styles.subtitle}>
            Review and manage patient appointments
          </Text>
        </View>

        {appointments.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>
              No Appointments
            </Text>

            <Text style={styles.emptyText}>
              There are no appointments available.
            </Text>
          </View>
        ) : (
          appointments.map(appointment => (
            <View
              key={appointment._id}
              style={styles.card}>
              {/* Top Row */}
              <View style={styles.topRow}>
                <View>
                  <Text style={styles.tokenLabel}>
                    Token
                  </Text>

                  <Text style={styles.tokenNumber}>
                    #{appointment.tokenNumber}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    getStatusStyle(appointment.status),
                  ]}>
                  <Text
                    style={[
                      styles.statusText,
                      getStatusTextStyle(
                        appointment.status,
                      ),
                    ]}>
                    {appointment.status
                      .charAt(0)
                      .toUpperCase() +
                      appointment.status.slice(1)}
                  </Text>
                </View>
              </View>

              {/* Patient */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  Patient
                </Text>

                <Text style={styles.patientName}>
                  {appointment.user?.name}
                </Text>

                <Text style={styles.patientEmail}>
                  {appointment.user?.email}
                </Text>
              </View>

              {/* Doctor */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  Doctor
                </Text>

                <Text style={styles.doctorName}>
                  Dr. {appointment.doctor?.name}
                </Text>

                <Text style={styles.specialization}>
                  {appointment.doctor?.specialization}
                </Text>
              </View>

              {/* Appointment Details */}
              <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>
                    Date
                  </Text>

                  <Text style={styles.detailValue}>
                    {appointment.date}
                  </Text>
                </View>

                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>
                    Time
                  </Text>

                  <Text style={styles.detailValue}>
                    {appointment.slot}
                  </Text>
                </View>
              </View>

              {/* Pending Actions */}
              {appointment.status === 'pending' && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    activeOpacity={0.8}
                    onPress={() =>
                      handleStatusUpdate(
                        appointment._id,
                        'cancelled',
                      )
                    }>
                    <Text style={styles.cancelButtonText}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.confirmButton}
                    activeOpacity={0.8}
                    onPress={() =>
                      handleStatusUpdate(
                        appointment._id,
                        'confirmed',
                      )
                    }>
                    <Text style={styles.confirmButtonText}>
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Complete Action - Current Day Only */}
              {appointment.status === 'confirmed' &&
                isToday(appointment.date) && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.completeButton}
                      activeOpacity={0.8}
                      onPress={() =>
                        handleStatusUpdate(
                          appointment._id,
                          'completed',
                        )
                      }>
                      <Text style={styles.completeButtonText}>
                        Mark as Completed
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
            </View>
          ))
        )}
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
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  tokenLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },

  tokenNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F766E',
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  pendingBadge: {
    backgroundColor: '#FEF3C7',
  },

  pendingText: {
    color: '#92400E',
  },

  confirmedBadge: {
    backgroundColor: '#DCFCE7',
  },

  confirmedText: {
    color: '#166534',
  },

  cancelledBadge: {
    backgroundColor: '#FEE2E2',
  },

  cancelledText: {
    color: '#991B1B',
  },

  completedBadge: {
    backgroundColor: '#DBEAFE',
  },

  completedText: {
    color: '#1D4ED8',
  },

  section: {
    marginBottom: 16,
  },

  sectionLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },

  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  patientEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },

  doctorName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },

  specialization: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },

  detailsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 14,
    marginTop: 2,
    marginBottom: 16,
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  cancelButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B91C1C',
  },

  confirmButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  completeButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  completeButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#64748B',
  },

  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  emptyText: {
    marginTop: 6,
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default AdminAppointmentsScreen;