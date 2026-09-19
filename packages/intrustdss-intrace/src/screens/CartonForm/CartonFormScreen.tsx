import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { InTraceStackParamList } from '../../navigation/types';
import { NativeBarcodeScanner } from '../../components/NativeBarcodeScanner';
import { useCartonForm } from './useCartonForm';
import { styles } from './CartonForm.styles';
import { CartonCodeStep } from './components/CartonCodeStep';
import { ProductScanStep } from './components/ProductScanStep';

type RouteProps = RouteProp<InTraceStackParamList, 'CartonForm'>;
type NavigationProps = StackNavigationProp<InTraceStackParamList, 'CartonForm'>;

interface Props {
  route: RouteProps;
  navigation: NavigationProps;
}

export const CartonFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const {
    selectedProduct,
    cartonCode,
    setCartonCode,
    productQrCodes,
    manualProductInput,
    setManualProductInput,
    scannerVisible,
    scanTarget,
    saving,
    openScanner,
    closeScanner,
    handleScanResult,
    addManualProduct,
    removeProduct,
    handleSave,
  } = useCartonForm(navigation, route.params?.initialCartonCode);

  useEffect(() => {
    navigation.setOptions({
      title: 'Đóng Thùng Hàng (inTrace)',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Banner sản phẩm đang đóng thùng */}
        {selectedProduct ? (
          <View style={styles.productHeaderBox}>
            <Text style={styles.productHeaderLabel}>Sản phẩm đóng thùng</Text>
            <Text style={styles.productHeaderTitle}>
              🏷️ {selectedProduct.name} {selectedProduct.gtin ? `(${selectedProduct.gtin})` : ''}
            </Text>
          </View>
        ) : null}

        {/* Bước 1: Quét / Nhập mã thùng */}
        <CartonCodeStep
          cartonCode={cartonCode}
          onChangeCartonCode={setCartonCode}
          onOpenScanner={() => openScanner('carton')}
        />

        {/* Bước 2: Quét tem sản phẩm đưa vào thùng */}
        <ProductScanStep
          productQrCodes={productQrCodes}
          manualProductInput={manualProductInput}
          onChangeManualInput={setManualProductInput}
          onAddManualProduct={addManualProduct}
          onOpenScanner={() => openScanner('product')}
          onRemoveProduct={removeProduct}
        />

        {/* Bước 3: Nút Lưu hoàn tất đóng thùng */}
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
              HOÀN TẤT &amp; LƯU THÙNG HÀNG ({productQrCodes.length} SP)
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal máy quét native */}
      <NativeBarcodeScanner
        visible={scannerVisible}
        title={scanTarget === 'carton' ? 'Quét Mã Thùng Carton' : 'Quét Tem Sản Phẩm'}
        instruction={
          scanTarget === 'carton'
            ? 'Đưa camera vào mã vạch/QR in trên vỏ thùng carton'
            : 'Đưa camera vào từng tem sản phẩm để tự động thêm vào thùng'
        }
        onScanSuccess={handleScanResult}
        onClose={closeScanner}
      />
    </View>
  );
};
