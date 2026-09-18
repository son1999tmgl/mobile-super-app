import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { InTraceStackParamList } from '../navigation/types';
import { InTraceStorageService } from '../services/intraceStorage';
import { NativeBarcodeScanner } from '../components/NativeBarcodeScanner';

type RouteProps = RouteProp<InTraceStackParamList, 'ContainerForm'>;
type NavigationProps = StackNavigationProp<InTraceStackParamList, 'ContainerForm'>;

interface Props {
  route: RouteProps;
  navigation: NavigationProps;
}

export const ContainerFormScreen: React.FC<Props> = ({ navigation }) => {
  const [containerCode, setContainerCode] = useState<string>(
    `TCKU-${Math.floor(100000 + Math.random() * 900000)}-${Math.floor(1 + Math.random() * 9)}`
  );
  const [sealNumber, setSealNumber] = useState<string>(
    `SEAL-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [boxCodes, setBoxCodes] = useState<string[]>([]);
  const [manualBoxInput, setManualBoxInput] = useState<string>('');
  const [scannerVisible, setScannerVisible] = useState<boolean>(false);
  const [scanTarget, setScanTarget] = useState<'container' | 'box'>('container');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Đóng Hàng Lên Container (inTrace)',
    });
  }, [navigation]);

  const handleOpenScanner = (target: 'container' | 'box') => {
    setScanTarget(target);
    setScannerVisible(true);
  };

  const handleScanResult = (scannedValue: string) => {
    const val = scannedValue.trim();
    if (!val) return;

    if (scanTarget === 'container') {
      setContainerCode(val);
      Alert.alert('Đã quét Mã Công', `Mã Container: ${val}`);
    } else {
      // Quét mã thùng xếp vào công
      if (boxCodes.includes(val)) {
        Alert.alert('Cảnh báo trùng', `Thùng "${val}" đã được quét vào Container này rồi.`);
      } else {
        setBoxCodes((prev) => [val, ...prev]);
      }
    }
  };

  const handleAddManualBox = () => {
    const val = manualBoxInput.trim();
    if (!val) return;
    if (boxCodes.includes(val)) {
      Alert.alert('Cảnh báo trùng', 'Mã thùng này đã được thêm trước đó.');
      return;
    }
    setBoxCodes((prev) => [val, ...prev]);
    setManualBoxInput('');
  };

  const handleRemoveBox = (index: number) => {
    setBoxCodes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!containerCode.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập hoặc quét Mã Container.');
      return;
    }

    try {
      setSaving(true);
      await InTraceStorageService.createContainer({
        containerCode: containerCode.trim(),
        sealNumber: sealNumber.trim(),
        destination: 'Xuất khẩu / Nội địa',
        status: 'loading',
        maxCartons: 800,
        json_boxes: boxCodes.map((code) => ({ code })),
      });

      Alert.alert(
        'Thành công',
        `Đã lưu Container "${containerCode}" với ${boxCodes.length} thùng hàng lên hệ thống inTrace.`,
        [{ text: 'Đồng ý', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể lưu Container. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Bước 1: Mã Container & Seal */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionStep}>BƯỚC 1: MÃ CONTAINER & SỐ SEAL</Text>
          <Text style={styles.sectionDesc}>Quét mã số hiệu trên cửa container hoặc nhập:</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="VD: TCKU-123456-7"
              placeholderTextColor="#94A3B8"
              value={containerCode}
              onChangeText={setContainerCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.scanBtnInline}
              onPress={() => handleOpenScanner('container')}
              activeOpacity={0.8}
            >
              <Text style={styles.scanBtnText}>📷 Quét mã</Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.smallLabel}>Số chì niêm phong (Seal):</Text>
            <TextInput
              style={[styles.input, { marginTop: 4 }]}
              placeholder="VD: SEAL-2026-9999"
              placeholderTextColor="#94A3B8"
              value={sealNumber}
              onChangeText={setSealNumber}
            />
          </View>
        </View>

        {/* Bước 2: Quét Mã Thùng Xếp Lên Container */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionStep}>BƯỚC 2: QUÉT THÙNG HÀNG LÊN CONTAINER</Text>
              <Text style={styles.sectionDesc}>Đưa camera quét mã vạch từng thùng khi bốc xếp</Text>
            </View>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{boxCodes.length} Thùng</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.scanMainBtn}
            onPress={() => handleOpenScanner('box')}
            activeOpacity={0.8}
          >
            <Text style={styles.scanMainBtnIcon}>📷</Text>
            <View>
              <Text style={styles.scanMainBtnTitle}>Bật Camera Quét Mã Thùng</Text>
              <Text style={styles.scanMainBtnSub}>Quét liên tục từng thùng xếp vào công</Text>
            </View>
          </TouchableOpacity>

          {/* Ô nhập tay dự phòng */}
          <View style={[styles.inputRow, { marginTop: 12 }]}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Nhập thủ công mã thùng nếu mờ..."
              placeholderTextColor="#94A3B8"
              value={manualBoxInput}
              onChangeText={setManualBoxInput}
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleAddManualBox}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+ Thêm</Text>
            </TouchableOpacity>
          </View>

          {/* Danh sách thùng đã xếp trong công */}
          <Text style={styles.listHeading}>
            Danh sách thùng đã đưa vào công ({boxCodes.length}):
          </Text>

          {boxCodes.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>Chưa có thùng nào. Bấm "Quét Mã Thùng" để thêm.</Text>
            </View>
          ) : (
            <View style={styles.tagList}>
              {boxCodes.map((code, index) => (
                <View key={`${code}-${index}`} style={styles.tagItem}>
                  <Text style={styles.tagIndex}>#{boxCodes.length - index}</Text>
                  <Text style={styles.tagCode} numberOfLines={1}>
                    📦 {code}
                  </Text>
                  <TouchableOpacity
                    style={styles.removeTagBtn}
                    onPress={() => handleRemoveBox(index)}
                  >
                    <Text style={styles.removeTagText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Nút lưu container */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>
              ✓ LƯU CONTAINER ({boxCodes.length} THÙNG HÀNG)
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Camera Native Scanner Modal */}
      <NativeBarcodeScanner
        visible={scannerVisible}
        onClose={() => setScannerVisible(false)}
        onScanSuccess={handleScanResult}
        instructionText={
          scanTarget === 'container'
            ? 'Hướng camera vào mã vạch/QR của Container'
            : 'Hướng camera vào mã vạch trên từng Thùng carton'
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  sectionStep: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  sectionDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  counterBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  smallLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
  },
  scanBtnInline: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scanBtnText: {
    color: '#38BDF8',
    fontSize: 13,
    fontWeight: '700',
  },
  scanMainBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  scanMainBtnIcon: {
    fontSize: 26,
    marginRight: 12,
  },
  scanMainBtnTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  scanMainBtnSub: {
    color: '#BAE6FD',
    fontSize: 11,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginTop: 18,
    marginBottom: 8,
  },
  emptyList: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  tagList: {
    gap: 6,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagIndex: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    width: 32,
  },
  tagCode: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'monospace',
    color: '#0F172A',
    fontWeight: '600',
  },
  removeTagBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  removeTagText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '800',
  },
  saveBtn: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  saveBtnDisabled: {
    backgroundColor: '#94A3B8',
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
