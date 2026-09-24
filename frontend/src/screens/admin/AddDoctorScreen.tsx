import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import api from '../../services/api';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  UserHome: undefined;
  AdminDashboard: undefined;
  AdminAppointments: undefined;
  AdminDoctors: undefined;
  AddDoctor: undefined;
};

type Props = NativeStackScreenProps<
  RootStackParamList,
  'AddDoctor'
>;

const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const AddDoctorScreen = ({navigation}: Props) => {
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [qualification, setQualification] = useState('');
  const [experience, setExperience] = useState('');
  const [consultationFee, setConsultationFee] = useState('');
  const [startTime, setStartTime] = useState('');
  const [dailyTokens, setDailyTokens] = useState('');
  const [availableDays, setAvailableDays] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  const toggleDay = (day: string) => {
    setAvailableDays(prev => {
      if (prev.includes(day)) {
        return prev.filter(item => item !== day);
      }

      return [...prev, day];
    });
  };

  const handleAddDoctor = async () => {
    if (
      !name.trim() ||
      !specialization.trim() ||
      !qualification.trim() ||
      !experience.trim() ||
      !consultationFee.trim() ||
      !startTime.trim() ||
      !dailyTokens.trim()
    ) {
      Alert.alert(
        'Missing Information',
        'Please fill all required fields.',
      );
      return;
    }

    if (availableDays.length === 0) {
      Alert.alert(
        'Available Days',
        'Please select at least one available day.',
      );
      return;
    }

    const experienceNumber = Number(experience);
    const consultationFeeNumber = Number(consultationFee);
    const dailyTokensNumber = Number(dailyTokens);

    if (
      Number.isNaN(experienceNumber) ||
      experienceNumber < 0
    ) {
      Alert.alert(
        'Invalid Experience',
        'Please enter a valid experience.',
      );
      return;
    }

    if (
      Number.isNaN(consultationFeeNumber) ||
      consultationFeeNumber < 0
    ) {
      Alert.alert(
        'Invalid Fee',
        'Please enter a valid consultation fee.',
      );
      return;
    }

    if (
      Number.isNaN(dailyTokensNumber) ||
      dailyTokensNumber < 1
    ) {
      Alert.alert(
        'Invalid Tokens',
        'Daily tokens must be at least 1.',
      );
      return;
    }

    if (!/^\d{2}:\d{2}$/.test(startTime.trim())) {
      Alert.alert(
        'Invalid Start Time',
        'Please enter time in HH:MM format. Example: 09:00',
      );
      return;
    }

    try {
      setLoading(true);

      await api.post('/doctors', {
        name: name.trim(),
        specialization: specialization.trim(),
        qualification: qualification.trim(),
        experience: experienceNumber,
        consultationFee: consultationFeeNumber,
        availableDays,
        startTime: startTime.trim(),
        dailyTokens: dailyTokensNumber,
      });

      Alert.alert(
        'Success',
        'Doctor added successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Failed to add doctor. Please try again.';

      Alert.alert('Add Doctor Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              Add Doctor
            </Text>

            <Text style={styles.subtitle}>
              Add doctor details and availability
            </Text>
          </View>

          {/* Basic Information */}
          <Text style={styles.sectionTitle}>
            Basic Information
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>
              Doctor Name *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Enter doctor name"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <Text style={styles.label}>
              Specialization *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. Cardiologist"
              placeholderTextColor="#94A3B8"
              value={specialization}
              onChangeText={setSpecialization}
              autoCapitalize="words"
            />

            <Text style={styles.label}>
              Qualification *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. MBBS, MD"
              placeholderTextColor="#94A3B8"
              value={qualification}
              onChangeText={setQualification}
              autoCapitalize="characters"
            />

            <Text style={styles.label}>
              Experience (Years) *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 8"
              placeholderTextColor="#94A3B8"
              value={experience}
              onChangeText={setExperience}
              keyboardType="numeric"
            />

            <Text style={styles.label}>
              Consultation Fee *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 500"
              placeholderTextColor="#94A3B8"
              value={consultationFee}
              onChangeText={setConsultationFee}
              keyboardType="numeric"
            />
          </View>

          {/* Availability */}
          <Text style={styles.sectionTitle}>
            Availability
          </Text>

          <View style={styles.formCard}>
            <Text style={styles.label}>
              Available Days *
            </Text>

            <View style={styles.daysContainer}>
              {DAYS.map(day => {
                const selected =
                  availableDays.includes(day);

                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayButton,
                      selected && styles.dayButtonSelected,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => toggleDay(day)}>
                    <Text
                      style={[
                        styles.dayButtonText,
                        selected &&
                          styles.dayButtonTextSelected,
                      ]}>
                      {day.substring(0, 3)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.label}>
              Start Time *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 09:00"
              placeholderTextColor="#94A3B8"
              value={startTime}
              onChangeText={setStartTime}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />

            <Text style={styles.helperText}>
              Use 24-hour format. Example: 09:00 or 14:30
            </Text>

            <Text style={styles.label}>
              Daily Tokens *
            </Text>

            <TextInput
              style={styles.input}
              placeholder="e.g. 20"
              placeholderTextColor="#94A3B8"
              value={dailyTokens}
              onChangeText={setDailyTokens}
              keyboardType="numeric"
            />

            <Text style={styles.helperText}>
              Each token is 5 minutes.
            </Text>
          </View>

          {/* Add Button */}
          <TouchableOpacity
            style={[
              styles.addButton,
              loading && styles.addButtonDisabled,
            ]}
            activeOpacity={0.8}
            onPress={handleAddDoctor}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.addButtonText}>
                Add Doctor
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            disabled={loading}>
            <Text style={styles.cancelButtonText}>
              Cancel
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  keyboardContainer: {
    flex: 1,
  },

  container: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: '#64748B',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 7,
    marginTop: 4,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 13,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    marginBottom: 14,
  },

  helperText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: -8,
    marginBottom: 14,
  },

  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },

  dayButton: {
    minWidth: 54,
    height: 40,
    borderRadius: 9,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  dayButtonSelected: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },

  dayButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },

  dayButtonTextSelected: {
    color: '#FFFFFF',
  },

  addButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: '#0F766E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  addButtonDisabled: {
    opacity: 0.7,
  },

  addButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  cancelButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },
});

export default AddDoctorScreen;