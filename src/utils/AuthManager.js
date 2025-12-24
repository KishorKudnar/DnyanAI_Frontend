import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'userToken';
const EMAIL_KEY = 'userEmail';

export async function saveSession(token, email) {
  await AsyncStorage.setItem(TOKEN_KEY, token);
  await AsyncStorage.setItem(EMAIL_KEY, email);
}

export async function getSession() {
  const token = await AsyncStorage.getItem(TOKEN_KEY);
  const email = await AsyncStorage.getItem(EMAIL_KEY);

  if (!token || !email) return null;

  return { token, email };
}

export async function clearSession() {
  await AsyncStorage.removeItem(TOKEN_KEY);
  await AsyncStorage.removeItem(EMAIL_KEY);
}
