import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

interface NativeBarcodeScannerProps {
  visible: boolean;
  title?: string;
  onScanSuccess: (data: string) => void;
  onClose: () => void;
}

export const NativeBarcodeScanner: React.FC<NativeBarcodeScannerProps> = ({
  visible,
  title = 'Quét mã vạch / QR',
  onScanSuccess,
  onClose,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<boolean>(false);
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [manualCode, setManualCode] = useState<string>('');

  if (!visible) return null;

  const handleBarcodeScanned = (result: { type: string; data: string }) => {
    if (hasScanned) return;
    setHasScanned(true);
    onScanSuccess(result.data);
    onClose();
    setTimeout(() => setHasScanned(false), 800);
  };

  const handleManualSubmit = () => {
    if (!manualCode.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mã hợp lệ');
      return;
    }
    onScanSuccess(manualCode.trim());
    setManualCode('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header điều khiển */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>Đóng</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <TouchableOpacity onPress={() => setTorch((prev) => !prev)} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>{torch ? '🔦 Tắt' : '💡 Bật Flash'}</Text>
          </TouchableOpacity>
        </View>

        {/* Khung Camera Native */}
        <View style={styles.cameraContainer}>
          {!permission?.granted ? (
            <View style={styles.permissionBox}>
              <Text style={styles.permissionText}>Cần cấp quyền truy cập Camera để quét mã vạch</Text>
              <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                <Text style={styles.permissionBtnText}>Cho phép mở Camera</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CameraView
              style={StyleSheet.absoluteFillObject}
              facing="back"
              enableTorch={torch}
              barcodeScannerSettings={{
                barcodeTypes: [
                  'qr',
                  'code128',
                  'code39',
                  'ean13',
                  'ean8',
                  'upc_a',
                  'upc_e',
                  'datamatrix',
                ],
              }}
              onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
            />
          )}

          {/* Khung ngắm chuẩn Scanner */}
          <View style={styles.overlay}>
            <View style={styles.scanTarget}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <View style={styles.laserLine} />
            </View>
            <Text style={styles.hintText}>
              Căn chỉnh mã Barcode / QR vào chính giữa khung ngắm để quét tự động
            </Text>
          </View>
        </View>

        {/* Khung nhập mã tay (Dự phòng cho máy ảo hoặc khi mã bị mờ rách) */}
        <View style={styles.manualContainer}>
          <Text style={styles.manualLabel}>Hoặc nhập mã trực tiếp bằng tay:</Text>
          <View style={styles.manualInputRow}>
            <TextInput
              style={styles.input}
              placeholder="VD: THUNG-2026-8801 hoặc TCKU9821"
              value={manualCode}
              onChangeText={setManualCode}
              autoCapitalize="characters"
              placeholderTextColor="#94A3B8"
            />
            <TouchableOpacity style={styles.applyBtn} onPress={handleManualSubmit}>
              <Text style={styles.applyBtnText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerBtn: {
    padding: 8,
  },
  headerBtnText: {
    fontSize: 14,
    color: '#38BDF8',
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTarget: {
    width: 260,
    height: 260,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#0284C7',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  laserLine: {
    width: '90%',
    height: 2,
    backgroundColor: '#38BDF8',
    opacity: 0.8,
  },
  hintText: {
    marginTop: 24,
    color: '#CBD5E1',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  permissionBox: {
    padding: 24,
    alignItems: 'center',
  },
  permissionText: {
    color: '#CBD5E1',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  permissionBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  permissionBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  manualContainer: {
    padding: 16,
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  manualLabel: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 8,
  },
  manualInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#0F172A',
    color: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  applyBtn: {
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  applyBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
