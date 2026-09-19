import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { InTraceStorageService } from '../../services/intraceStorage';
import { ProductCategory } from '../../types/product';

export function useCartonForm(navigation: any, initialCode?: string) {
  const [selectedProduct, setSelectedProduct] = useState<ProductCategory | null>(null);
  const [cartonCode, setCartonCode] = useState<string>(
    initialCode || `THUNG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [productQrCodes, setProductQrCodes] = useState<string[]>([]);
  const [manualProductInput, setManualProductInput] = useState<string>('');
  const [scannerVisible, setScannerVisible] = useState<boolean>(false);
  const [scanTarget, setScanTarget] = useState<'carton' | 'product'>('carton');
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    InTraceStorageService.getSelectedProduct().then((prod) => {
      setSelectedProduct(prod);
    });
  }, []);

  const openScanner = (target: 'carton' | 'product') => {
    setScanTarget(target);
    setScannerVisible(true);
  };

  const closeScanner = () => {
    setScannerVisible(false);
  };

  const handleScanResult = (scannedValue: string) => {
    const val = scannedValue.trim();
    if (!val) return;

    if (scanTarget === 'carton') {
      setCartonCode(val);
      Alert.alert('Đã quét Mã Thùng', `Mã thùng: ${val}`);
    } else {
      if (productQrCodes.includes(val)) {
        Alert.alert('Cảnh báo trùng', `Mã sản phẩm "${val}" đã có trong thùng này rồi.`);
      } else {
        setProductQrCodes((prev) => [val, ...prev]);
      }
    }
  };

  const addManualProduct = () => {
    const val = manualProductInput.trim();
    if (!val) return;
    if (productQrCodes.includes(val)) {
      Alert.alert('Cảnh báo trùng', 'Mã sản phẩm này đã được thêm trước đó.');
      return;
    }
    setProductQrCodes((prev) => [val, ...prev]);
    setManualProductInput('');
  };

  const removeProduct = (index: number) => {
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
        productName: selectedProduct?.name || `Lô sản phẩm (${productQrCodes.length} tem)`,
        product_category_id: selectedProduct?.id || null,
        lotNumber: `LOT-${new Date().getFullYear()}`,
        packingDate: new Date().toISOString(),
        status: 'packed',
        quantity: productQrCodes.length,
        unit: 'sản phẩm',
        product_qr_codes: productQrCodes,
      });

      Alert.alert(
        'Thành công',
        `Đã lưu thùng "${cartonCode}" với ${productQrCodes.length} sản phẩm (${selectedProduct?.name || 'Sản phẩm'}) lên hệ thống inTrace.`,
        [{ text: 'Đồng ý', onPress: () => navigation.goBack() }]
      );
    } catch (err: any) {
      Alert.alert('Lỗi', 'Không thể lưu thùng hàng. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  return {
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
  };
}
