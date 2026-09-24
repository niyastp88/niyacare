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
  DoctorList: undefined;
  DoctorDetails: {
    doctor: Doctor;
  };
  BookAppointment: {
  doctor: Doctor;
};
};

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

type Props = NativeStackScreenProps<
  RootStackParamList,
  'DoctorDetails'
>;

const DoctorDetailsScreen = ({route, navigation}: Props) => {
  const {doctor} = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* Doctor Header */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DR</Text>
          </View>

          <Text style={styles.name}>{doctor.name}</Text>

          <Text style={styles.specialization}>
            {doctor.specialization}
          </Text>

          <Text style={styles.qualification}>
            {doctor.qualification}
          </Text>
        </View>

        {/* Professional Information */}
        <Text style={styles.sectionTitle}>
          Professional Information
        </Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Experience</Text>
            <Text style={styles.infoValue}>
              {doctor.experience} years
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Consultation Fee</Text>
            <Text style={styles.infoValue}>
              ₹{doctor.consultationFee}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Daily Tokens</Text>
            <Text style={styles.infoValue}>
              {doctor.dailyTokens}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Start Time</Text>
            <Text style={styles.infoValue}>
              {doctor.startTime}
            </Text>
          </View>
        </View>

        {/* Availability */}
        <Text style={styles.sectionTitle}>
          Available Days
        </Text>

        <View style={styles.daysCard}>
          <View style={styles.daysContainer}>
            {doctor.availableDays.map(day => (
              <View
                key={day}
                style={styles.dayBadge}>
                <Text style={styles.dayText}>{day}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Booking */}
        <View style={styles.bookingCard}>
          <Text style={styles.bookingTitle}>
            Ready to book?
          </Text>

          <Text style={styles.bookingDescription}>
            Select a date and available time slot to book
            your appointment.
          </Text>

          <TouchableOpacity
  style={styles.bookButton}
  activeOpacity={0.8}
  onPress={() =>
    navigation.navigate('BookAppointment', {
      doctor,
    })
  }>
  <Text style={styles.bookButtonText}>
    Book Appointment
  </Text>
</TouchableOpacity>
        </View>
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
    paddingBottom: 30,
  },

  profileSection: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 26,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },

  avatar: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },

  avatarText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F766E',
  },

  name: {
    fontSize: 23,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 6,
  },

  specialization: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F9D9A',
    marginBottom: 5,
  },

  qualification: {
    fontSize: 13,
    color: '#64748B',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
  },

  infoLabel: {
    fontSize: 13,
    color: '#64748B',
  },

  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },

  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },

  daysCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  dayBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },

  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#047857',
  },

  bookingCard: {
    backgroundColor: '#F0FDFA',
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },

  bookingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#134E4A',
    marginBottom: 6,
  },

  bookingDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#0F766E',
    marginBottom: 18,
  },

  bookButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#0F9D9A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bookButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default DoctorDetailsScreen;