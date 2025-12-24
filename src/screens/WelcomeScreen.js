import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  Pressable,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../theme/colors';

const { width, height } = Dimensions.get('window');

const symbolsPool = ['∑', 'π', '∞', 'α', 'β', 'Δ', 'Ω', '√', '≈', 'λ', 'H₂O', '⚛', '⚡', '🧪', '🧬', '🔬', '🧲'];
const MAX_REPEAT = 3;
const TOTAL_SYMBOLS = 60;
const symbolColors = ['#C39BD3', '#85C1E9', '#7DCEA0', '#F7DC6F', '#F1948A'];

const API_BASE = 'https://dnyanai-backend-1.onrender.com/api';
const GET_PROFILE = `${API_BASE}/get-profile`;

export default function WelcomeScreen({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const [checkingLogin, setCheckingLogin] = useState(true);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
    ]).start();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const email = await AsyncStorage.getItem('userEmail');

        if (token && email) {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);

          const res = await fetch(GET_PROFILE, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ email }),
            signal: controller.signal,
          }).catch((e) => null);

          clearTimeout(timeout);

          if (res && res.ok) {
            const json = await res.json().catch(() => null);
            if (json && json.success) {
              navigation.reset({
                index: 0,
                routes: [{
                  name: 'Dashboard',
                  params: {
                    studentEmail: json.email || email,
                    studentName: json.name || (await AsyncStorage.getItem('userName')) || 'User',
                    studentClass: json.className || (await AsyncStorage.getItem('userClass')) || '11',
                    stream: json.stream || (await AsyncStorage.getItem('userStream')) || 'Science',
                    board: json.board || (await AsyncStorage.getItem('userBoard')) || 'State Board',
                    profilePic: json.profilePic || (await AsyncStorage.getItem('userProfilePic')) || null,
                  }
                }]
              });
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Auto-login failed', err);
      } finally {
        setCheckingLogin(false);
      }
    })();
  }, [navigation]);

  const generateSymbols = () => {
    const symbolCount = {};
    const positions = [];
    const elements = [];
    let attempts = 0;

    while (elements.length < TOTAL_SYMBOLS && attempts < TOTAL_SYMBOLS * 10) {
      const sym = symbolsPool[Math.floor(Math.random() * symbolsPool.length)];
      symbolCount[sym] = symbolCount[sym] ? symbolCount[sym] : 0;

      if (symbolCount[sym] < MAX_REPEAT) {
        const x = Math.random() * (width - 30);
        const y = Math.random() * (height - 30);

        const overlap = positions.some(pos => Math.abs(pos.x - x) < 30 && Math.abs(pos.y - y) < 30);
        if (!overlap) {
          positions.push({ x, y });

          const floatAnim = new Animated.Value(0);
          const rotateAnim = new Animated.Value(Math.random() * 360);

          Animated.loop(
            Animated.sequence([
              Animated.timing(floatAnim, { toValue: 1, duration: 4000 + Math.random() * 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
              Animated.timing(floatAnim, { toValue: 0, duration: 4000 + Math.random() * 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
            ])
          ).start();

          Animated.loop(
            Animated.sequence([
              Animated.timing(rotateAnim, { toValue: 360, duration: 15000 + Math.random() * 5000, easing: Easing.linear, useNativeDriver: true }),
              Animated.timing(rotateAnim, { toValue: 0, duration: 0, useNativeDriver: true }),
            ])
          ).start();

          const translateY = floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -10 - Math.random() * 10] });
          const rotate = rotateAnim.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });

          const color = symbolColors[Math.floor(Math.random() * symbolColors.length)];

          elements.push(
            <Animated.Text
              key={elements.length}
              style={{
                position: 'absolute',
                fontSize: 18 + Math.random() * 8,
                color: color,
                opacity: 0.18 + Math.random() * 0.12,
                left: x,
                top: y,
                transform: [{ translateY }, { rotate }],
              }}
            >
              {sym}
            </Animated.Text>
          );

          symbolCount[sym]++;
        }
      }
      attempts++;
    }

    return elements;
  };

  const symbolElements = generateSymbols();

  if (checkingLogin) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
        <ActivityIndicator size="large" color={colors.purple} />
        <Text style={{ marginTop: 12, color: '#666' }}>Checking your account...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
      <View style={styles.backgroundSymbols}>{symbolElements}</View>
      <Animated.View style={[styles.imageContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <Image
          source={require('../assets/images/Logo.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={[styles.textContainer, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <MaskedView
          maskElement={<Text style={[styles.title, { backgroundColor: 'transparent' }]}>Welcome to ज्ञान AI</Text>}
        >
          <LinearGradient colors={[colors.purple, colors.purpleDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={[styles.title, { opacity: 0 }]}>Welcome to ज्ञान AI</Text>
          </LinearGradient>
        </MaskedView>

        <Animated.Text style={[styles.subtitle, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          Your personal study companion. Track progress, explore subjects, and learn smarter every day!
        </Animated.Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <Pressable
          onPress={() => navigation.navigate('Login')}
          style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
        >
          <LinearGradient
            colors={[colors.purple, colors.purpleDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    justifyContent: 'space-between',
    padding: 24,
  },
  backgroundSymbols: { position: 'absolute', width, height },
  imageContainer: { alignItems: 'center', marginTop: 50 },
  image: { width: width * 0.5, height: width * 0.5, borderRadius: (width * 0.6) / 2, backgroundColor: '#E8DAEF', padding: 20 },
  textContainer: { alignItems: 'center', marginHorizontal: 10 },
  title: { fontSize: 32, fontWeight: '800', textAlign: 'center', letterSpacing: 1 },
  subtitle: { fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 22, paddingHorizontal: 10, marginTop: 12 },
  buttonContainer: { marginBottom: 50 },
  gradientButton: {
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});
