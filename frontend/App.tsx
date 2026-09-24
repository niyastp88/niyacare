import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import UserHomeScreen from './src/screens/user/UserHomeScreen';
import AdminDashboardScreen from './src/screens/admin/AdminDashboardScreen';
import DoctorListScreen from './src/screens/user/DoctorListScreen';
import DoctorDetailsScreen from './src/screens/user/DoctorDetailsScreen';
import BookAppointmentScreen from './src/screens/user/BookAppointmentScreen';

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
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{title: 'Login'}}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{title: 'Register'}}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;