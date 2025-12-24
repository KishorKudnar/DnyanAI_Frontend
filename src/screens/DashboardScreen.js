import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  Alert,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const scale = width / 390;

const normalize = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const colors = {
  background: '#FFFFFF',
  purple: '#6A5AE0',
  purpleLight: '#EAE8FD',
  text: '#333333',
  textSecondary: '#8A8A8A',
  white: '#FFFFFF',
  cardShadow: '#6A5AE0',
  quickAccessStart: '#F0FDF8',
  quickAccessEnd: '#E6F8F0',
};

const quickAccessItems = [
  { id: 'homework', title: 'Homework', emoji: '📖', screen: 'Homework' },
  { id: 'flashcards', title: 'Flashcards', emoji: '🗂️', screen: 'Flashcards' },
  { id: 'practice', title: 'Practice', emoji: '✍️', screen: 'Practice' },
  { id: 'forum', title: 'Forum', emoji: '💬', screen: 'DoubtsForum' },
];

const teacherQuickAccessItems = [
  { id: 'homework', title: 'Homework', emoji: '📖', screen: 'TeacherHomework' },
  { id: 'flashcards', title: 'Flashcards', emoji: '🗂️', screen: 'TeacherFlashcards' },
  { id: 'practice', title: 'Practice', emoji: '✍️', screen: 'TeacherPractice' },
  { id: 'forum', title: 'Forum', emoji: '💬', screen: 'TeacherForum' },
];

export default function DashboardScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  const studentEmail = route.params?.studentEmail;
  const role = route.params?.role || 'student';

  const [studentName, setStudentName] = useState(route.params?.studentName || 'User');
  const [profilePic, setProfilePic] = useState(route.params?.profilePic || null);
  const [studentClass, setStudentClass] = useState(route.params?.studentClass || '11');
  const [stream, setStream] = useState(route.params?.stream || 'Science');
  const [board, setBoard] = useState(route.params?.board || 'State Board');

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        if (!studentEmail) return;

        try {
          const token = await AsyncStorage.getItem('userToken');
          if (!token) return;

          const response = await fetch(
            'https://dnyanai-backend-1.onrender.com/api/get-profile',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ email: studentEmail }),
            }
          );

          if (!response.ok) return;

          const data = await response.json();
          if (data.success) {
            setStudentName(data.name);
            setProfilePic(data.profilePic);
            setStudentClass(data.className);
            setStream(data.stream);
            setBoard(data.board);
          }
        } catch (err) {
          console.error('Dashboard: Failed to fetch profile', err);
        }
      };

      fetchProfile();
    }, [studentEmail])
  );

  const CardDecorations = () => (
    <View style={styles.decorContainer}>
      <View style={[styles.decor, styles.decor1]} />
      <View style={[styles.decor, styles.decor2]} />
      <View style={[styles.decor, styles.decor3]} />
    </View>
  );

  const navigateToScreen = (screen) => {
    navigation.navigate(screen, { studentName, studentClass, stream, board });
  };

  const quickAccessList =
    role === 'teacher' ? teacherQuickAccessItems : quickAccessItems;

  return (
    <SafeAreaView style={styles.container}>
      
      <View
        style={[
          styles.fixedHeader,
          {
            paddingTop: insets.top,
            backgroundColor: '#6A5AE0',
          },
        ]}
      >
        <LinearGradient
          colors={['#A18DFF', '#6A5AE0']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#FFFFFF', '#FFFFFF']}
                style={styles.logoCircle}
              >
                <Text style={styles.logoText}>ज्ञान</Text>
              </LinearGradient>
              <Text style={styles.logoAI}>AI</Text>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationButton}>
                <Text style={styles.headerEmoji}>🔔</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('Profile', {
                    email: studentEmail,
                    name: studentName,
                    className: studentClass,
                    stream,
                    board,
                    profilePic,
                  })
                }
              >
                <Image
                  source={
                    profilePic
                      ? { uri: profilePic }
                      : require('./../assets/images/user1.png')
                  }
                  style={styles.profileImage}
                />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.headerSubtitle}>
            {`Class ${
              studentClass === '11'
                ? '11th'
                : studentClass === '12'
                ? '12th'
                : studentClass
            } ${stream} - ${board}`}
          </Text>

          <Text style={styles.welcomeText}>Welcome, {studentName}!</Text>
        </LinearGradient>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: normalize(100),
          paddingTop: normalize(240),
        }}
      >
        <View style={styles.moduleSection}>
          <View style={styles.moduleRow}>
            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => navigateToScreen('Subjects')}
            >
              <Text style={styles.moduleEmoji}>📚</Text>
              <Text style={styles.moduleText}>Subjects</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => navigateToScreen('Progress')}
            >
              <CardDecorations />
              <Text style={styles.moduleEmoji}>📈</Text>
              <Text style={styles.moduleText}>Progress</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.moduleRow}>
            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() =>
                navigation.navigate('TestSubjectList', {
                  studentName,
                  studentClass,
                  stream,
                  board,
                })
              }
            >
              <Text style={styles.moduleEmoji}>📝</Text>
              <Text style={styles.moduleText}>Tests</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.moduleCard}
              onPress={() => navigateToScreen('AIMentor')}
            >
              <Text style={styles.moduleEmoji}>🤖</Text>
              <Text style={styles.moduleText}>AI Mentor</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.diamondContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                Alert.alert(
                  '📊 Keep Going!',
                  `Your progress is shining bright, ${studentName}! ✨ Keep learning 🚀`,
                  [{ text: 'Awesome!' }]
                )
              }
            >
              <LinearGradient
                colors={['#A18DFF', '#6A5AE0']}
                style={styles.diamond}
              >
                <View style={styles.diamondIconContainer}>
                  <Text style={styles.diamondEmoji}>📊</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <LinearGradient
          colors={[colors.quickAccessStart, colors.quickAccessEnd]}
          style={styles.quickAccessCard}
        >
          <Text style={styles.sectionTitle}>Quick Access</Text>

          <View style={styles.quickAccessContainer}>
            {quickAccessList.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.quickAccessItem}
                onPress={() =>
                  navigation.navigate(item.screen, {
                    teacherName: role === 'teacher' ? studentName : undefined,
                    studentName,
                    studentClass,
                    stream,
                    board,
                  })
                }
              >
                <View style={styles.quickAccessIcon}>
                  <Text style={styles.quickAccessEmoji}>{item.emoji}</Text>
                </View>
                <Text style={styles.quickAccessText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        <View style={styles.engageSection}>
          <TouchableOpacity style={styles.dailyChallengeCard}>
            <View>
              <Text style={styles.engageTitle}>Daily Challenge!</Text>
              <View style={styles.timerContainer}>
                <Text style={styles.timerEmoji}>⏱️</Text>
                <Text style={styles.timerText}>23:59:39</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.startButton}>
              <Text style={styles.startButtonText}>Start Now</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={styles.continueCard}>
            <Text style={styles.engageTitle}>Continue</Text>
            <Text style={styles.engageSubtitle}>Chapter 5: Physics</Text>
            <Text style={styles.continueArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  fixedHeader: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 50,
  
  borderBottomLeftRadius: 24,
  borderBottomRightRadius: 24,
  overflow: 'hidden',
  backgroundColor: '#6A5AE0',
  
},


  headerGradient: {
    paddingTop: normalize(20),
    paddingBottom: normalize(20),
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    
  },

  logoContainer: { flexDirection: 'row', alignItems: 'center' },

  logoCircle: {
    width: normalize(50),
    height: normalize(50),
    borderRadius: normalize(25),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(6),
    backgroundColor: colors.white,
    elevation: 4,
  },

  logoText: {
    fontSize: normalize(20),
    fontWeight: '800',
    color: colors.purple,
  },

  logoAI: {
    fontSize: normalize(24),
    fontWeight: '800',
    color: colors.white,
  },

  headerRight: { flexDirection: 'row', alignItems: 'center' },

  notificationButton: {
    width: normalize(40),
    height: normalize(40),
    borderRadius: 12,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(12),
  },

  headerEmoji: { fontSize: normalize(20) },

  profileImage: {
    width: normalize(42),
    height: normalize(42),
    borderRadius: normalize(21),
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  headerSubtitle: {
    fontSize: normalize(14),
    color: colors.white,
    marginTop: 8,
    paddingHorizontal: 20,
  },

  welcomeText: {
    fontSize: normalize(26),
    fontWeight: 'bold',
    color: colors.white,
    marginTop: 4,
    paddingHorizontal: 20,
  },

  moduleSection: {
    paddingHorizontal: normalize(20),
    marginBottom: normalize(15),
    height: normalize(250),
    justifyContent: 'space-between',
  },

  moduleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  moduleCard: {
    width: '48%',
    height: normalize(115),
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    overflow: 'hidden',
  },

  moduleEmoji: {
    fontSize: normalize(28),
    marginBottom: 8,
  },

  moduleText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: colors.text,
  },

  diamondContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },

  diamond: {
    width: normalize(120),
    height: normalize(120),
    borderRadius: 30,
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
  },

  diamondIconContainer: {
    transform: [{ rotate: '-45deg' }],
  },

  diamondEmoji: {
    fontSize: normalize(40),
  },

  quickAccessCard: {
    marginHorizontal: normalize(20),
    borderRadius: 20,
    padding: normalize(20),
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },

  quickAccessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  quickAccessItem: {
    alignItems: 'center',
    width: normalize(80),
  },

  quickAccessIcon: {
    width: normalize(56),
    height: normalize(56),
    borderRadius: 18,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },

  quickAccessEmoji: { fontSize: normalize(24) },

  quickAccessText: {
    fontSize: normalize(12),
    color: colors.textSecondary,
    textAlign: 'center',
  },

  engageSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: normalize(20),
  },

  dailyChallengeCard: {
    backgroundColor: colors.purpleLight,
    borderRadius: 20,
    padding: normalize(15),
    width: '58%',
    justifyContent: 'space-between',
  },

  engageTitle: {
    fontSize: normalize(16),
    fontWeight: 'bold',
    color: colors.text,
  },

  timerContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },

  timerEmoji: { fontSize: normalize(16) },

  timerText: {
    color: colors.purple,
    fontWeight: '600',
    marginLeft: 4,
  },

  startButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 12,
  },

  startButtonText: {
    color: colors.purple,
    fontWeight: 'bold',
    fontSize: normalize(12),
  },

  continueCard: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: normalize(15),
    width: '38%',
    elevation: 3,
    position: 'relative',
  },

  engageSubtitle: {
    fontSize: normalize(14),
    color: colors.textSecondary,
    marginTop: 2,
  },

  continueArrow: {
    position: 'absolute',
    top: 8,
    right: 12,
    fontSize: normalize(24),
    color: colors.textSecondary,
  },

  decorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  decor: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    opacity: 0.1,
    backgroundColor: colors.purple,
  },

  decor1: { top: -40, left: -20 },

  decor2: {
    top: 30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
  },

  decor3: { bottom: -20, left: 40 },
});
