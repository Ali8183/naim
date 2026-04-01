import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  Animated,
  ActivityIndicator,
  Modal
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResult, setShowResult] = useState(false);
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

  const handleCapture = () => {
    setIsAnalyzing(true);
    // 2 saniyelik AI analiz simülasyonu
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2000);
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
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0e0e0e" />
      
      <CameraView style={styles.camera} facing="back">
        <View style={styles.overlay}>
          
          <View style={styles.topOverlay} />
          
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
              <>
                <Text style={styles.instruction}>Yemeğini vizöre hizala</Text>
                <TouchableOpacity 
                  style={styles.shutterContainer} 
                  activeOpacity={0.7}
                  onPress={handleCapture}
                >
                  <View style={styles.shutterOuter}>
                    <View style={styles.shutterInner} />
                  </View>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.analysisContainer}>
                <ActivityIndicator size="large" color="#39FF14" />
                <Text style={styles.analysisText}>Yapay Zeka Analiz Ediyor...</Text>
              </View>
            )}
          </View>

        </View>
      </CameraView>

      {/* AI Sonuç Modalı (Bottom Sheet) */}
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
            
            <View style={styles.resultRow}>
              <Text style={styles.label}>Tespit Edilen:</Text>
              <Text style={styles.value}>Su Şişesi</Text>
            </View>

            <View style={styles.resultRow}>
              <Text style={styles.label}>Besin Değeri:</Text>
              <Text style={styles.value}>0 kcal / 0g Protein</Text>
            </View>

            <View style={styles.aiTavsiyesiBox}>
              <Text style={styles.aiTavsiyesiLabel}>AI Tavsiyesi</Text>
              <Text style={styles.aiTavsiyesiText}>
                Antrenman sırasında hidrasyon seviyeni korumak için mükemmel seçim. 
                Kas gelişimi için su tüketimi kritik önem taşır!
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={() => setShowResult(false)}
            >
              <Text style={styles.closeButtonText}>TAMAM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
    padding: 20,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 250,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    paddingTop: 30,
  },
  viewfinder: {
    width: 250,
    height: 250,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#39FF14',
    borderWidth: 4,
  },
  topLeft: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  topRight: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  bottomLeft: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  bottomRight: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },
  scanLine: {
    height: 2,
    backgroundColor: 'rgba(57, 255, 20, 0.8)',
    width: '100%',
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 10,
  },
  instruction: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 40,
    fontWeight: '600',
    opacity: 0.8,
  },
  shutterContainer: {
    position: 'absolute',
    bottom: 60,
  },
  shutterOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#39FF14',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(57, 255, 20, 0.1)',
  },
  shutterInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ffffff',
  },
  analysisContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  analysisText: {
    color: '#39FF14',
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1919',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(57, 255, 20, 0.2)',
  },
  modalHeaderLine: {
    width: 40,
    height: 4,
    backgroundColor: '#484847',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 24,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#262626',
    paddingBottom: 12,
  },
  label: {
    color: '#adaaaa',
    fontSize: 15,
  },
  value: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aiTavsiyesiBox: {
    backgroundColor: 'rgba(57, 255, 20, 0.05)',
    padding: 20,
    borderRadius: 16,
    marginVertical: 20,
    borderLeftWidth: 3,
    borderLeftColor: '#39FF14',
  },
  aiTavsiyesiLabel: {
    color: '#39FF14',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  aiTavsiyesiText: {
    color: '#adaaaa',
    fontSize: 14,
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#39FF14',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#39FF14',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  closeButtonText: {
    color: '#0d6100',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  errorText: { color: '#ffffff', fontSize: 16, marginBottom: 20 },
  retryButton: { backgroundColor: '#39FF14', padding: 15, borderRadius: 20 },
  retryText: { color: '#0d6100', fontWeight: 'bold' },
});

export default ScannerScreen;
