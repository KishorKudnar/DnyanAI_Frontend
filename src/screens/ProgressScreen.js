import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  PixelRatio,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import {
  getProgressData,
  getHistory,
  resetProgress,
} from '../utils/ProgressTracker';

const { width } = Dimensions.get('window');
const scale = width / 390;
const normalize = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

const colors = {
  purple: '#6A5AE0',
  white: '#FFFFFF',
  background: '#F5F5FF',
  text: '#333',
  secondary: '#8A8A8A',
};

export default function ProgressScreen({ navigation, route }) {
  const [progress, setProgress] = useState(null);
  const [history, setHistory] = useState([]);
  const [studentName, setStudentName] = useState(
    route?.params?.studentName || 'User'
  );
  const [loadingReset, setLoadingReset] = useState(false);

  useEffect(() => {
    const load = async () => {
      const p = await getProgressData();
      const h = await getHistory();

      setProgress(p);
      setHistory(h);

      if (!route?.params?.studentName) {
        const name = await AsyncStorage.getItem('userName');
        if (name) setStudentName(name);
      }
    };
    load();
  }, []);

  const handleReset = async () => {
    setLoadingReset(true);
    await resetProgress();

    const p = await getProgressData();
    const h = await getHistory();

    setProgress(p);
    setHistory(h);

    setLoadingReset(false);
  };

  if (!progress)
    return (
      <View style={styles.centerView}>
        <ActivityIndicator size="large" color={colors.purple} />
      </View>
    );

  const subjects = Object.keys(progress);

  const lessonsCompleted = subjects.reduce(
    (sum, s) => sum + (progress[s]?.pdfOpened || 0),
    0
  );

  const aiSessions = subjects.reduce(
    (sum, s) => sum + (progress[s]?.aiMentions || 0),
    0
  );

  const testsCompleted = history.filter((h) => h.type === 'test').length;

  const subjectScores = subjects.map((s) => ({
    name: s,
    score: Math.min(
      100,
      (progress[s]?.pdfOpened || 0) * 10 +
        (progress[s]?.aiMentions || 0) * 5 +
        testsCompleted * 2
    ),
  }));

  const totalScore = subjectScores.reduce((sum, s) => sum + s.score, 0);
  const avgScore =
    subjectScores.length > 0
      ? Math.round(totalScore / subjectScores.length)
      : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#A18DFF', '#6A5AE0']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Your Progress</Text>
        </View>
        <Text style={styles.subHeader}>Keep it up, {studentName}! 🚀</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <Text style={styles.statText}>
            Lessons Completed: {lessonsCompleted}
          </Text>

          <Text style={styles.statText}>AI Sessions: {aiSessions}</Text>

          <Text style={styles.statText}>Tests Completed: {testsCompleted}</Text>

          <Text style={styles.statText}>Average Score: {avgScore}%</Text>

          <TouchableOpacity
            style={styles.resetBtn}
            onPress={handleReset}
            disabled={loadingReset}
          >
            {loadingReset ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resetText}>Reset Progress</Text>
            )}
          </TouchableOpacity>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => navigation.navigate('WeeklyGraph')}
            >
              <Text style={styles.smallBtnText}>Weekly Graph</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.smallBtn}
              onPress={() => navigation.navigate('History')}
            >
              <Text style={styles.smallBtnText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Subject Progress</Text>

          {subjectScores.map((s, index) => (
            <View key={index} style={styles.subjectRow}>
              <Text style={styles.subjectName}>{s.name}</Text>

              <View style={styles.percentBadge}>
                <Text style={styles.percentText}>{s.score}%</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  backArrow: { fontSize: 28, color: colors.white },
  headerText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 22,
    marginLeft: 12,
  },
  subHeader: { color: colors.white, textAlign: 'center', marginTop: 4 },

  scrollContainer: { padding: 20 },

  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
  },

  statText: {
    fontSize: 16,
    marginBottom: 6,
    color: colors.text,
  },

  resetBtn: {
    backgroundColor: '#FF4D4D',
    padding: 12,
    borderRadius: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  resetText: { color: '#fff', fontWeight: 'bold' },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },

  smallBtn: {
    backgroundColor: colors.purple,
    paddingVertical: 10,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  smallBtnText: { color: '#fff', fontWeight: '600' },

  // SUBJECT LIST
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },

  subjectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },

  percentBadge: {
    backgroundColor: colors.purple,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
  },

  percentText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },

  centerView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
