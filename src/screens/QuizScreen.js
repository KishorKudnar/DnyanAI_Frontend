import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  PixelRatio,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import ScreenContainer from '../components/ScreenContainer';
import colors from '../theme/colors';
import { updateProgress } from '../utils/ProgressTracker';

const { width } = Dimensions.get('window');
const BASE_WIDTH = 390;
const scale = width / BASE_WIDTH;
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const quizData = {
  ch1: [
    {
      question: 'What is the SI unit of length?',
      options: ['Meter', 'Kilogram', 'Second', 'Ampere'],
      correctIndex: 0,
    },
    {
      question: 'Which of these is a scalar quantity?',
      options: ['Velocity', 'Force', 'Speed', 'Acceleration'],
      correctIndex: 2,
    },
  ],
  ch2: [
    {
      question: 'What is the formula for force?',
      options: ['F = m/a', 'F = m*v', 'F = m*a', 'F = m^2*a'],
      correctIndex: 2,
    },
  ],
};

export default function QuizScreen({ route, navigation }) {
  const { quizId, quizTitle, subjectTitle } = route.params;

  const questions = quizData[quizId] || [];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleOptionPress = (index) => {
    setSelectedOption(index);
    if (index === questions[currentIndex].correctIndex) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (selectedOption === null) {
      Alert.alert("Please select an option");
      return;
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    setQuizFinished(true);

    try {
      await updateProgress(subjectTitle, "test", {
        addHistoryEntry: `Completed Test: ${quizTitle}`,
        testScore: score,
        totalQuestions: questions.length,
      });
    } catch (e) {
      console.warn("Failed to update test progress", e);
    }
  };

  if (questions.length === 0) {
    return (
      <ScreenContainer>
        <Text style={styles.header}>No quiz available for {quizTitle}</Text>
      </ScreenContainer>
    );
  }

  if (quizFinished) {
    return (
      <ScreenContainer>
        <LinearGradient colors={['#A18DFF', '#6A5AE0']} style={styles.headerGradient}>
          <Text style={styles.headerText}>Quiz Finished!</Text>
        </LinearGradient>

        <View style={styles.finishedContainer}>
          <Text style={styles.finishedText}>Your Score</Text>

          <Text style={styles.scoreText}>
            {score} / {questions.length}
          </Text>

          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => {
              setCurrentIndex(0);
              setScore(0);
              setSelectedOption(null);
              setQuizFinished(false);
            }}>
            <Text style={styles.restartButtonText}>Restart Quiz</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.restartButton, { backgroundColor: '#A18DFF' }]}
            onPress={() => navigation.goBack()}>
            <Text style={styles.restartButtonText}>Back to Chapters</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <ScreenContainer>
      <LinearGradient colors={['#A18DFF', '#6A5AE0']} style={styles.headerGradient}>
        <Text style={styles.headerText}>{quizTitle}</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.questionText}>
          {currentIndex + 1}. {currentQuestion.question}
        </Text>

        <View style={styles.optionsGrid}>
          {currentQuestion.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionTile,
                selectedOption === index && styles.selectedTile,
              ]}
              onPress={() => handleOptionPress(index)}
            >
              <Text
                style={[
                  styles.optionTileText,
                  selectedOption === index && styles.selectedTileText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>
            {currentIndex + 1 === questions.length ? "Finish Quiz" : "Next Question"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: normalize(20),
    paddingBottom: normalize(50),
  },

  headerGradient: {
    borderBottomLeftRadius: normalize(24),
    borderBottomRightRadius: normalize(24),
    paddingVertical: normalize(18),
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  headerText: {
    fontSize: normalize(22),
    fontWeight: '700',
    color: colors.white,
  },

  questionText: {
    fontSize: normalize(18),
    fontWeight: '600',
    marginBottom: normalize(20),
    color: '#4A3AFF',
  },

  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: normalize(24),
  },

  optionTile: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: normalize(16),
    paddingVertical: normalize(20),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: normalize(14),
    elevation: 3,
  },
  selectedTile: {
    backgroundColor: "#6A5AE0",
    borderColor: "#5A4AE0",
  },
  optionTileText: {
    fontSize: normalize(15),
    color: "#4A3AFF",
    fontWeight: "500",
  },
  selectedTileText: {
    color: "#FFF",
    fontWeight: "700",
  },

  nextButton: {
    backgroundColor: "#6A5AE0",
    paddingVertical: normalize(14),
    borderRadius: normalize(14),
    alignItems: "center",
    elevation: 4,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: normalize(16),
    fontWeight: "700",
  },

  finishedContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: normalize(20),
  },
  finishedText: {
    fontSize: normalize(20),
    fontWeight: "600",
    color: "#4A3AFF",
    marginBottom: normalize(8),
  },
  scoreText: {
    fontSize: normalize(28),
    fontWeight: "800",
    color: "#6A5AE0",
    marginBottom: normalize(24),
  },
  restartButton: {
    backgroundColor: "#6A5AE0",
    paddingVertical: normalize(12),
    paddingHorizontal: normalize(24),
    borderRadius: normalize(12),
    marginTop: normalize(12),
  },
  restartButtonText: {
    fontSize: normalize(16),
    fontWeight: "600",
    color: "#fff",
  },
});
