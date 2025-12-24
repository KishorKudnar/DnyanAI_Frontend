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

const { width, height } = Dimensions.get('window');
const BASE_WIDTH = 390;
const scale = width / BASE_WIDTH;
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const subjectDetails = {
  Algebra: { color: '#F5A623', icon: '🔢' },
  Physics: { color: '#4A90E2', icon: '💡' },
  Chemistry: { color: '#50E3C2', icon: '🔬' },
  Default: { color: '#B8B8B8', icon: '✍️' },
};

export default function PracticeScreen({ route, navigation }) {
  const { studentName } = route.params || {};

  const [practiceExercises, setPracticeExercises] = useState([
    { id: '1', subject: 'Algebra', text: 'Solve 10 equations from Chapter 3', completed: false },
    { id: '2', subject: 'Chemistry', text: 'Memorize the first 20 periodic table elements', completed: true },
    { id: '3', subject: 'Physics', text: 'Complete 5 derivations on motion', completed: false },
    { id: '4', subject: 'Algebra', text: 'Practice factoring polynomials', completed: false },
  ]);

  const toggleComplete = (id) => {
    setPracticeExercises((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const pendingExercises = practiceExercises.filter(ex => !ex.completed);
  const completedExercises = practiceExercises.filter(ex => ex.completed);

  const completionPercentage = practiceExercises.length > 0
    ? (completedExercises.length / practiceExercises.length) * 100
    : 0;

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
          <Text style={styles.headerTitle}>Practice Zone</Text>
        </View>
        <Text style={styles.headerSubtitle}>Keep up the great work{studentName ? `, ${studentName}` : ''}!</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.progressCard}>
          <View style={[styles.progressCircle, { width: normalize(96), height: normalize(96), borderRadius: normalize(48), borderWidth: normalize(4) }]}>
            <Text style={[styles.progressText, { fontSize: normalize(20) }]}>{Math.round(completionPercentage)}%</Text>
          </View>

          <View style={styles.progressInfo}>
            <Text style={[styles.progressInfoTitle, { fontSize: normalize(16) }]}>Today's Progress</Text>
            <Text style={[styles.progressInfoSubtitle, { fontSize: normalize(13) }]}>
              You've completed {completedExercises.length} of {practiceExercises.length} exercises.
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { fontSize: normalize(18) }]}>Let's Practice ({pendingExercises.length})</Text>
        {pendingExercises.length > 0 ? (
          pendingExercises.map(item => (
            <PracticeItem key={item.id} item={item} onToggle={toggleComplete} />
          ))
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={[styles.emptyStateEmoji, { fontSize: normalize(48) }]}>🏆</Text>
            <Text style={[styles.emptyStateText, { fontSize: normalize(20) }]}>Well Done!</Text>
            <Text style={[styles.emptyStateSubtext, { fontSize: normalize(14) }]}>You've completed all your practice for today.</Text>
          </View>
        )}

        {completedExercises.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { fontSize: normalize(18), marginTop: normalize(18) }]}>Completed ({completedExercises.length})</Text>
            {completedExercises.map(item => (
              <PracticeItem key={item.id} item={item} onToggle={toggleComplete} />
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const PracticeItem = ({ item, onToggle }) => {
  const details = subjectDetails[item.subject] || subjectDetails.Default;
  const isCompleted = item.completed;

  return (
    <View style={[styles.card, { paddingVertical: normalize(14), paddingHorizontal: normalize(14) }]}>
      <View style={[styles.cardIconContainer, { width: normalize(54), height: normalize(54), borderRadius: normalize(27), marginRight: normalize(14) }]}>
        <Text style={{ fontSize: normalize(22) }}>{details.icon}</Text>
      </View>

      <View style={styles.cardTextContainer}>
        <Text style={[styles.cardText, { fontSize: normalize(15) }, isCompleted && styles.cardTextCompleted]}>
          {item.text}
        </Text>
        <Text style={[styles.cardSubject, { color: details.color, fontSize: normalize(13) }]}>
          {item.subject}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => onToggle(item.id)}
        style={[
          styles.checkbox,
          {
            width: normalize(30),
            height: normalize(30),
            borderRadius: normalize(15),
            marginLeft: normalize(12),
            borderWidth: normalize(2),
          },
          isCompleted && { backgroundColor: '#28A745', borderColor: '#28A745' }
        ]}
      >
        {isCompleted && <Text style={[styles.checkmark, { fontSize: normalize(14) }]}>✓</Text>}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F7FE' },

  headerGradient: {
    paddingVertical: normalize(36),
    paddingHorizontal: normalize(20),
    borderBottomLeftRadius: normalize(30),
    borderBottomRightRadius: normalize(30),
    shadowColor: '#6A5AE0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 6,
    marginBottom: normalize(8),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(6),
  },
  backButton: {
    position: 'absolute',
    left: normalize(0),
    padding: normalize(8),
  },
  backArrow: {
    fontSize: normalize(28),
    color: '#FFF',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: normalize(22),
    fontWeight: '700',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: normalize(14),
    color: '#FFF',
    textAlign: 'center',
    marginTop: normalize(6),
  },

  scrollContainer: {
    padding: normalize(20),
    paddingBottom: normalize(60),
  },

  progressCard: {
    backgroundColor: '#6A5AE0',
    borderRadius: normalize(16),
    padding: normalize(14),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(24),
  },
  progressCircle: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: normalize(14),
    borderColor: '#FFFFFF'
  },
  progressText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressInfo: {
    flex: 1,
  },
  progressInfoTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  progressInfoSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: normalize(4),
  },

  sectionTitle: {
    fontSize: normalize(18),
    fontWeight: '600',
    color: '#334155',
    marginBottom: normalize(12),
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(14),
    marginBottom: normalize(12),
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  cardIconContainer: {
    backgroundColor: '#F4F7FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: normalize(20),
  },
  cardTextContainer: {
    flex: 1,
  },
  cardText: {
    color: '#334155',
    fontWeight: '500',
  },
  cardTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  cardSubject: {
    fontWeight: '700',
    marginTop: normalize(6),
  },

  checkbox: {
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  checkmark: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: normalize(32),
    backgroundColor: '#FFFFFF',
    borderRadius: normalize(12),
    marginBottom: normalize(12),
  },
  emptyStateEmoji: {
    fontSize: normalize(48),
  },
  emptyStateText: {
    fontSize: normalize(20),
    fontWeight: '700',
    color: '#334155',
    marginTop: normalize(12),
  },
  emptyStateSubtext: {
    fontSize: normalize(14),
    color: '#64748B',
    marginTop: normalize(8),
    textAlign: 'center',
    paddingHorizontal: normalize(8),
  },
});
