import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DropDownPicker from 'react-native-dropdown-picker';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../theme/colors';

const BASE_URL = 'https://dnyanai-backend-1.onrender.com/api';
const REGISTER_URL = `${BASE_URL}/register`;

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');

  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);

  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);

  const [confirm, setConfirm] = useState('');
  const [confirmTouched, setConfirmTouched] = useState(false);

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [classOpen, setClassOpen] = useState(false);
  const [classValue, setClassValue] = useState(null);
  const [classTouched, setClassTouched] = useState(false);
  const [classItems, setClassItems] = useState([
    { label: '11th', value: '11' },
    { label: '12th', value: '12' },
  ]);

  const [streamOpen, setStreamOpen] = useState(false);
  const [streamValue, setStreamValue] = useState(null);
  const [streamTouched, setStreamTouched] = useState(false);
  const [streamItems, setStreamItems] = useState([]);

  const [boardOpen, setBoardOpen] = useState(false);
  const [boardValue, setBoardValue] = useState(null);
  const [boardTouched, setBoardTouched] = useState(false);
  const [boardItems, setBoardItems] = useState([]);

  // Google setup
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '415280119409-j3aekn3neqrhettgs0jdpr88pj1nua19.apps.googleusercontent.com',
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }, []);

  // Stream and Board setup
  useEffect(() => {
    const streamOptions = {
      '11': [
        { label: 'Science', value: 'Science' },
        { label: 'Commerce', value: 'Commerce' },
        { label: 'Arts', value: 'Arts' },
      ],
      '12': [
        { label: 'Science', value: 'Science' },
        { label: 'Commerce', value: 'Commerce' },
        { label: 'Arts', value: 'Arts' },
      ],
    };

    if (classValue) setStreamItems(streamOptions[classValue]);
    else setStreamItems([]);

    setStreamValue(null);
    setBoardValue(null);
  }, [classValue]);

  useEffect(() => {
    const boardOptions = {
      Science: [
        { label: 'CBSE', value: 'CBSE' },
        { label: 'State Board', value: 'State Board' },
      ],
      Commerce: [
        { label: 'CBSE', value: 'CBSE' },
        { label: 'State Board', value: 'State Board' },
      ],
      Arts: [
        { label: 'CBSE', value: 'CBSE' },
        { label: 'State Board', value: 'State Board' },
      ],
    };

    if (streamValue) setBoardItems(boardOptions[streamValue]);
    else setBoardItems([]);

    setBoardValue(null);
  }, [streamValue]);

  /** Validation logic */
  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return { valid: false, strength: 'Weak', color: 'red' };
    const strong = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    if (strong.test(pwd)) return { valid: true, strength: 'Strong', color: 'green' };
    const medium = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/;
    if (medium.test(pwd)) return { valid: true, strength: 'Medium', color: 'orange' };
    return { valid: false, strength: 'Weak', color: 'red' };
  };

  const emailValid = validateEmail(email);
  const passwordInfo = validatePassword(password);
  const passwordsMatch = confirm === password && confirm.length > 0;

  /** Register handler */
  const handleRegister = async () => {
    if (!name || !email || !password || !confirm || !classValue || !streamValue || !boardValue) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    if (!emailValid) {
      Alert.alert('Invalid Email', 'Please enter a valid email.');
      return;
    }

    if (!passwordInfo.valid) {
      Alert.alert('Weak Password', 'Password must include upper, lower, number, and symbol.');
      return;
    }

    if (!passwordsMatch) {
      Alert.alert('Mismatch', 'Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          password,
          className: classValue,
          stream: streamValue,
          board: boardValue,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (data.success) {
        if (data.token) await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userEmail', data.email || email.trim());
        if (data.name) await AsyncStorage.setItem('userName', data.name);

        await AsyncStorage.setItem('userClass', classValue);
        await AsyncStorage.setItem('userStream', streamValue);
        await AsyncStorage.setItem('userBoard', boardValue);

        if (data.profilePic)
          await AsyncStorage.setItem('userProfilePic', data.profilePic);

        Alert.alert('Success', data.message || `Welcome ${name.trim()}!`);

        navigation.reset({
          index: 0,
          routes: [
            {
              name: 'Dashboard',
              params: {
                studentEmail: data.email || email.trim(),
                studentName: data.name || name.trim(),
                studentClass: classValue,
                stream: streamValue,
                board: boardValue,
                profilePic: data.profilePic || null,
              },
            },
          ],
        });
      } else {
        Alert.alert('Error', data.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Register Error:', error);
      Alert.alert('Error', 'Unable to connect to server.');
    } finally {
      setLoading(false);
    }
  };

  /** Google login */
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);

    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      try {
        await GoogleSignin.signOut();
      } catch {}

      const { idToken, user } = await GoogleSignin.signIn();

      if (!idToken) {
        Alert.alert('Error', 'Google sign-in failed.');
        setGoogleLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json().catch(() => ({}));

      if (data.success) {
        if (data.token) await AsyncStorage.setItem('userToken', data.token);
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
            routes: [
              {
                name: 'Dashboard',
                params: {
                  studentEmail: data.email || user.email,
                  studentName: data.name || user.name,
                  studentClass: data.className,
                  stream: data.stream,
                  board: data.board,
                  profilePic: data.profilePic || user.photo,
                },
              },
            ],
          });
        }
      } else {
        Alert.alert('Google Login Failed', data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      Alert.alert('Error', 'Google Sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      contentInsetAdjustmentBehavior="always"
    >
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/images/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.title}>Create Your Account</Text>

      {/* NAME */}
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      {/* EMAIL */}
      <TextInput
        style={[
          styles.input,
          emailTouched && !emailValid && { borderColor: 'red' },
          emailValid && emailTouched && { borderColor: 'green' },
        ]}
        placeholder="Email"
        value={email}
        onChangeText={(t) => {
          setEmail(t);
          setEmailTouched(true);
        }}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* CLASS */}
      <View style={{ zIndex: 3000 }}>
        <DropDownPicker
          open={classOpen}
          value={classValue}
          items={classItems}
          setOpen={setClassOpen}
          setValue={(v) => {
            setClassTouched(true);
            setClassValue(v());
          }}
          setItems={setClassItems}
          listMode="SCROLLVIEW"
          placeholder="Select Class"
          style={[
            styles.dropdown,
            classTouched && !classValue && { borderColor: 'red' },
            classValue && classTouched && { borderColor: 'green' },
          ]}
        />
      </View>

      {/* STREAM */}
      <View style={{ zIndex: 2000 }}>
        <DropDownPicker
          open={streamOpen}
          value={streamValue}
          items={streamItems}
          setOpen={setStreamOpen}
          setValue={(v) => {
            setStreamTouched(true);
            setStreamValue(v());
          }}
          setItems={setStreamItems}
          listMode="SCROLLVIEW"
          placeholder="Select Stream"
          disabled={!classValue}
          style={[
            styles.dropdown,
            streamTouched && !streamValue && { borderColor: 'red' },
            streamValue && streamTouched && { borderColor: 'green' },
          ]}
        />
      </View>

      {/* BOARD */}
      <View style={{ zIndex: 1000 }}>
        <DropDownPicker
          open={boardOpen}
          value={boardValue}
          items={boardItems}
          setOpen={setBoardOpen}
          setValue={(v) => {
            setBoardTouched(true);
            setBoardValue(v());
          }}
          setItems={setBoardItems}
          listMode="SCROLLVIEW"
          placeholder="Select Board"
          disabled={!streamValue}
          style={[
            styles.dropdown,
            boardTouched && !boardValue && { borderColor: 'red' },
            boardValue && boardTouched && { borderColor: 'green' },
          ]}
        />
      </View>

      {/* PASSWORD */}
      <View
        style={[
          styles.passwordContainer,
          passwordTouched && !passwordInfo.valid && { borderColor: 'red' },
          passwordTouched && passwordInfo.valid && { borderColor: passwordInfo.color },
        ]}
      >
        <TextInput
          style={styles.inputPassword}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setPasswordTouched(true);
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Text style={{ fontSize: 22 }}>{showPassword ? '🔓' : '🔒'}</Text>
        </TouchableOpacity>
      </View>

      {/* Strength */}
      {passwordTouched && password.length > 0 && (
        <Text style={{ color: passwordInfo.color, marginBottom: 6 }}>
          Password Strength: {passwordInfo.strength}
        </Text>
      )}

      {/* CONFIRM PASSWORD */}
      <View
        style={[
          styles.passwordContainer,
          confirmTouched && !passwordsMatch && { borderColor: 'red' },
          confirmTouched && passwordsMatch && { borderColor: 'green' },
        ]}
      >
        <TextInput
          style={styles.inputPassword}
          placeholder="Confirm Password"
          secureTextEntry={!showConfirm}
          value={confirm}
          onChangeText={(t) => {
            setConfirm(t);
            setConfirmTouched(true);
          }}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Text style={{ fontSize: 22 }}>{showConfirm ? '🔓' : '🔒'}</Text>
        </TouchableOpacity>
      </View>

      {/* REGISTER BUTTON */}
      <Pressable
        onPress={handleRegister}
        disabled={loading}
        style={({ pressed }) => [
          { opacity: pressed ? 0.85 : 1 },
          styles.fullWidthButton,
        ]}
      >
        <LinearGradient
          colors={[colors.purple, colors.purpleDark]}
          style={styles.gradientButton}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </LinearGradient>
      </Pressable>

      {/* OR */}
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* GOOGLE */}
      <Pressable
        onPress={handleGoogleSignIn}
        disabled={googleLoading}
        style={({ pressed }) => [
          styles.googleButton,
          { opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <View style={styles.googleIconContainer}>
          <Image
            source={require('../assets/images/GoogleIcon.png')}
            style={styles.googleIcon}
          />
        </View>

        {googleLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.googleText}>Continue with Google</Text>
        )}
      </Pressable>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 70,
  },

  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#E8DAEF',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },

  logo: { width: 140, height: 140, borderRadius: 70 },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.purpleDark,
    marginBottom: 20,
    textAlign: 'center',
  },

  input: {
    borderWidth: 1,
    borderColor: colors.purpleLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: colors.text,
  },

  dropdown: {
    borderWidth: 1,
    borderColor: colors.purpleLight,
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.purpleLight,
    borderRadius: 12,
    paddingHorizontal: 14,
    marginBottom: 10,
    backgroundColor: '#fff',
  },

  inputPassword: {
    flex: 1,
    paddingVertical: 14,
    color: colors.text,
  },

  gradientButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: '100%',
  },

  fullWidthButton: {
    width: '100%',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.purpleLight,
    marginHorizontal: 10,
  },

  orText: {
    fontSize: 14,
    color: colors.purpleDark,
    fontWeight: '600',
  },

  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 3,
  },

  googleIconContainer: {
    position: 'absolute',
    left: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },

  googleIcon: {
    width: 20,
    height: 20,
  },

  googleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },

  link: {
    color: colors.purpleDark,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
});
