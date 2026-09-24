import React, {useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {resetPassword} from '../../services/authService';

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

type Props = NativeStackScreenProps<
  RootStackParamList,
  'ResetPassword'
>;

const ResetPasswordScreen = ({navigation, route}: Props) => {
  const {email} = route.params;

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert(
        'Missing Information',
        'Please enter new password and confirm password',
      );
      return;
    }

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 8 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character',
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        'Password Mismatch',
        'New password and confirm password do not match',
      );
      return;
    }

    try {
      setLoading(true);

      await resetPassword(email, newPassword);

      Alert.alert(
        'Success',
        'Your password has been reset successfully.',
        [
          {
            text: 'Login',
            onPress: () => navigation.replace('Login'),
          },
        ],
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Failed to reset password. Please try again.';

      Alert.alert('Reset Password Failed', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          Reset Password
        </Text>

        <Text style={styles.subtitle}>
          Create a new password for your account.
        </Text>

        <Text style={styles.email}>
          {email}
        </Text>

        {/* New Password */}
        <Text style={styles.label}>
          New Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter new password"
          placeholderTextColor="#999"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />

        {/* Confirm Password */}
        <Text style={styles.label}>
          Confirm Password
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Confirm new password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <Text style={styles.passwordHint}>
          Minimum 8 characters with uppercase, lowercase,
          number and special character.
        </Text>

        {/* Reset Button */}
        <TouchableOpacity
          style={[
            styles.button,
            loading && styles.disabledButton,
          ]}
          onPress={handleResetPassword}
          disabled={loading}>
          <Text style={styles.buttonText}>
            {loading
              ? 'Resetting...'
              : 'Reset Password'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ResetPasswordScreen;

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
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: '#64748B',
  },

  email: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F766E',
    marginTop: 5,
    marginBottom: 30,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
    marginBottom: 18,
  },

  passwordHint: {
    fontSize: 12,
    lineHeight: 18,
    color: '#64748B',
    marginTop: -5,
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
});