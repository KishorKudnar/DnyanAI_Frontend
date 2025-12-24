import { useColorScheme } from 'react-native';

// Static base palette
const baseColors = {
  purple: '#6C63FF',
  purpleDark: '#4B3FBF',
  purpleLight: '#C5C3FF',
  muted: '#888',
};

// Define both light and dark theme variants
const lightTheme = {
  ...baseColors,
  mode: 'light',
  background: '#FFFFFF',
  card: '#F7F7FF',
  text: '#222222',
  border: '#C5C3FF',
  inputBg: '#FFFFFF',
  placeholder: '#555555',
};

const darkTheme = {
  ...baseColors,
  mode: 'dark',
  background: '#121212',
  card: '#1E1E2E',
  text: '#F5F5F5',
  border: '#333333',
  inputBg: '#1C1C1C',
  placeholder: '#AAAAAA',
};

// ✅ Function to dynamically select based on system preference
export const useThemeColors = () => {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkTheme : lightTheme;
};

// ✅ Default export (fallback to light)
export default lightTheme;
