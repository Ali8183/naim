import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  StatusBar, 
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GOALS = [
  { id: 'lose_weight', title: 'Kilo Ver', icon: '🔥' },
  { id: 'build_muscle', title: 'Kas Yap', icon: '💪' },
  { id: 'keep_fit', title: 'Formda Kal', icon: '⚡' },
];

const ProfileScreen = ({ onCreateProfile }) => {
  const [selectedGoal, setSelectedGoal] = useState('build_muscle');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(true);

  // Verileri AsyncStorage'dan yükle
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('@user_profile');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setSelectedGoal(parsed.goal || 'build_muscle');
          setHeight(parsed.height || '');
          setWeight(parsed.weight || '');
        }
      } catch (e) {
        console.error('Veri yükleme hatası:', e);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  // Dinamik Hesaplama
  const calculateRequirements = () => {
    const w = parseFloat(weight);
    if (!w || isNaN(w)) return { calories: 0, protein: 0 };

    let calories = 0;
    let protein = 0;

    switch (selectedGoal) {
      case 'build_muscle':
        calories = w * 35;
        protein = w * 2.2;
        break;
      case 'lose_weight':
        calories = w * 22;
        protein = w * 1.8;
        break;
      case 'keep_fit':
        calories = w * 30;
        protein = w * 1.6;
        break;
      default:
        break;
    }

    return { 
      calories: Math.round(calories), 
      protein: protein.toFixed(1) 
    };
  };

  const requirements = calculateRequirements();

  // Verileri kaydet ve devam et
  const handleSaveAndContinue = async () => {
    try {
      const profileData = {
        goal: selectedGoal,
        height,
        weight,
        requirements
      };
      await AsyncStorage.setItem('@user_profile', JSON.stringify(profileData));
      onCreateProfile(); // ScannerScreen'e geçiş yap
    } catch (e) {
      console.error('Veri kaydetme hatası:', e);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#39FF14" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e0e0e" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.header}>
            <Text style={styles.title}>Seni Tanıyalım</Text>
            <Text style={styles.subtitle}>Hedefini seç ve profilini tamamla.</Text>
          </View>

          <Text style={styles.sectionTitle}>Hedefin Ne?</Text>
          <View style={styles.goalsContainer}>
            {GOALS.map((goal) => {
              const isActive = selectedGoal === goal.id;
              return (
                <TouchableOpacity 
                  key={goal.id}
                  style={[styles.goalCard, isActive && styles.goalCardActive]}
                  activeOpacity={0.8}
                  onPress={() => setSelectedGoal(goal.id)}
                >
                  <Text style={styles.goalIcon}>{goal.icon}</Text>
                  <Text style={[styles.goalTitle, isActive && styles.goalTitleActive]}>
                    {goal.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
          <View style={styles.inputsContainer}>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Boy (cm)</Text>
              <TextInput 
                style={styles.input}
                placeholder="180"
                placeholderTextColor="#484847"
                keyboardType="numeric"
                value={height}
                onChangeText={setHeight}
              />
            </View>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Kilo (kg)</Text>
              <TextInput 
                style={styles.input}
                placeholder="75"
                placeholderTextColor="#484847"
                keyboardType="numeric"
                value={weight}
                onChangeText={setWeight}
              />
            </View>
          </View>

          {/* Dinamik AI Önerisi */}
          <View style={styles.aiCard}>
            <Text style={styles.aiTitle}>✨ AI Önerisi</Text>
            <Text style={styles.aiBody}>
              {weight ? (
                <>
                  Hedefin için günlük <Text style={styles.highlightText}>{requirements.calories} kcal</Text> ve 
                  yaklaşık <Text style={styles.highlightText}>{requirements.protein}g protein</Text> almanı öneriyorum. 
                  Bu değerler siber-motorun için yakıt olacak.
                </>
              ) : (
                "Verilerini girdiğinde sana özel kalori ve protein ihtiyacını anlık olarak hesaplayacağım."
              )}
            </Text>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.button} 
            activeOpacity={0.8} 
            onPress={handleSaveAndContinue}
          >
            <Text style={styles.buttonText}>PROFİLİ OLUŞTUR</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
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
    paddingBottom: 20,
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 8,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#adaaaa',
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  goalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  goalCard: {
    flex: 1,
    backgroundColor: '#1a1919',
    paddingVertical: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  goalCardActive: {
    backgroundColor: '#201f1f',
    borderColor: '#39FF14',
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 10,
  },
  goalIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  goalTitle: {
    color: '#adaaaa',
    fontSize: 14,
    fontWeight: '500',
  },
  goalTitleActive: {
    color: '#39FF14',
    fontWeight: '700',
  },
  inputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  inputWrapper: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: '#131313',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputLabel: {
    fontSize: 12,
    color: '#adaaaa',
    marginBottom: 4,
  },
  input: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    padding: 0,
  },
  aiCard: {
    backgroundColor: 'rgba(38, 38, 38, 0.6)', 
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.2)',
    marginBottom: 40,
  },
  aiTitle: {
    color: '#39FF14',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  aiBody: {
    color: '#adaaaa',
    fontSize: 14,
    lineHeight: 22,
  },
  highlightText: {
    color: '#39FF14',
    fontWeight: 'bold',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 10,
  },
  button: {
    backgroundColor: '#39FF14',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 24, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: '#0d6100',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});

export default ProfileScreen;
