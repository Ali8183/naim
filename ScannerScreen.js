import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  StatusBar, 
  TouchableOpacity, 
  Animated,
  ActivityIndicator
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

const ScannerScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sayfa açıldığında otomatik izin iste
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, []);

  useEffect(() => {
    // Tarama çizgisi animasyonu
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 240, // Viewfinder yüksekliği kadar
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

  if (!permission) {
    // İzin yüklenirken loading göster
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#39FF14" />
      </View>
    );
  }

  if (!permission.granted) {
    // İzin verilmediyse mesaj göster
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
      
      {/* Gerçek Kamera Görünümü */}
      <CameraView style={styles.camera} facing="back">
        
        {/* Neon Tasarım Overlay */}
        <View style={styles.overlay}>
          
          <View style={styles.topOverlay} />
          
          <View style={styles.middleRow}>
            <View style={styles.sideOverlay} />
            
            {/* Vizör (Viewfinder) */}
            <View style={styles.viewfinder}>
              {/* Köşe Çizgileri (Neon Green) */}
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {/* Hareketli Tarama Çizgisi */}
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
            <Text style={styles.instruction}>Yemeğini vizöre hizala</Text>
            
            {/* Deklanşör Butonu */}
            <TouchableOpacity style={styles.shutterContainer} activeOpacity={0.7}>
              <View style={styles.shutterOuter}>
                <View style={styles.shutterInner} />
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </CameraView>
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
    height: 250, // Viewfinder yüksekliği
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
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
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
    letterSpacing: 0.5,
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
  errorText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#39FF14',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 20,
  },
  retryText: {
    color: '#0d6100',
    fontWeight: 'bold',
  },
});

export default ScannerScreen;
