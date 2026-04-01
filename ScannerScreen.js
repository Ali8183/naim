import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  StatusBar, 
  TouchableOpacity, 
  Animated, 
  ActivityIndicator, 
  Modal,
  Alert,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { GoogleGenerativeAI } from "@google/generative-ai";

const { height: windowHeight, width: windowWidth } = Dimensions.get('window');

// === GEMINI YAPILANDIRMASI ===
// API anahtarı .env dosyasından okunur, GitHub'a gönderilmez!
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
// gemini-2.0-flash: görüntü destekli, hızlı ve ücretsiz plan için uygun
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [anaLyzedData, setAnalyzedData] = useState(null);
  
  const cameraRef = useRef(null);
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 240,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanAnim]);

  const handleCapture = async () => {
    if (!cameraRef.current || isAnalyzing) return;

    try {
      setIsAnalyzing(true);
      const photo = await cameraRef.current.takePictureAsync({
        base64: true,
        quality: 0.5,
      });

      const prompt = "Bu fotoğraftaki yiyecek veya fitness ekipmanı nedir? Lütfen sadece şu JSON formatında cevap ver ve başka hiçbir metin ekleme: {\"isim\": \"nesne adı\", \"kalori\": 100, \"protein\": 10, \"tavsiye\": \"kısa fitness tavsiyesi\"}";
      
      const imagePart = {
        inlineData: {
          data: photo.base64,
          mimeType: "image/jpeg",
        },
      };

      const result = await model.generateContent([prompt, imagePart]);
      const responseText = result.response.text();
      
      const cleanJson = responseText.replace(/```json|```/g, '').trim();
      const parsedData = JSON.parse(cleanJson);

      setAnalyzedData(parsedData);
      setShowResult(true);
    } catch (error) {
      console.error("AI Analiz Hatası:", error);
      Alert.alert("Hata", "Analiz sırasında bir sorun oluştu. Gemini 1.5 Flash modeli bu bölgede veya API versiyonunda kısıtlı olabilir.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!permission) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#39FF14" />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>Kamera izni verilmedi.</Text>
        <TouchableOpacity style={styles.retryButton} onPress={requestPermission}>
          <Text style={styles.retryText}>İZİN VER</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e0e0e" />
      
      {/* Kamera tam ekran arka planda */}
      <CameraView 
        style={StyleSheet.absoluteFill} 
        facing="back" 
        ref={cameraRef}
      />

      {/* Overlay: Kamera üzerinde absolute position ile durmalı */}
      <SafeAreaView style={styles.overlay} edges={['top', 'bottom']}>
        <View style={styles.screenWrapper}>
          
          <View style={styles.topEmpty} />

          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            <View style={styles.viewfinder}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <Animated.View 
                style={[
                  styles.scanLine, 
                  { transform: [{ translateY: scanAnim }] }
                ]} 
              />
            </View>
            <View style={styles.sideOverlay} />
          </View>
          
          <View style={styles.bottomOverlay}>
            {!isAnalyzing ? (
              <View style={styles.shutterBox}>
                <Text style={styles.instruction}>Nesneyi vizöre hizala</Text>
                <TouchableOpacity 
                  style={styles.shutterBtn} 
                  activeOpacity={0.7}
                  onPress={handleCapture}
                >
                  <View style={styles.shutterOuter}>
                    <View style={styles.shutterInner} />
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.analysisContainer}>
                <ActivityIndicator size="large" color="#39FF14" />
                <Text style={styles.analysisText}>Yapay Zeka Analiz Ediyor...</Text>
              </View>
            )}
          </View>

        </View>
      </SafeAreaView>

      {/* Result Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showResult}
        onRequestClose={() => setShowResult(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderLine} />
            <Text style={styles.resultTitle}>✨ Analiz Sonucu</Text>
            <View style={styles.resultRow}><Text style={styles.label}>Tespit Edilen:</Text><Text style={styles.value}>{anaLyzedData?.isim}</Text></View>
            <View style={styles.resultRow}><Text style={styles.label}>Besin Değeri:</Text><Text style={styles.value}>{anaLyzedData?.kalori} kcal / {anaLyzedData?.protein}g P</Text></View>
            <View style={styles.aiTavsiyesiBox}>
              <Text style={styles.aiTavsiyesiLabel}>AI Tavsiyesi</Text>
              <Text style={styles.aiTavsiyesiText}>{anaLyzedData?.tavsiye}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={() => setShowResult(false)}>
              <Text style={styles.closeButtonText}>KAPAT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  screenWrapper: {
    flex: 1,
  },
  topEmpty: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 250,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  viewfinder: {
    width: 250,
    height: 250,
    backgroundColor: 'transparent',
  },
  bottomOverlay: {
    flex: 2,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#39FF14',
    borderWidth: 3,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanLine: {
    height: 2,
    backgroundColor: '#39FF14',
    width: '100%',
    shadowColor: '#39FF14',
    shadowOpacity: 0.8,
    shadowRadius: 5,
  },
  shutterBox: {
    alignItems: 'center',
  },
  instruction: {
    color: '#fff',
    marginBottom: 20,
    fontSize: 14,
    opacity: 0.8,
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#39FF14',
    padding: 4,
  },
  shutterInner: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 40,
  },
  analysisContainer: {
    alignItems: 'center',
  },
  analysisText: {
    color: '#39FF14',
    marginTop: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1919',
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.2)',
  },
  modalHeaderLine: {
    width: 40,
    height: 4,
    backgroundColor: '#333',
    alignSelf: 'center',
    borderRadius: 2,
    marginBottom: 20,
  },
  resultTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: '#888' },
  value: { color: '#fff', fontWeight: 'bold' },
  aiTavsiyesiBox: {
    backgroundColor: 'rgba(57, 255, 20, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
    borderLeftWidth: 2,
    borderLeftColor: '#39FF14',
  },
  aiTavsiyesiLabel: { color: '#39FF14', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  aiTavsiyesiText: { color: '#ccc', fontSize: 13 },
  closeButton: {
    backgroundColor: '#39FF14',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
  },
  closeButtonText: { color: '#000', fontWeight: 'bold' },
  errorText: { color: '#fff', marginBottom: 20 },
  retryButton: { backgroundColor: '#39FF14', padding: 15, borderRadius: 15 },
  retryText: { fontWeight: 'bold' }
});

export default ScannerScreen;
