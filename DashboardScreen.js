import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Svg, Circle } from 'react-native-svg';

const { width } = Dimensions.get('window');

const DashboardScreen = ({ onStartScan }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@user_profile');
        if (savedData) {
          setProfile(JSON.parse(savedData));
        }
      } catch (e) {
        console.error('Veri çekme hatası:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#39FF14" />
      </View>
    );
  }

  const targetCalories = profile?.requirements?.calories || 2500;
  const targetProtein = profile?.requirements?.protein || 150;
  
  // Örnek günlük veriler (şimdilik statik, ileride dinamik olabilir)
  const consumedCalories = 1250; 
  const progress = consumedCalories / targetCalories;
  
  const size = 200;
  const strokeWidth = 15;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress * circumference);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e0e0e" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Merhaba,</Text>
          <Text style={styles.title}>Günlük Durum</Text>
        </View>

        {/* Circular Progress (Calorie) */}
        <View style={styles.progressSection}>
          <Svg width={size} height={size}>
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#1E1E1E"
              strokeWidth={strokeWidth}
              fill="none"
            />
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="#39FF14"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="none"
              transform={`rotate(-90, ${size / 2}, ${size / 2})`}
            />
          </Svg>
          <View style={styles.progressTextContainer}>
            <Text style={styles.progressValue}>{consumedCalories}</Text>
            <Text style={styles.progressLabel}>/ {targetCalories} kcal</Text>
          </View>
        </View>

        {/* Macros */}
        <View style={styles.macrosSection}>
          <MacroBar label="Protein" current={85} target={targetProtein} unit="g" color="#39FF14" />
          <MacroBar label="Karbonhidrat" current={120} target={250} unit="g" color="#39FF14" opacity={0.6} />
          <MacroBar label="Yağ" current={45} target={80} unit="g" color="#39FF14" opacity={0.3} />
        </View>

        {/* CTA Button */}
        <TouchableOpacity 
          style={styles.scanButton} 
          activeOpacity={0.8}
          onPress={onStartScan}
        >
          <Text style={styles.scanButtonText}>YENİ TARAMA BAŞLAT</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const MacroBar = ({ label, current, target, unit, color, opacity = 1 }) => {
  const barWidth = (current / target) * 100;
  return (
    <View style={styles.macroRow}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>{current}{unit} / {target}{unit}</Text>
      </View>
      <View style={styles.macroBarBg}>
        <View style={[styles.macroBarFill, { width: `${Math.min(barWidth, 100)}%`, backgroundColor: color, opacity }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
  },
  greeting: {
    fontSize: 16,
    color: '#adaaaa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 4,
  },
  progressSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  progressTextContainer: {
    position: 'absolute',
    alignItems: 'center',
  },
  progressValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  progressLabel: {
    fontSize: 14,
    color: '#adaaaa',
    marginTop: 4,
  },
  macrosSection: {
    marginBottom: 60,
  },
  macroRow: {
    marginBottom: 24,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  macroLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
  macroValue: {
    color: '#adaaaa',
    fontSize: 13,
  },
  macroBarBg: {
    height: 8,
    backgroundColor: '#1E1E1E',
    borderRadius: 4,
    overflow: 'hidden',
  },
  macroBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scanButton: {
    backgroundColor: '#39FF14',
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  scanButtonText: {
    color: '#0d6100',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});

export default DashboardScreen;
