import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import UserHomeScreen from './src/screens/user/UserHomeScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import DoctorListScreen from './src/screens/user/DoctorListScreen';
import DoctorDetailsScreen from './src/screens/user/DoctorDetailsScreen';
import BookAppointmentScreen from './src/screens/user/BookAppointmentScreen';
import MyAppointmentsScreen from './src/screens/user/MyAppointmentsScreen';
import AdminAppointmentsScreen from './src/screens/admin/AdminAppointmentsScreen';
import AdminDoctorsScreen from './src/screens/admin/AdminDoctorsScreen';
import AddDoctorScreen from './src/screens/admin/AddDoctorScreen';
import EditDoctorScreen from './src/screens/admin/EditDoctorScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import VerifyOtpScreen from './src/screens/auth/VerifyOtpScreen';
import ResetPasswordScreen from './src/screens/auth/ResetPasswordScreen';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  UserHome: undefined;
  AdminDashboard: undefined;
  DoctorList: undefined;
  DoctorDetails: {
    doctor: {
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
    };
  };
  BookAppointment: {
    doctor: {
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
    };
  };
  MyAppointments: undefined;
  AdminAppointments: undefined;
  AdminDoctors: undefined;
  AddDoctor: undefined;
  EditDoctor: {
    doctor: {
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
    };
  };
  ForgotPassword: undefined;
  VerifyOtp: {
    email: string;
  };
  ResetPassword: {
    email: string;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ title: 'Login' }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Register' }}
        />

        <Stack.Screen
          name="UserHome"
          component={UserHomeScreen}
          options={{
            title: 'NiyaCare',
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{
            title: 'Admin Dashboard',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DoctorList"
          component={DoctorListScreen}
          options={{
            title: 'Find a Doctor',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="DoctorDetails"
          component={DoctorDetailsScreen}
          options={{
            title: 'Doctor Details',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="BookAppointment"
          component={BookAppointmentScreen}
          options={{
            title: 'Book Appointment',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="MyAppointments"
          component={MyAppointmentsScreen}
          options={{
            title: 'My Appointments',
          }}
        />
        <Stack.Screen
          name="AdminAppointments"
          component={AdminAppointmentsScreen}
          options={{
            title: 'Manage Appointments',
          }}
        />
        <Stack.Screen
          name="AdminDoctors"
          component={AdminDoctorsScreen}
          options={{ title: 'Manage Doctors' }}
        />
        <Stack.Screen
          name="AddDoctor"
          component={AddDoctorScreen}
          options={{ title: 'Add Doctor' }}
        />
        <Stack.Screen
          name="EditDoctor"
          component={EditDoctorScreen}
          options={{ title: 'Edit Doctor' }}
        />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
