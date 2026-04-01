import React from 'react';
import { StyleSheet, View } from 'react-native';
import OnboardingScreen from './OnboardingScreen';

export default function App() {
  return (
    <View style={styles.container}>
      {/* Uygulama açıldığında ilk olarak OnboardingScreen gösterilecek */}
      <OnboardingScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e', // Tüm ekranlarda siyah tema bütünlüğü
  },
});
