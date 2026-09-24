import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

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
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'DoctorList'
>;

const DoctorListScreen = ({navigation}: Props) => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/doctors');

      setDoctors(response.data.doctors);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Failed to load doctors. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const renderDoctor = ({item}: {item: Doctor}) => {
    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() =>
          navigation.navigate('DoctorDetails', {
            doctor: item,
          })
        }>
        {/* Doctor Avatar */}
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>DR</Text>
        </View>

        {/* Doctor Information */}
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>

          <Text style={styles.specialization}>
            {item.specialization}
          </Text>

          <Text style={styles.qualification}>
            {item.qualification} • {item.experience} years experience
          </Text>

          <View style={styles.bottomRow}>
            <View style={styles.feeContainer}>
              <Text style={styles.feeLabel}>Fee</Text>

              <Text style={styles.fee}>
                ₹{item.consultationFee}
              </Text>
            </View>

            <View style={styles.tokenContainer}>
              <Text style={styles.tokenLabel}>Tokens</Text>

              <Text style={styles.availability}>
                {item.dailyTokens}/day
              </Text>
            </View>
          </View>
        </View>

        {/* Arrow */}
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>›</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size="large"
            color="#0F9D9A"
          />
        </View>

        <Text style={styles.loadingText}>
          Finding doctors...
        </Text>

        <Text style={styles.loadingSubtext}>
          Please wait a moment
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <View style={styles.errorIcon}>
          <Text style={styles.errorIconText}>!</Text>
        </View>

        <Text style={styles.errorTitle}>
          Something went wrong
        </Text>

        <Text style={styles.errorText}>
          {error}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          activeOpacity={0.9}
          onPress={fetchDoctors}>
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.eyebrow}>
          NIYACARE
        </Text>

        <Text style={styles.title}>
          Find a Doctor
        </Text>

        <Text style={styles.subtitle}>
          Choose a doctor and book your appointment
        </Text>
      </View>

      {/* Doctor Count */}
      {doctors.length > 0 && (
        <View style={styles.resultHeader}>
          <Text style={styles.resultText}>
            Available Doctors
          </Text>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {doctors.length}
            </Text>
          </View>
        </View>
      )}

      {/* Doctor List */}
      {doctors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Text style={styles.emptyIconText}>+</Text>
          </View>

          <Text style={styles.emptyTitle}>
            No doctors available
          </Text>

          <Text style={styles.emptyText}>
            Doctors will appear here when they are added
            by the admin.
          </Text>
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={item => item._id}
          renderItem={renderDoctor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  header: {
    marginBottom: 18,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: '#0F9D9A',
    marginBottom: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 5,
    lineHeight: 19,
  },

  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  resultText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },

  countBadge: {
    minWidth: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingHorizontal: 7,
  },

  countText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F766E',
  },

  list: {
    paddingBottom: 30,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F766E',
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 3,
  },

  specialization: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F9D9A',
    marginBottom: 4,
  },

  qualification: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },

  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 9,
  },

  feeContainer: {
    marginRight: 18,
  },

  feeLabel: {
    fontSize: 9,
    color: '#94A3B8',
    marginBottom: 1,
  },

  fee: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E293B',
  },

  tokenContainer: {
    marginLeft: 4,
  },

  tokenLabel: {
    fontSize: 9,
    color: '#94A3B8',
    marginBottom: 1,
  },

  availability: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  arrowContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  arrow: {
    fontSize: 24,
    lineHeight: 27,
    color: '#64748B',
  },

  center: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  loaderContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  loadingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },

  loadingSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 5,
  },

  errorIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },

  errorIconText: {
    fontSize: 25,
    fontWeight: '800',
    color: '#DC2626',
  },

  errorTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },

  errorText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 18,
  },

  retryButton: {
    backgroundColor: '#0F9D9A',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  emptyIconText: {
    fontSize: 34,
    fontWeight: '300',
    color: '#0F766E',
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },

  emptyText: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
    textAlign: 'center',
  },
});

export default DoctorListScreen;