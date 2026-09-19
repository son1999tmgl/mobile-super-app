import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { InTraceStackParamList } from '../../navigation/types';
import { NativeBarcodeScanner } from '../../components/NativeBarcodeScanner';
import { useContainerForm } from './useContainerForm';
import { styles } from './ContainerForm.styles';

type RouteProps = RouteProp<InTraceStackParamList, 'ContainerForm'>;
type NavigationProps = StackNavigationProp<InTraceStackParamList, 'ContainerForm'>;

interface Props {
  route: RouteProps;
  navigation: NavigationProps;
}

export const ContainerFormScreen: React.FC<Props> = ({ navigation }) => {
  const {
    containerCode,
    setContainerCode,
    sealNumber,
    setSealNumber,
    boxCodes,
    manualBoxInput,
    setManualBoxInput,
    scannerVisible,
    scanTarget,
    saving,
    openScanner,
    closeScanner,
    handleScanResult,
    addManualBox,
    removeBox,
    handleSave,
  } = useContainerForm(navigation);

  useEffect(() => {
    navigation.setOptions({
      title: 'Đóng Hàng Lên Container (inTrace)',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Bước 1: Mã Container & Số Seal */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionStep}>BƯỚC 1: MÃ CONTAINER &amp; SỐ SEAL</Text>
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
              onPress={() => openScanner('container')}
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
              <Text style={styles.sectionStep}>BƯỚC 2: XẾP THÙNG HÀNG LÊN CÔNG</Text>
              <Text style={styles.sectionDesc}>Quét mã từng thùng hàng khi đưa vào container:</Text>
            </View>
            <View style={styles.counterBadge}>
              <Text style={styles.counterText}>{boxCodes.length} Thùng</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.scanMainBtn}
            onPress={() => openScanner('box')}
            activeOpacity={0.85}
          >
            <Text style={styles.scanMainBtnIcon}>📷</Text>
            <View>
              <Text style={styles.scanMainBtnTitle}>Bật Máy Quét Native (Quét Thùng)</Text>
              <Text style={styles.scanMainBtnSub}>Quét liên tục, tự động cộng dồn số thùng</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Nhập tay mã thùng nếu mờ mã"
              placeholderTextColor="#94A3B8"
              value={manualBoxInput}
              onChangeText={setManualBoxInput}
              autoCapitalize="characters"
            />
            <TouchableOpacity style={styles.addBtn} onPress={addManualBox} activeOpacity={0.8}>
              <Text style={styles.addBtnText}>+ Thêm</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.listHeading}>
            Danh sách thùng đã xếp trong công ({boxCodes.length}):
          </Text>

          {boxCodes.length === 0 ? (
            <View style={styles.emptyList}>
              <Text style={styles.emptyText}>Chưa có thùng hàng nào được quét vào container.</Text>
            </View>
          ) : (
            <View style={styles.tagList}>
              {boxCodes.map((code, index) => (
                <View key={`${code}-${index}`} style={styles.tagItem}>
                  <Text style={styles.tagIndex}>#{boxCodes.length - index}</Text>
                  <Text style={styles.tagCode} numberOfLines={1}>
                    {code}
                  </Text>
                  <TouchableOpacity
                    style={styles.removeTagBtn}
                    onPress={() => removeBox(index)}
                  >
                    <Text style={styles.removeTagText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bước 3: Nút Lưu */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.saveBtnText}>
              HOÀN TẤT &amp; LƯU CONTAINER ({boxCodes.length} THÙNG)
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal máy quét native */}
      <NativeBarcodeScanner
        visible={scannerVisible}
        title={scanTarget === 'container' ? 'Quét Mã Container' : 'Quét Mã Thùng Hàng'}
        instruction={
          scanTarget === 'container'
            ? 'Đưa camera vào biển số hiệu trên cửa container'
            : 'Đưa camera vào tem mã vạch/QR của từng thùng hàng'
        }
        onScanSuccess={handleScanResult}
        onClose={closeScanner}
      />
    </View>
  );
};
