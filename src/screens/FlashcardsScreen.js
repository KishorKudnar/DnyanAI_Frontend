import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  TouchableOpacity,
  SafeAreaView,
  PixelRatio,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');
const BASE_WIDTH = 390;
const scale = width / BASE_WIDTH;
const normalize = (size) => Math.round(PixelRatio.roundToNearestPixel(size * scale));

const SWIPE_THRESHOLD = width * 0.35;

const flashcardsData = [
  { question: 'What is Newton’s First Law?', answer: 'An object in motion stays in motion unless acted on by an external force.' },
  { question: 'What is the chemical symbol for water?', answer: 'H₂O' },
  { question: 'What is the powerhouse of the cell?', answer: 'Mitochondria' },
  { question: 'Solve for x: 2x + 10 = 20', answer: 'x = 5' },
];


export default function FlashcardsScreen({ route, navigation }) {
  const { studentName } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const position = useRef(new Animated.ValueXY()).current;
  const flipAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setIsFlipped(false);
    flipAnimation.setValue(0);
  }, [currentIndex]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) swipeCard('right');
        else if (gesture.dx < -SWIPE_THRESHOLD) swipeCard('left');
        else resetPosition();
      },
    })
  ).current;

  const swipeCard = (direction) => {
    Animated.timing(position, {
      toValue: { x: direction === 'right' ? width * 2 : -width * 2, y: 0 },
      duration: 400,
      useNativeDriver: false,
    }).start(() => {
      setCurrentIndex((prev) => prev + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      friction: 4,
      useNativeDriver: false,
    }).start();
  };

  const handleFlip = () => {
    Animated.timing(flipAnimation, {
      toValue: isFlipped ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start(() => setIsFlipped(!isFlipped));
  };

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const cardRotation = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });

  const rightLabelOpacity = position.x.interpolate({
    inputRange: [20, SWIPE_THRESHOLD],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  const leftLabelOpacity = position.x.interpolate({
    inputRange: [-SWIPE_THRESHOLD, -20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const renderCards = () => {
    if (currentIndex >= flashcardsData.length) {
      return (
        <View style={styles.deckCompleteContainer}>
          <Text style={styles.deckCompleteEmoji}>🎉</Text>
          <Text style={styles.deckCompleteText}>Deck Complete!</Text>
          <TouchableOpacity
            style={styles.restartButton}
            onPress={() => setCurrentIndex(0)}
          >
            <Text style={styles.restartButtonText}>Start Over</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return flashcardsData
      .map((card, index) => {
        if (index < currentIndex) return null;

        if (index === currentIndex) {
          return (
            <Animated.View
              key={card.question}
              style={[
                styles.cardWrapper,
                { transform: [{ translateX: position.x }, { rotate: cardRotation }] },
              ]}
              {...panResponder.panHandlers}
            >
              <Animated.View
                style={[
                  styles.card,
                  styles.cardFront,
                  { transform: [{ rotateY: frontInterpolate }] },
                ]}
              >
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={handleFlip}
                  activeOpacity={1}
                >
                  <Text style={styles.cardText}>{card.question}</Text>
                  <Text style={styles.flipHint}>(Tap to flip)</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={[
                  styles.card,
                  styles.cardBack,
                  { transform: [{ rotateY: backInterpolate }] },
                ]}
              >
                <TouchableOpacity
                  style={styles.cardContent}
                  onPress={handleFlip}
                  activeOpacity={1}
                >
                  <Text style={styles.cardText}>{card.answer}</Text>
                </TouchableOpacity>
              </Animated.View>

              <Animated.View
                style={[
                  styles.feedbackLabel,
                  styles.correctLabel,
                  { opacity: rightLabelOpacity },
                ]}
              >
                <Text style={styles.feedbackText}>Correct</Text>
              </Animated.View>
              <Animated.View
                style={[
                  styles.feedbackLabel,
                  styles.incorrectLabel,
                  { opacity: leftLabelOpacity },
                ]}
              >
                <Text style={styles.feedbackText}>Try Again</Text>
              </Animated.View>
            </Animated.View>
          );
        }

        return (
          <Animated.View
            key={card.question}
            style={[
              styles.cardWrapper,
              {
                transform: [{ scale: index === currentIndex + 1 ? nextCardScale : 0.8 }],
                top: index === currentIndex + 1 ? 10 : 20,
                zIndex: -index,
              },
            ]}
          >
            <View style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.cardText}>{card.question}</Text>
              </View>
            </View>
          </Animated.View>
        );
      })
      .reverse();
  };

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
          <Text style={styles.headerTitle}>Flashcards</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Master concepts, one card at a time!
        </Text>
      </LinearGradient>

      <View style={styles.progressContainer}>
        {currentIndex < flashcardsData.length && (
          <Text style={styles.progressText}>
            {currentIndex + 1} / {flashcardsData.length}
          </Text>
        )}
      </View>

      <View style={styles.deckContainer}>{renderCards()}</View>

      {currentIndex < flashcardsData.length && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonIncorrect]}
            onPress={() => swipeCard('left')}
          >
            <Text style={styles.buttonText}>❌</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonCorrect]}
            onPress={() => swipeCard('right')}
          >
            <Text style={styles.buttonText}>✅</Text>
          </TouchableOpacity>
        </View>
      )}
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
    elevation: 6,
    shadowColor: '#6A5AE0',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: normalize(6),
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: normalize(8),
  },
  backArrow: {
    fontSize: normalize(30),
    color: '#FFF',
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: normalize(24),
    fontWeight: '700',
    color: '#FFF',
  },
  headerSubtitle: {
    fontSize: normalize(15),
    color: '#FFF',
    textAlign: 'center',
    marginTop: normalize(5),
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: normalize(12),
  },
  progressText: {
    fontSize: normalize(16),
    color: '#64748B',
    fontWeight: '500',
  },

  deckContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardWrapper: { width: width * 0.85, height: height * 0.5, position: 'absolute' },
  card: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#999',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    backgroundColor: '#EAE8FD',
  },
  cardContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  cardText: {
    fontSize: normalize(22),
    textAlign: 'center',
    color: '#334155',
    fontWeight: '500',
  },
  flipHint: { position: 'absolute', bottom: 20, fontSize: 14, color: '#94A3B8' },

  buttonContainer: { flexDirection: 'row', justifyContent: 'center', paddingBottom: 40 },
  button: {
    width: normalize(70),
    height: normalize(70),
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    elevation: 3,
  },
  buttonCorrect: { backgroundColor: '#28A745' },
  buttonIncorrect: { backgroundColor: '#DC3545' },
  buttonText: { fontSize: normalize(30) },

  feedbackLabel: {
    position: 'absolute',
    top: 40,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 3,
  },
  correctLabel: {
    left: 20,
    borderColor: '#28A745',
    transform: [{ rotate: '-20deg' }],
  },
  incorrectLabel: {
    right: 20,
    borderColor: '#DC3545',
    transform: [{ rotate: '20deg' }],
  },
  feedbackText: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#334155',
  },

  deckCompleteContainer: { alignItems: 'center', justifyContent: 'center' },
  deckCompleteEmoji: { fontSize: 80 },
  deckCompleteText: {
    fontSize: normalize(26),
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
  },
  restartButton: {
    marginTop: 20,
    backgroundColor: '#6A5AE0',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
  },
  restartButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
