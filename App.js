import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// ---------------------- Screens ----------------------
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';

import DashboardScreen from './src/screens/DashboardScreen';
import ProgressScreen from './src/screens/ProgressScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Subjects & Learning
import SubjectListScreen from './src/screens/SubjectListScreen';
import SubjectPDFScreen from './src/screens/SubjectPDFScreen';
import TestSubjectListScreen from './src/screens/TestSubjectListScreen';
import AIMentorScreen from './src/screens/AIMentorScreen';
import HomeworkScreen from './src/screens/HomeworkScreen';
import FlashcardsScreen from './src/screens/FlashcardsScreen';
import PracticeScreen from './src/screens/PracticeScreen';
import DoubtsForumScreen from './src/screens/DoubtsForumScreen';

// Chapters & Quiz
import ChapterScreen from './src/screens/ChapterScreen';
import ChapterQuizScreen from './src/screens/ChapterQuizScreen';
import QuizScreen from './src/screens/QuizScreen';

// New screens
import WeeklyGraphScreen from './src/screens/WeeklyGraphScreen';
import HistoryScreen from './src/screens/HistoryScreen';
// -----------------------------------------------------

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        {/* ------------------- Auth Screens ------------------- */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

        {/* ------------------- Dashboard ------------------- */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />

        {/* New */}
        <Stack.Screen name="WeeklyGraph" component={WeeklyGraphScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />

        {/* ------------------- Subjects & Learning ------------------- */}
        <Stack.Screen name="Subjects" component={SubjectListScreen} />
        <Stack.Screen name="SubjectPDF" component={SubjectPDFScreen} />
        <Stack.Screen name="TestSubjectList" component={TestSubjectListScreen} />
        <Stack.Screen name="AIMentor" component={AIMentorScreen} />
        <Stack.Screen name="Homework" component={HomeworkScreen} />
        <Stack.Screen name="Flashcards" component={FlashcardsScreen} />
        <Stack.Screen name="Practice" component={PracticeScreen} />
        <Stack.Screen name="DoubtsForum" component={DoubtsForumScreen} />

        {/* ------------------- Chapters & Quiz ------------------- */}
        <Stack.Screen
          name="ChapterScreen"
          component={ChapterScreen}
          options={{ headerShown: true, title: 'Chapters' }}
        />
        <Stack.Screen
          name="ChapterQuizScreen"
          component={ChapterQuizScreen}
          options={{ headerShown: true, title: 'Quizzes' }}
        />
        <Stack.Screen
          name="QuizScreen"
          component={QuizScreen}
          options={{ headerShown: true, title: 'Quiz' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
