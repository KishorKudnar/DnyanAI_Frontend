import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PixelRatio,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';
import { allSubjects } from './SubjectListScreen';
import { updateProgress } from '../utils/ProgressTracker';

const { width } = Dimensions.get('window');
const scale = width / 390;
const normalize = (size) =>
  Math.round(PixelRatio.roundToNearestPixel(size * scale));

export default function TestSubjectListScreen({ navigation, route }) {
  const studentClass = route.params?.studentClass || '11';
  const stream = route.params?.stream || 'Science';
  const board = route.params?.board || 'State Board';

  const formattedClass =
    studentClass === '11'
      ? '11th'
      : studentClass === '12'
      ? '12th'
      : studentClass;

  const key = `${formattedClass}-${stream}-${board}`
    .trim()
    .toLowerCase();

  const subjects = allSubjects[key] || [];

  const canonicalMap = {
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    mathematics: 'Mathematics I',
    maths: 'Mathematics I',
    math: 'Mathematics I',
  };

  const getCanonical = (title) => {
    const t = title.toLowerCase();
    for (let key of Object.keys(canonicalMap)) {
      if (t.includes(key)) return canonicalMap[key];
    }
    return title;
  };

  return (
    <ScreenContainer>
      <LinearGradient
        colors={['#A18DFF', '#6A5AE0']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          <Text style={styles.headerText}>Select a Subject</Text>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {subjects.length === 0 ? (
          <Text style={styles.noSubjectsText}>
            No subjects available.
          </Text>
        ) : (
          <View style={styles.tileContainer}>
            {subjects.map((subject) => {
              const canonicalSubject = getCanonical(subject.title);

              return (
                <TouchableOpacity
                  key={subject.id}
                  style={styles.tileCard}
                  activeOpacity={0.85}
                  onPress={async () => {
                    await updateProgress(canonicalSubject, 'test');

                    navigation.navigate('ChapterQuizScreen', {
                      subjectTitle: canonicalSubject,
                      studentClass,
                    });
                  }}
                >
                  <Text style={styles.tileEmoji}>{subject.emoji}</Text>
                  <Text style={styles.tileText}>{subject.title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const TILE_WIDTH =
  (width - normalize(48) * 2 - normalize(16)) / 2;

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: normalize(16),
    paddingBottom: normalize(40),
  },

  headerGradient: {
    paddingVertical: normalize(50),
    paddingHorizontal: normalize(20),
    paddingBottom: normalize(10),
    marginHorizontal: -normalize(20),
    marginTop: -normalize(80),
    borderBottomLeftRadius: normalize(30),
    borderBottomRightRadius: normalize(30),
    elevation: 6,
  },

  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(20),
  },

  backButton: {
    paddingRight: normalize(30),
    paddingBottom: normalize(15),
  },

  backArrow: {
    fontSize: normalize(32),
    color: '#FFF',
    fontWeight: '800',
  },

  headerText: {
    fontSize: normalize(22),
    color: '#FFF',
    fontWeight: '700',
  },

  tileContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },

  tileCard: {
    width: TILE_WIDTH,
    backgroundColor: '#fff',
    borderRadius: normalize(16),
    paddingVertical: normalize(28),
    alignItems: 'center',
    marginVertical: normalize(8),
    borderWidth: 1,
    borderColor: colors.purpleLight,
    shadowColor: '#000',
    elevation: 4,
  },

  tileEmoji: {
    fontSize: normalize(38),
    marginBottom: normalize(10),
  },

  tileText: {
    fontSize: normalize(16),
    fontWeight: '600',
    textAlign: 'center',
  },

  noSubjectsText: {
    textAlign: 'center',
    marginTop: normalize(20),
    fontSize: normalize(16),
    color: colors.textSecondary,
  },
});
