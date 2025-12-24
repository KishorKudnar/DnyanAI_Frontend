import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import all screens
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import StudentInfoScreen from '../screens/StudentInfoScreen';
import SubjectPDFScreen from '../screens/SubjectPDFScreen';
import TestSubjectListScreen from './src/screens/TestSubjectListScreen';


// Import bottom tabs (footer)
import BottomTabs from './BottomTabs';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Authentication flow */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="StudentInfo" component={StudentInfoScreen} />

        {/* Main app with footer tabs */}
        <Stack.Screen name="Main" component={BottomTabs} />

        {/* PDF viewer (opens above footer) */}
        <Stack.Screen name="SubjectPDF" component={SubjectPDFScreen} />

        <Stack.Screen
          name="TestSubjectList"
          component={TestSubjectListScreen}
          options={{ headerShown: false }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
