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
};

type Props = NativeStackScreenProps<RootStackParamList, 'UserHome'>;

const UserHomeScreen = ({navigation}: Props) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello 👋</Text>
            <Text style={styles.title}>Welcome to NiyaCare</Text>
          </View>

          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => navigation.replace('Login')}
            activeOpacity={0.8}>
            <Text style={styles.profileText}>U</Text>
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Your health{'\n'}matters to us.
            </Text>

            <Text style={styles.heroDescription}>
              Find trusted doctors and book your appointment easily.
            </Text>

            <TouchableOpacity
  style={styles.primaryButton}
  activeOpacity={0.8}
  onPress={() => navigation.navigate('DoctorList')}>
  <Text style={styles.primaryButtonText}>
    Find a Doctor
  </Text>
</TouchableOpacity>
          </View>

          <View style={styles.heroIconContainer}>
            <Text style={styles.heroIcon}>+</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8} onPress={() => navigation.navigate('DoctorList')}>
            <View style={[styles.actionIcon, styles.doctorIcon]}>
              <Text style={styles.iconText}>+</Text>
            </View>

            <Text style={styles.actionTitle}>Find Doctor</Text>
            <Text style={styles.actionDescription}>
              Browse specialists
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            activeOpacity={0.8}>
            <View style={[styles.actionIcon, styles.appointmentIcon]}>
              <Text style={styles.iconText}>✓</Text>
            </View>

            <Text style={styles.actionTitle}>Appointments</Text>
            <Text style={styles.actionDescription}>
              View your bookings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming Appointment */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming Appointment</Text>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.appointmentCard}>
          <View style={styles.doctorAvatar}>
            <Text style={styles.avatarText}>DR</Text>
          </View>

          <View style={styles.appointmentInfo}>
            <Text style={styles.doctorName}>
              No upcoming appointments
            </Text>

            <Text style={styles.appointmentText}>
              Book an appointment with a doctor
            </Text>
          </View>
        </View>

        {/* Health Tip */}
        <View style={styles.tipCard}>
          <View style={styles.tipIcon}>
            <Text style={styles.tipIconText}>♥</Text>
          </View>

          <View style={styles.tipContent}>
            <Text style={styles.tipTitle}>Health Tip</Text>

            <Text style={styles.tipText}>
              Regular health checkups can help detect health problems early.
            </Text>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.replace('Login')}
          activeOpacity={0.8}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

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
    paddingTop: 16,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  greeting: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },

  profileIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#CCFBF1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F766E',
  },

  heroCard: {
    minHeight: 190,
    borderRadius: 22,
    backgroundColor: '#0F9D9A',
    padding: 22,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 28,
  },

  heroContent: {
    flex: 1,
    paddingRight: 10,
  },

  heroTitle: {
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  heroDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#E6FFFB',
    marginTop: 10,
    marginBottom: 18,
  },

  primaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  primaryButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F766E',
  },

  heroIconContainer: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  heroIcon: {
    fontSize: 48,
    fontWeight: '300',
    color: '#FFFFFF',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },

  actionGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 28,
  },

  actionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
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

  iconText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#0F766E',
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },

  actionDescription: {
    fontSize: 12,
    color: '#64748B',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F9D9A',
    marginBottom: 14,
  },

  appointmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },

  doctorAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0369A1',
  },

  appointmentInfo: {
    flex: 1,
  },

  doctorName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 5,
  },

  appointmentText: {
    fontSize: 12,
    lineHeight: 17,
    color: '#64748B',
  },

  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 16,
  },

  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  tipIconText: {
    fontSize: 18,
    color: '#059669',
  },

  tipContent: {
    flex: 1,
  },

  tipTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 4,
  },

  tipText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#047857',
  },

  logoutButton: {
    marginTop: 24,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },
});

export default UserHomeScreen;