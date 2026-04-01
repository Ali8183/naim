import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import OnboardingScreen from './OnboardingScreen';
import ProfileScreen from './ProfileScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Onboarding');

  return (
    <View style={styles.container}>
      {currentScreen === 'Onboarding' ? (
        <OnboardingScreen onGetStarted={() => setCurrentScreen('Profile')} />
      ) : (
        <ProfileScreen />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e', // Tüm ekranlarda siyah tema bütünlüğü
  },
});
