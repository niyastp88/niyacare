import React, { useCallback, useState } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import api from '../../services/api';

interface Doctor {
  _id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  image?: string;
  availableDays: string[];
  startTime: string;
  dailyTokens: number;
  isActive: boolean;
}

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  UserHome: undefined;
  AdminDashboard: undefined;
  AdminAppointments: undefined;
  AdminDoctors: undefined;
  AddDoctor: undefined;
  EditDoctor: {
    doctor: Doctor;
  };
};

type Props = NativeStackScreenProps<RootStackParamList, 'AdminDoctors'>;

const AdminDoctorsScreen = ({ navigation }: Props) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDoctors = async () => {
    try {
      const response = await api.get('/doctors/admin');

      setDoctors(response.data.doctors);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Failed to load doctors. Please try again.';

      Alert.alert('Error', message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDoctors();
    }, []),
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDoctors();
  };

  const handleToggleDoctor = (doctor: Doctor) => {
    const isDeactivating = doctor.isActive;

    Alert.alert(
      isDeactivating ? 'Deactivate Doctor' : 'Activate Doctor',
      isDeactivating
        ? `Are you sure you want to deactivate Dr. ${doctor.name}?`
        : `Do you want to activate Dr. ${doctor.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: isDeactivating ? 'Deactivate' : 'Activate',
          style: isDeactivating ? 'destructive' : 'default',
          onPress: async () => {
            try {
              const endpoint = isDeactivating
                ? `/doctors/${doctor._id}/deactivate`
                : `/doctors/${doctor._id}/activate`;

              await api.put(endpoint);

              Alert.alert(
                'Success',
                isDeactivating
                  ? 'Doctor deactivated successfully.'
                  : 'Doctor activated successfully.',
              );

              fetchDoctors();
            } catch (error: any) {
              const message =
                error?.response?.data?.message || 'Something went wrong.';

              Alert.alert('Action Failed', message);
            }
          },
        },
      ],
    );
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0F766E" />

          <Text style={styles.loadingText}>Loading doctors...</Text>
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
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Manage Doctors</Text>

            <Text style={styles.subtitle}>Add and manage doctors</Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('AddDoctor')}
          >
            <Text style={styles.addButtonText}>+ Add Doctor</Text>
          </TouchableOpacity>
        </View>

        {/* Doctors Count */}
        <View style={styles.countCard}>
          <Text style={styles.countLabel}>Total Doctors</Text>

          <Text style={styles.countValue}>{doctors.length}</Text>
        </View>

        {/* Empty State */}
        {doctors.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Doctors Found</Text>

            <Text style={styles.emptyText}>
              Add a doctor to start managing your appointments.
            </Text>
          </View>
        ) : (
          doctors.map(doctor => (
            <View key={doctor._id} style={styles.doctorCard}>
              {/* Doctor Header */}
              <View style={styles.doctorHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {doctor.name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>Dr. {doctor.name}</Text>

                  <Text style={styles.specialization}>
                    {doctor.specialization}
                  </Text>
                </View>
              </View>

              {/* Doctor Details */}
              <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Qualification</Text>

                  <Text style={styles.detailValue}>{doctor.qualification}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Experience</Text>

                  <Text style={styles.detailValue}>
                    {doctor.experience} years
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Consultation Fee</Text>

                  <Text style={styles.detailValue}>
                    ₹{doctor.consultationFee}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Start Time</Text>

                  <Text style={styles.detailValue}>{doctor.startTime}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Daily Tokens</Text>

                  <Text style={styles.detailValue}>{doctor.dailyTokens}</Text>
                </View>
              </View>

              {/* Available Days */}
              <View style={styles.daysSection}>
                <Text style={styles.detailLabel}>Available Days</Text>

                <View style={styles.daysContainer}>
                  {doctor.availableDays.map(day => (
                    <View key={day} style={styles.dayBadge}>
                      <Text style={styles.dayText}>{day.substring(0, 3)}</Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actionRow}>
                {/* Edit */}
                <TouchableOpacity
                  style={styles.editButton}
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('EditDoctor', {
                      doctor,
                    })
                  }
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>

                {/* Activate/Deactivate */}
                <TouchableOpacity
                  style={
                    doctor.isActive
                      ? styles.deactivateButton
                      : styles.activateButton
                  }
                  activeOpacity={0.8}
                  onPress={() => handleToggleDoctor(doctor)}
                >
                  <Text
                    style={
                      doctor.isActive
                        ? styles.deactivateButtonText
                        : styles.activateButtonText
                    }
                  >
                    {doctor.isActive ? 'Deactivate' : 'Activate'}
                  </Text>
                </TouchableOpacity>
              </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  headerContent: {
    flex: 1,
    marginRight: 10,
  },

  title: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: '#64748B',
  },

  addButton: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },

  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  countCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },

  countLabel: {
    fontSize: 13,
    color: '#64748B',
  },

  countValue: {
    marginTop: 4,
    fontSize: 28,
    fontWeight: '800',
    color: '#0F766E',
  },

  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F766E',
  },

  doctorInfo: {
    flex: 1,
    marginLeft: 12,
  },

  doctorName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },

  specialization: {
    marginTop: 3,
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '600',
  },

  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 12,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  detailLabel: {
    fontSize: 12,
    color: '#64748B',
  },

  detailValue: {
    maxWidth: '60%',
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'right',
  },

  daysSection: {
    marginTop: 4,
    marginBottom: 16,
  },

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },

  dayBadge: {
    backgroundColor: '#F0FDFA',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  dayText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F766E',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 14,
  },

  editButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },

  deleteButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B91C1C',
  },

  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  deactivateButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deactivateButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B45309',
  },

  activateButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activateButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#15803D',
  },
});

export default AdminDoctorsScreen;
