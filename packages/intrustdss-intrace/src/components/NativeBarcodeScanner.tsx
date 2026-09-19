import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  TextInput,
  Alert,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface NativeBarcodeScannerProps {
  visible: boolean;
  title?: string;
  instruction?: string;
  onScanSuccess: (data: string) => void;
  onClose: () => void;
}

export const NativeBarcodeScanner: React.FC<NativeBarcodeScannerProps> = ({
  visible,
  title = 'Quét mã vạch / QR',
  instruction,
  onScanSuccess,
  onClose,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(0);
  const [cameraLayout, setCameraLayout] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [hasScanned, setHasScanned] = useState<boolean>(false);
  const [manualCode, setManualCode] = useState<string>('');
  const insets = useSafeAreaInsets();
  const candidateLockRef = useRef<{ code: string; firstSeen: number } | null>(null);

  if (!visible) return null;

  const handleBarcodeScanned = (result: any) => {
    if (hasScanned) return;

    const viewWidth = cameraLayout.width > 0 ? cameraLayout.width : SCREEN_WIDTH;
    const viewHeight = cameraLayout.height > 0 ? cameraLayout.height : SCREEN_HEIGHT;
    const margin = 20; // Khoảng đệm an toàn từ mép màn hình

    const rawBounds = result.bounds || result.boundingBox;
    const cornerPoints = result.cornerPoints || result.corners;

    // 1. Kiểm tra 4 góc của mã QR nếu có
    if (Array.isArray(cornerPoints) && cornerPoints.length === 4) {
      let pts = cornerPoints;
      // Chuẩn hóa nếu tọa độ ở dạng 0..1
      if (pts[0].x <= 1 && pts[1].x <= 1) {
        pts = pts.map((p: any) => ({ x: p.x * viewWidth, y: p.y * viewHeight }));
      } else {
        const maxPtX = Math.max(...pts.map((p: any) => p.x));
        const maxPtY = Math.max(...pts.map((p: any) => p.y));
        if (maxPtX > viewWidth * 1.15 || maxPtY > viewHeight * 1.15) {
          const scaleX = viewWidth / (maxPtX > 1400 ? 1920 : 1080);
          const scaleY = viewHeight / (maxPtY > 1800 ? 2400 : 1920);
          pts = pts.map((p: any) => ({ x: p.x * scaleX, y: p.y * scaleY }));
        }
      }

      // Toàn bộ 4 góc phải nằm trong khung hình an toàn
      const isAllCornersInside = pts.every(
        (p: any) =>
          p.x >= margin &&
          p.x <= viewWidth - margin &&
          p.y >= margin &&
          p.y <= viewHeight - margin
      );

      if (!isAllCornersInside) {
        candidateLockRef.current = null;
        return; // Bỏ qua nếu có góc bị thò ra ngoài mép
      }
    }

    // 2. Kiểm tra hộp bao quanh mã QR (bounds)
    if (rawBounds) {
      const origin = rawBounds.origin || { x: rawBounds.x ?? 0, y: rawBounds.y ?? 0 };
      const size = rawBounds.size || { width: rawBounds.width ?? 0, height: rawBounds.height ?? 0 };
      let ox = origin.x;
      let oy = origin.y;
      let ow = size.width;
      let oh = size.height;

      // Xử lý tọa độ chuẩn hóa 0..1
      if (ox <= 1 && ow <= 1 && (ox > 0 || ow > 0)) {
        ox *= viewWidth;
        ow *= viewWidth;
        oy *= viewHeight;
        oh *= viewHeight;
      } else if (ox + ow > viewWidth * 1.15 || oy + oh > viewHeight * 1.15) {
        const scaleX = viewWidth / (ox + ow > 1400 ? 1920 : 1080);
        const scaleY = viewHeight / (oy + oh > 1800 ? 2400 : 1920);
        ox *= scaleX;
        oy *= scaleY;
        ow *= scaleX;
        oh *= scaleY;
      }

      // Toàn bộ 4 cạnh phải nằm trọn vẹn bên trong khung hình
      const isInsideLeft = ox >= margin;
      const isInsideTop = oy >= margin;
      const isInsideRight = ox + ow <= viewWidth - margin;
      const isInsideBottom = oy + oh <= viewHeight - margin;

      if (!isInsideLeft || !isInsideTop || !isInsideRight || !isInsideBottom) {
        candidateLockRef.current = null;
        return; // Bỏ qua nếu còn cạnh bị cắt ngoài mép
      }
    }

    // 3. Khóa chống quét vội (Stability Lock):
    // Yêu cầu camera phải giữ mã QR ổn định trong khung hình ít nhất 300ms
    const now = Date.now();
    const candidate = candidateLockRef.current;

    if (!candidate || candidate.code !== result.data) {
      // Lần đầu nhìn thấy mã này -> lưu lại thời điểm
      candidateLockRef.current = { code: result.data, firstSeen: now };
      return;
    }

    // Nếu chưa đủ 300ms trong tầm nhìn -> tiếp tục chờ
    if (now - candidate.firstSeen < 300) {
      return;
    }

    // Đã thỏa mãn: Mã hoàn toàn nằm trong khung hình và ổn định đủ 300ms
    setHasScanned(true);
    candidateLockRef.current = null;
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
      <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
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
        <View
          style={styles.cameraContainer}
          onLayout={(e) => setCameraLayout(e.nativeEvent.layout)}
        >
          {!permission?.granted ? (
            <View style={styles.permissionBox}>
              <Text style={styles.permissionText}>Cần cấp quyền truy cập Camera để quét mã vạch</Text>
              <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
                <Text style={styles.permissionBtnText}>Cho phép mở Camera</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CameraView
              style={StyleSheet.absoluteFill}
              facing="back"
              enableTorch={torch}
              zoom={zoom}
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

          {/* Khung ngắm và hướng dẫn */}
          <View style={styles.overlay} pointerEvents="box-none">
            <View style={styles.scanTarget}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <View style={styles.laserLine} />
            </View>

            <Text style={styles.hintText}>
              Đưa mã Barcode / QR vào khung hình để quét tự động
            </Text>

            {/* Thanh điều khiển Zoom Camera */}
            <View style={styles.zoomBar}>
              <TouchableOpacity
                style={styles.zoomStepBtn}
                onPress={() => setZoom((z) => Math.max(0, +(z - 0.1).toFixed(2)))}
                activeOpacity={0.7}
              >
                <Text style={styles.zoomStepText}>−</Text>
              </TouchableOpacity>

              {[
                { label: '1x', val: 0 },
                { label: '2x', val: 0.2 },
                { label: '3x', val: 0.4 },
                { label: '5x', val: 0.7 },
              ].map((preset) => {
                const isActive = Math.abs(zoom - preset.val) < 0.05;
                return (
                  <TouchableOpacity
                    key={preset.label}
                    style={[styles.zoomPresetBtn, isActive && styles.zoomPresetBtnActive]}
                    onPress={() => setZoom(preset.val)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.zoomPresetText, isActive && styles.zoomPresetTextActive]}>
                      {preset.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={styles.zoomStepBtn}
                onPress={() => setZoom((z) => Math.min(1, +(z + 0.1).toFixed(2)))}
                activeOpacity={0.7}
              >
                <Text style={styles.zoomStepText}>+</Text>
              </TouchableOpacity>
            </View>
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
      </View>
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
    ...StyleSheet.absoluteFill,
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
  zoomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 24,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  zoomStepBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 3,
  },
  zoomStepText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    lineHeight: 20,
  },
  zoomPresetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginHorizontal: 3,
  },
  zoomPresetBtnActive: {
    backgroundColor: '#0284C7',
  },
  zoomPresetText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '700',
  },
  zoomPresetTextActive: {
    color: '#FFFFFF',
  },
});
