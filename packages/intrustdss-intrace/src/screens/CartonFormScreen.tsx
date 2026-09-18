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

type RouteProps = RouteProp<InTraceStackParamList, 'CartonForm'>;
type NavigationProps = StackNavigationProp<InTraceStackParamList, 'CartonForm'>;

interface Props {
  route: RouteProps;
  navigation: NavigationProps;
}

export const CartonFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const initialCode = route.params?.initialCartonCode;

  const [cartonCode, setCartonCode] = useState<string>(
    initialCode || `THUNG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [productQrCodes, setProductQrCodes] = useState<string[]>([]);
  const [manualProductInput, setManualProductInput] = useState<string>('');
  const [scannerVisible, setScannerVisible] = useState<boolean>(false);
  const [scanTarget, setScanTarget] = useState<'carton' | 'product'>('carton');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    navigation.setOptions({
      title: 'Đóng Thùng Hàng (inTrace)',
    });
  }, [navigation]);

  const handleOpenScanner = (target: 'carton' | 'product') => {
    setScanTarget(target);
    setScannerVisible(true);
  };

  const handleScanResult = (scannedValue: string) => {
    const val = scannedValue.trim();
    if (!val) return;

    if (scanTarget === 'carton') {
      setCartonCode(val);
      Alert.alert('Đã quét Mã Thùng', `Mã thùng: ${val}`);
    } else {
      // Quét tem sản phẩm vào thùng
      if (productQrCodes.includes(val)) {
        Alert.alert('Cảnh báo trùng', `Mã sản phẩm "${val}" đã có trong thùng này rồi.`);
      } else {
        setProductQrCodes((prev) => [val, ...prev]);
      }
    }
  };

  const handleAddManualProduct = () => {
    const val = manualProductInput.trim();
    if (!val) return;
    if (productQrCodes.includes(val)) {
      Alert.alert('Cảnh báo trùng', 'Mã sản phẩm này đã được thêm trước đó.');
      return;
    }
    setProductQrCodes((prev) => [val, ...prev]);
    setManualProductInput('');
  };

  const handleRemoveProduct = (index: number) => {
    setProductQrCodes((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!cartonCode.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập hoặc quét Mã Thùng.');
      return;
    }

    try {
      setSaving(true);
      await InTraceStorageService.createCarton({
        cartonCode: cartonCode.trim(),
        productName: `Lô sản phẩm (${productQrCodes.length} tem)`,
        lotNumber: `LOT-${new Date().getFullYear()}`,
        packingDate: new Date().toISOString(),
        status: 'packed',
        quantity: productQrCodes.length,
        unit: 'sản phẩm',
        product_qr_codes: productQrCodes,
      });

      Alert.alert(
        'Thành công',
        `Đã lưu thùng "${cartonCode}" với ${productQrCodes.length} sản phẩm lên hệ thống inTrace.`,
        [{ text: 'Đồng ý', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể lưu thùng hàng. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Bước 1: Mã Thùng */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionStep}>BƯỚC 1: MÃ THÙNG HÀNG</Text>
          <Text style={styles.sectionDesc}>Quét mã QR/Barcode trên thùng carton hoặc nhập mã:</Text>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="VD: THUNG-2026-001"
              placeholderTextColor="#94A3B8"
              value={cartonCode}
              onChangeText={setCartonCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={styles.scanBtnInline}
              onPress={() => handleOpenScanner('carton')}
              activeOpacity={0.8}
            >
              <Text style={styles.scanBtnText}>📷 Quét mã</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bước 2: Quét Tem Sản Phẩm Vào Thùng */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionStep}>BƯỚC 2: QUÉT TEM SẢN PHẨM VÀO THÙNG</Text>
              <Text style={styles.sectionDesc}>Đưa camera quét liên tục các tem sản phẩm xếp vào thùng</Text>
            </View>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{productQrCodes.length} SP</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.scanMainBtn}
            onPress={() => handleOpenScanner('product')}
            activeOpacity={0.8}
          >
            <Text style={styles.scanMainBtnIcon}>📷</Text>
            <View>
              <Text style={styles.scanMainBtnTitle}>Bật Camera Quét Tem Sản Phẩm</Text>
              <Text style={styles.scanMainBtnSub}>Hỗ trợ quét QR và mã vạch tự động</Text>
            </View>
          </TouchableOpacity>

          {/* Ô nhập tay dự phòng */}
          <View style={[styles.inputRow, { marginTop: 12 }]}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Nhập thủ công mã tem nếu mờ..."
              placeholderTextColor="#94A3B8"
              value={manualProductInput}
              onChangeText={setManualProductInput}
            />
            <TouchableOpacity
              style={styles.addBtn}
              onPress={handleAddManualProduct}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+ Thêm</Text>
            </TouchableOpacity>
          </View>

          {/* Danh sách tem sản phẩm đã quét trong thùng */}
          <Text style={styles.listHeading}>
            Danh sách tem trong thùng ({productQrCodes.length}):
          </Text>

          {productQrCodes.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>Chưa có sản phẩm nào. Hãy bấm "Quét Tem" ở trên.</Text>
            </View>
          ) : (
            <View style={styles.tagList}>
              {productQrCodes.map((code, index) => (
                <View key={`${code}-${index}`} style={styles.tagItem}>
                  <Text style={styles.tagIndex}>#{productQrCodes.length - index}</Text>
                  <Text style={styles.tagCode} numberOfLines={1}>
                    {code}
                  </Text>
                  <TouchableOpacity
                    style={styles.removeTagBtn}
                    onPress={() => handleRemoveProduct(index)}
                  >
                    <Text style={styles.removeTagText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Nút lưu thùng */}
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
              ✓ LƯU THÙNG HÀNG ({productQrCodes.length} SẢN PHẨM)
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
          scanTarget === 'carton'
            ? 'Hướng camera vào mã vạch/QR của Thùng carton'
            : 'Hướng camera vào tem mã QR của từng sản phẩm'
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
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#10B981',
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
