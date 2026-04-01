import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import OnboardingScreen from './OnboardingScreen';
import ProfileScreen from './ProfileScreen';
import DashboardScreen from './DashboardScreen';
import ScannerScreen from './ScannerScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Onboarding');

  return (
    <View style={styles.container}>
      {currentScreen === 'Onboarding' && (
        <OnboardingScreen onGetStarted={() => setCurrentScreen('Profile')} />
      )}
      {currentScreen === 'Profile' && (
        <ProfileScreen onCreateProfile={() => setCurrentScreen('Dashboard')} />
      )}
      {currentScreen === 'Dashboard' && (
        <DashboardScreen onStartScan={() => setCurrentScreen('Scanner')} />
      )}
      {currentScreen === 'Scanner' && (
        <ScannerScreen />
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
