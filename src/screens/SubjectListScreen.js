import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  PixelRatio,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';

const { width } = Dimensions.get('window');
const scale = width / 390;
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

export const allSubjects = {
  '11th-science-state board': [
    { id: 'math1', title: 'Mathematics I', emoji: '📘' },
    { id: 'math2', title: 'Mathematics II', emoji: '📗' },
    { id: 'physics', title: 'Physics', emoji: '⚡' },
    { id: 'chemistry', title: 'Chemistry', emoji: '🧪' },
    { id: 'biology', title: 'Biology', emoji: '🧬' },
  ],
  '12th-science-state board': [
    { id: 'math1', title: 'Mathematics I', emoji: '📘' },
    { id: 'math2', title: 'Mathematics II', emoji: '📗' },
    { id: 'physics', title: 'Physics', emoji: '⚡' },
    { id: 'chemistry', title: 'Chemistry', emoji: '🧪' },
    { id: 'biology', title: 'Biology', emoji: '🧬' },
  ],
};

export default function SubjectListScreen({ navigation, route }) {
  const { studentClass, stream, board } = route.params;

  const formattedClass =
    studentClass === '11' ? '11th' :
    studentClass === '12' ? '12th' :
    studentClass;

  const key = `${formattedClass}-${stream}-${board}`.trim().toLowerCase();
  const subjects = allSubjects[key] || [];

  return (
    <ScreenContainer>
      <LinearGradient
        colors={['#A18DFF', '#6A5AE0']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerText}>Select a Subject</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {subjects.length === 0 ? (
          <Text style={styles.noSubjectsText}>No subjects found for selected options</Text>
        ) : (
          <View style={styles.tileContainer}>
            {subjects.map((subject) => (
              <TouchableOpacity
                key={subject.id}
                style={styles.tileCard}
                onPress={() =>
                  navigation.navigate('ChapterScreen', {
                    subjectTitle: subject.title,
                    studentClass,
                  })
                }
              >
                <Text style={styles.tileEmoji}>{subject.emoji}</Text>
                <Text style={styles.tileText}>{subject.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const TILE_WIDTH = (width - normalize(48) * 2 - normalize(16)) / 2;

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
    marginBottom: normalize(16),
    borderBottomLeftRadius: normalize(30),
    borderBottomRightRadius: normalize(30),
    elevation: 6,
    shadowColor: '#6A5AE0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: normalize(20),
  },
  backButton: {
    padding: normalize(8),
    paddingRight: normalize(30),
    paddingBottom: normalize(15),
    marginRight: normalize(8),
  },
  backArrow: {
    fontSize: normalize(32),
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerText: {
    fontSize: normalize(22),
    fontWeight: '700',
    color: '#FFFFFF',
  },
  noSubjectsText: {
    textAlign: 'center',
    marginTop: normalize(20),
    color: colors.textSecondary || '#8A8A8A',
    fontSize: normalize(16),
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tileEmoji: {
    fontSize: normalize(38),
    marginBottom: normalize(10),
  },
  tileText: {
    fontSize: normalize(16),
    fontWeight: '600',
    color: colors.purpleDark || '#4B3AA8',
    textAlign: 'center',
    paddingHorizontal: normalize(8),
  },
});
