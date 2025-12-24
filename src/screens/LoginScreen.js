import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import colors from '../theme/colors';

const BASE_URL = 'https://dnyanai-backend-1.onrender.com/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '415280119409-j3aekn3neqrhettgs0jdpr88pj1nua19.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }, []);

  const fetchWithTimeout = (url, options, timeout = 8000) =>
    Promise.race([
      fetch(url, options),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), timeout))
    ]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Both fields are required!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetchWithTimeout(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      }, 10000);

      const data = await response.json().catch(() => ({}));

      if (data.success && data.token) {
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userEmail', (data.email || email.trim()));
        if (data.name) await AsyncStorage.setItem('userName', data.name);
        if (data.className) await AsyncStorage.setItem('userClass', data.className);
        if (data.stream) await AsyncStorage.setItem('userStream', data.stream);
        if (data.board) await AsyncStorage.setItem('userBoard', data.board);
        if (data.profilePic) await AsyncStorage.setItem('userProfilePic', data.profilePic);

        navigation.reset({
          index: 0,
          routes: [{
            name: 'Dashboard',
            params: {
              studentEmail: data.email || email.trim(),
              studentName: data.name || (await AsyncStorage.getItem('userName')) || 'User',
              studentClass: data.className,
              stream: data.stream,
              board: data.board,
              profilePic: data.profilePic,
            }
          }]
        });
      } else {
        Alert.alert('Login Failed', data.message || 'Invalid credentials!');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Connection Error', 'Please ensure your backend is running and you are on the same network.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      try { await GoogleSignin.signOut(); } catch (e) { /* ignore */ }
      const { idToken, user } = await GoogleSignin.signIn();

      if (!idToken) {
        Alert.alert('Error', 'Google sign-in failed: No ID token received.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json().catch(() => ({}));

      if (data.success) {
        if (data.token) {
          await AsyncStorage.setItem('userToken', data.token);
        }
        if (data.email) await AsyncStorage.setItem('userEmail', data.email);
        if (data.name) await AsyncStorage.setItem('userName', data.name);
        if (data.className) await AsyncStorage.setItem('userClass', data.className);
        if (data.stream) await AsyncStorage.setItem('userStream', data.stream);
        if (data.board) await AsyncStorage.setItem('userBoard', data.board);
        if (data.profilePic) await AsyncStorage.setItem('userProfilePic', data.profilePic);

        if (!data.className || !data.stream || !data.board) {
          navigation.navigate('Profile', {
            email: data.email || user.email,
            name: data.name || user.name,
            profilePic: data.profilePic || user.photo,
            className: data.className,
            stream: data.stream,
            board: data.board,
          });
        } else {
          navigation.reset({
            index: 0,
            routes: [{
              name: 'Dashboard',
              params: {
                studentEmail: data.email || user.email,
                studentName: data.name || user.name,
                studentClass: data.className,
                stream: data.stream,
                board: data.board,
                profilePic: data.profilePic || user.photo,
              }
            }]
          });
        }
      } else {
        Alert.alert('Google Login Failed', data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Google Sign-In failed. Check network and Google Play Services.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoContainer}>
          <Image source={require('../assets/images/Logo.png')} style={styles.logo} resizeMode="contain" />
        </View>

        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.inputPassword}
            placeholder="Password"
            placeholderTextColor={colors.muted}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Text style={styles.emoji}>{showPassword ? '🔓' : '🔒'}</Text>
          </TouchableOpacity>
        </View>

        <Pressable onPress={handleLogin} disabled={loading}>
          <LinearGradient
            colors={[colors.purple, colors.purpleDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
          </LinearGradient>
        </Pressable>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <Pressable onPress={handleGoogleLogin} style={styles.googleButton}>
          <View style={styles.googleIconContainer}>
            <Image source={require('../assets/images/GoogleIcon.png')} style={styles.googleIcon} />
          </View>
          <Text style={styles.googleText}>Continue with Google</Text>
        </Pressable>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don’t have an account? Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  logoContainer: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#E8DAEF', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 20 },
  logo: { width: 140, height: 140, borderRadius: 70 },
  title: { fontSize: 28, fontWeight: '700', color: colors.purpleDark, marginBottom: 20, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: colors.purpleLight, borderRadius: 12, padding: 14, marginBottom: 16, color: colors.text, backgroundColor: '#fff' },
  passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.purpleLight, borderRadius: 12, paddingHorizontal: 14, marginBottom: 16, backgroundColor: '#fff' },
  inputPassword: { flex: 1, paddingVertical: 14, color: colors.text },
  emoji: { fontSize: 20, marginLeft: 8 },
  gradientButton: { paddingVertical: 16, borderRadius: 12, alignItems: 'center', elevation: 6 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  orContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 12 },
  line: { flex: 1, height: 1, backgroundColor: colors.purpleLight, marginHorizontal: 10 },
  orText: { fontSize: 14, color: colors.purpleDark, fontWeight: '600' },
  googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', paddingVertical: 14, borderRadius: 12, marginBottom: 20, width: '100%', maxWidth: 400, alignSelf: 'center', elevation: 3 },
  googleIconContainer: { position: 'absolute', left: 16, width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#ddd' },
  googleIcon: { width: 20, height: 20 },
  googleText: { fontSize: 16, fontWeight: '600', color: '#444' },
  link: { color: colors.purpleDark, textAlign: 'center', marginTop: 20, fontWeight: '600' },
  forgot: { color: colors.muted, textAlign: 'center', marginTop: 10, fontSize: 14 },
});
