import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  PixelRatio,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');
const BASE_WIDTH = 390;
const scale = width / BASE_WIDTH;
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const subjectDetails = {
  Physics: { color: '#4A90E2', icon: '⚛️' },
  Chemistry: { color: '#50E3C2', icon: '🧪' },
  Math: { color: '#F5A623', icon: '🧮' },
  Default: { color: '#B8B8B8', icon: '📚' },
};

const HomeworkItem = ({ item, onToggle }) => {
  const details = subjectDetails[item.subject] || subjectDetails.Default;
  const isCompleted = item.completed;

  return (
    <View style={styles.card}>
      <View style={[styles.cardColorStrip, { backgroundColor: details.color }]} />
      <View style={styles.cardContent}>
        <Text style={styles.subjectIcon}>{details.icon}</Text>
        <View style={styles.taskDetails}>
          <Text style={styles.subjectText}>{item.subject}</Text>
          <Text style={[styles.taskText, isCompleted && styles.taskTextCompleted]}>{item.task}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={() => onToggle(item.id)}
        style={[
          styles.checkbox,
          isCompleted && {
            backgroundColor: details.color,
            borderColor: details.color,
          },
        ]}
      >
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default function HomeWorkScreen({ route, navigation }) {
  const { studentName, studentClass, stream, board } = route.params || {};

  const [homeworkList, setHomeworkList] = useState([
    { id: '1', subject: 'Physics', task: 'Chapter 5: Solve exercises 1–10', completed: false },
    { id: '2', subject: 'Chemistry', task: 'Lab report on acids and bases', completed: true },
    { id: '3', subject: 'Math', task: 'Complete Algebra worksheet', completed: false },
    { id: '4', subject: 'Physics', task: 'Read about Newtonian mechanics', completed: false },
  ]);

  const toggleComplete = (id) => {
    setHomeworkList((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const pendingTasks = homeworkList.filter((item) => !item.completed);
  const completedTasks = homeworkList.filter((item) => item.completed);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#A18DFF', '#6A5AE0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Homework</Text>
        </View>
        <Text style={styles.headerSubtitle}>Assignments for {studentClass} {stream}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {pendingTasks.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>To-Do ({pendingTasks.length})</Text>
            {pendingTasks.map((item) => <HomeworkItem key={item.id} item={item} onToggle={toggleComplete} />)}
          </>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateEmoji}>🎉</Text>
            <Text style={styles.emptyStateText}>All caught up!</Text>
            <Text style={styles.emptyStateSubtext}>You have no pending homework.</Text>
          </View>
        )}

        {completedTasks.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Completed ({completedTasks.length})</Text>
            {completedTasks.map((item) => <HomeworkItem key={item.id} item={item} onToggle={toggleComplete} />)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FE' },
  headerGradient: {
    paddingVertical: normalize(40),
    paddingHorizontal: normalize(20),
    borderBottomLeftRadius: normalize(30),
    borderBottomRightRadius: normalize(30),
    shadowColor: '#6A5AE0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: normalize(10),
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: normalize(10) },
  backButton: { position: 'absolute', left: normalize(0), padding: normalize(8) },
  backArrow: { fontSize: normalize(32), color: '#FFFFFF', fontWeight: '700' },
  headerTitle: { fontSize: normalize(24), fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  headerSubtitle: { fontSize: normalize(15), color: '#FFFFFF', textAlign: 'center', fontWeight: '500' },

  scrollContainer: { padding: normalize(20), paddingBottom: normalize(60) },
  sectionTitle: { fontSize: normalize(18), fontWeight: '600', color: '#334155', marginBottom: normalize(16), marginTop: normalize(10) },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(16),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(12),
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
    overflow: 'hidden',
  },
  cardColorStrip: { width: normalize(8), height: '100%' },
  cardContent: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: normalize(14) },
  subjectIcon: { fontSize: normalize(26), marginHorizontal: normalize(14) },
  taskDetails: { flex: 1 },
  subjectText: { fontSize: normalize(15), fontWeight: '700', color: '#334155' },
  taskText: { fontSize: normalize(13), color: '#64748B', marginTop: normalize(4) },
  taskTextCompleted: { textDecorationLine: 'line-through', color: '#94A3B8' },

  checkbox: {
    width: normalize(28),
    height: normalize(28),
    borderRadius: normalize(14),
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(18),
    backgroundColor: '#FFFFFF',
  },
  checkmark: { color: '#FFFFFF', fontSize: normalize(15), fontWeight: 'bold' },

  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: normalize(60) },
  emptyStateEmoji: { fontSize: normalize(58) },
  emptyStateText: { fontSize: normalize(22), fontWeight: '700', color: '#334155', marginTop: normalize(12) },
  emptyStateSubtext: { fontSize: normalize(15), color: '#64748B', marginTop: normalize(6) },
});
