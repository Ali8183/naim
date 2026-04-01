import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

const OnboardingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e0e0e" />
      <View style={styles.content}>
        
        {/* Üst Kısım: Başlık ve Alt Başlık */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Geleceğin Antrenmanına Hoş Geldin</Text>
          <Text style={styles.subtitle}>Yemeğini tara, setlerini yapay zeka saysın.</Text>
        </View>

        {/* Alt Kısım: Butonlar */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Text style={styles.buttonText}>HEMEN BAŞLA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.loginLink} activeOpacity={0.6}>
            <Text style={styles.loginText}>
              Zaten üye misin? <Text style={styles.loginTextBold}>Giriş Yap</Text>
            </Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e', // Siyah arka plan
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  textContainer: {
    flex: 0.8,
    justifyContent: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 16,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#adaaaa',
    lineHeight: 28,
  },
  footer: {
    width: '100%',
  },
  button: {
    backgroundColor: '#39FF14', // Neon Yeşil 
    width: '100%',
    paddingVertical: 18,
    borderRadius: 24, 
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: '#0d6100', // Koyu yeşil metin (kontrast için)
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  loginText: {
    color: '#ffffff',
    fontSize: 15,
  },
  loginTextBold: {
    color: '#39FF14',
    fontWeight: 'bold',
  }
});

export default OnboardingScreen;
