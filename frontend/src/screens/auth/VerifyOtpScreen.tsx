import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { verifyOtp } from '../../services/authService';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;

  VerifyOtp: {
    email: string;
  };

  ResetPassword: {
    email: string;
  };

  UserHome: undefined;
  AdminDashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'VerifyOtp'>;

const VerifyOtpScreen = ({ navigation, route }: Props) => {
  const { email } = route.params;

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      Alert.alert('Missing OTP', 'Please enter the OTP');
      return;
    }

    if (otp.trim().length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      setLoading(true);

      await verifyOtp(email, otp.trim());

      Alert.alert('OTP Verified', 'OTP verified successfully.', [
        {
          text: 'Continue',
          onPress: () =>
            navigation.replace('ResetPassword', {
              email,
            }),
        },
      ]);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'OTP verification failed. Please try again.';

      Alert.alert('Verification Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <Text style={styles.title}>Verify OTP</Text>

        <Text style={styles.subtitle}>Enter the 6-digit OTP sent to</Text>

        <Text style={styles.email}>{email}</Text>

        {/* OTP Input */}
        <Text style={styles.label}>OTP</Text>

        <TextInput
          style={styles.otpInput}
          placeholder="Enter 6-digit OTP"
          placeholderTextColor="#999"
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={setOtp}
          textAlign="center"
        />

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleVerifyOtp}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>

        {/* Back */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VerifyOtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },

  email: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F766E',
    marginTop: 4,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },

  otpInput: {
    height: 56,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 22,
    letterSpacing: 6,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },

  button: {
    height: 52,
    borderRadius: 10,
    backgroundColor: '#0F9D9A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  backButton: {
    alignItems: 'center',
    marginTop: 20,
  },

  backText: {
    color: '#0F766E',
    fontSize: 15,
    fontWeight: '600',
  },
});
