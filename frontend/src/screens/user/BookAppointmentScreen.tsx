import React, {useMemo, useState} from 'react';
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
  BookAppointment: {
    doctor: Doctor;
  };
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'BookAppointment'
>;

const BookAppointmentScreen = ({route, navigation}: Props) => {
  const {doctor} = route.params;

  const [selectedDate, setSelectedDate] = useState<string | null>(
    null,
  );

  const [selectedSlot, setSelectedSlot] = useState<string | null>(
    null,
  );

  const [booking, setBooking] = useState(false);

  // How many slots to display at first
  const [visibleSlotCount, setVisibleSlotCount] = useState(30);

  const dates = useMemo(() => {
    const result: {
      date: string;
      day: string;
      dayNumber: string;
    }[] = [];

    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const date = new Date(today);

      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleDateString('en-US', {
        weekday: 'long',
      });

      const dayNumber = String(date.getDate()).padStart(2, '0');

      const month = String(date.getMonth() + 1).padStart(2, '0');

      const year = date.getFullYear();

      const formattedDate = `${year}-${month}-${dayNumber}`;

      if (doctor.availableDays.includes(dayName)) {
        result.push({
          date: formattedDate,
          day: dayName,
          dayNumber,
        });
      }
    }

    return result;
  }, [doctor.availableDays]);

  const slots = useMemo(() => {
    const result: string[] = [];

    const [hours, minutes] = doctor.startTime
      .split(':')
      .map(Number);

    const startMinutes = hours * 60 + minutes;

    for (let i = 0; i < doctor.dailyTokens; i++) {
      const totalMinutes = startMinutes + i * 5;

      const slotHours = Math.floor(totalMinutes / 60);
      const slotMinutes = totalMinutes % 60;

      const formattedHours = String(slotHours).padStart(2, '0');
      const formattedMinutes = String(slotMinutes).padStart(2, '0');

      result.push(
        `${formattedHours}:${formattedMinutes}`,
      );
    }

    return result;
  }, [doctor.startTime, doctor.dailyTokens]);

  const visibleSlots = slots.slice(0, visibleSlotCount);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);

    // Reset slots when date changes
    setVisibleSlotCount(30);
  };

  const handleShowMore = () => {
    setVisibleSlotCount(prev =>
      Math.min(prev + 30, slots.length),
    );
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedSlot) {
      Alert.alert(
        'Incomplete Selection',
        'Please select a date and time slot.',
      );
      return;
    }

    try {
      setBooking(true);

      await api.post('/appointments', {
        doctorId: doctor._id,
        date: selectedDate,
        slot: selectedSlot,
      });

      Alert.alert(
        'Appointment Booked',
        `Your appointment has been booked successfully.\n\nDate: ${selectedDate}\nTime: ${selectedSlot}`,
        [
          {
            text: 'OK',
            onPress: () => navigation.replace('UserHome'),
          },
        ],
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Failed to book appointment. Please try again.';

      Alert.alert('Booking Failed', message);
    } finally {
      setBooking(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.eyebrow}>
            BOOK APPOINTMENT
          </Text>

          <Text style={styles.title}>
            Choose your date & time
          </Text>

          <Text style={styles.subtitle}>
            Select an available date and appointment slot.
          </Text>
        </View>

        {/* Doctor Card */}
        <View style={styles.doctorCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DR</Text>
          </View>

          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>
              {doctor.name}
            </Text>

            <Text style={styles.specialization}>
              {doctor.specialization}
            </Text>

            <Text style={styles.fee}>
              Consultation ₹{doctor.consultationFee}
            </Text>
          </View>
        </View>

        {/* Date */}
        <Text style={styles.sectionTitle}>
          Select Date
        </Text>

        {dates.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              No available dates
            </Text>

            <Text style={styles.emptyText}>
              This doctor has no available days in the
              next 14 days.
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateList}>

            {dates.map(item => {
              const isSelected =
                selectedDate === item.date;

              return (
                <TouchableOpacity
                  key={item.date}
                  style={[
                    styles.dateCard,
                    isSelected &&
                      styles.selectedDateCard,
                  ]}
                  onPress={() =>
                    handleDateSelect(item.date)
                  }
                  activeOpacity={0.8}>

                  <Text
                    style={[
                      styles.dayName,
                      isSelected &&
                        styles.selectedDateText,
                    ]}>
                    {item.day.substring(0, 3)}
                  </Text>

                  <Text
                    style={[
                      styles.dayNumber,
                      isSelected &&
                        styles.selectedDateText,
                    ]}>
                    {item.dayNumber}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}

        {/* Slots */}
        <Text style={styles.sectionTitle}>
          Available Slots
        </Text>

        {!selectedDate ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              Select a date to view available time slots.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.slotGrid}>
              {visibleSlots.map(slot => {
                const isSelected =
                  selectedSlot === slot;

                return (
                  <TouchableOpacity
                    key={slot}
                    style={[
                      styles.slotButton,
                      isSelected &&
                        styles.selectedSlot,
                    ]}
                    onPress={() =>
                      setSelectedSlot(slot)
                    }
                    activeOpacity={0.8}>

                    <Text
                      style={[
                        styles.slotText,
                        isSelected &&
                          styles.selectedSlotText,
                      ]}>
                      {slot}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Show More */}
            {visibleSlotCount < slots.length && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={handleShowMore}
                activeOpacity={0.8}>

                <Text style={styles.showMoreText}>
                  Show More Slots
                </Text>

                <Text style={styles.remainingText}>
                  {slots.length - visibleSlotCount} more
                  available
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* Booking Summary */}
        {selectedDate && selectedSlot && (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>
              Appointment Summary
            </Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Doctor
              </Text>

              <Text style={styles.summaryValue}>
                {doctor.name}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Date
              </Text>

              <Text style={styles.summaryValue}>
                {selectedDate}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                Time
              </Text>

              <Text style={styles.summaryValue}>
                {selectedSlot}
              </Text>
            </View>
          </View>
        )}

        {/* Book Button */}
        <TouchableOpacity
          style={[
            styles.bookButton,
            booking && styles.disabledButton,
          ]}
          onPress={handleBookAppointment}
          activeOpacity={0.8}
          disabled={booking}>

          <Text style={styles.bookButtonText}>
            {booking
              ? 'Booking...'
              : 'Confirm Appointment'}
          </Text>
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
    paddingTop: 20,
    paddingBottom: 35,
  },

  header: {
    marginBottom: 20,
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

  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 28,
  },

  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
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

  doctorInfo: {
    flex: 1,
  },

  doctorName: {
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

  fee: {
    fontSize: 12,
    color: '#64748B',
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  dateList: {
    paddingBottom: 24,
  },

  dateCard: {
    width: 68,
    height: 78,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  selectedDateCard: {
    backgroundColor: '#0F9D9A',
    borderColor: '#0F9D9A',
  },

  dayName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 5,
  },

  dayNumber: {
    fontSize: 21,
    fontWeight: '800',
    color: '#0F172A',
  },

  selectedDateText: {
    color: '#FFFFFF',
  },

  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },

  slotButton: {
    width: '30%',
    minHeight: 44,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedSlot: {
    backgroundColor: '#0F9D9A',
    borderColor: '#0F9D9A',
  },

  slotText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  selectedSlotText: {
    color: '#FFFFFF',
  },

  showMoreButton: {
    minHeight: 48,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#0F9D9A',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },

  showMoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F766E',
  },

  remainingText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    marginBottom: 24,
  },

  infoText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
  },

  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 20,
    marginBottom: 24,
  },

  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 5,
  },

  emptyText: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    textAlign: 'center',
  },

  summaryCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginBottom: 18,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#134E4A',
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },

  summaryLabel: {
    fontSize: 13,
    color: '#0F766E',
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#134E4A',
  },

  bookButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: '#0F9D9A',
    justifyContent: 'center',
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  bookButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default BookAppointmentScreen;