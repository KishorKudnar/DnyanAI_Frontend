import React from 'react';
import { SafeAreaView, StatusBar, View } from 'react-native';
import colors from '../theme/colors';

export default function ScreenContainer({ children }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={{ flex: 1, padding: 16 }}>{children}</View>
    </SafeAreaView>
  );
}
