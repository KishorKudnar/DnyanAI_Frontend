import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import colors from '../theme/colors';

const BACKEND_URL = 'https://dnyanai-backend-1.onrender.com/api/forgot-password';


export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        Alert.alert('Success', data.message || 'Password reset link sent!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Unable to send reset link.');
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Network issue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.box}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.subtitle}>
          Enter your registered email to receive a password reset link.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor={colors.muted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Pressable onPress={handleForgotPassword} disabled={loading}>
          <LinearGradient
            colors={[colors.purple, colors.purpleDark]}
            style={styles.button}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Text>
          </LinearGradient>
        </Pressable>

        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back to Login</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: colors.background, 
    padding: 20
  },
  box: { width: '100%', maxWidth: 400 },
  title: { fontSize: 28, fontWeight: '700', color: colors.purpleDark, marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.muted, textAlign: 'center', marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: colors.purpleLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    color: colors.text,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 5,
    marginBottom: 20,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backText: { textAlign: 'center', color: colors.purpleDark, fontWeight: '600' },
});
