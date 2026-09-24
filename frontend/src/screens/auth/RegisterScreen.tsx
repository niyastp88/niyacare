import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

import {registerUser} from '../../services/authService';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  UserHome: undefined;
  AdminDashboard: undefined;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

const RegisterScreen = ({navigation}: Props) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      await registerUser({
        name,
        email,
        password,
      });

      Alert.alert(
        'Registration Successful',
        'Your account has been created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login'),
          },
        ],
      );
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        'Registration failed. Please try again.';

      Alert.alert('Registration Failed', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Register with NiyaCare
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },

  button: {
    height: 50,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;