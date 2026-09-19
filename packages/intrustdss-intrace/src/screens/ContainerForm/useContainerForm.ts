import { useState } from 'react';
import { Alert } from 'react-native';
import { InTraceStorageService } from '../../services/intraceStorage';

export function useContainerForm(navigation: any) {
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

  const openScanner = (target: 'container' | 'box') => {
    setScanTarget(target);
    setScannerVisible(true);
  };

  const closeScanner = () => {
    setScannerVisible(false);
  };

  const handleScanResult = (scannedValue: string) => {
    const val = scannedValue.trim();
    if (!val) return;

    if (scanTarget === 'container') {
      setContainerCode(val);
      Alert.alert('Đã quét Mã Công', `Mã Container: ${val}`);
    } else {
      if (boxCodes.includes(val)) {
        Alert.alert('Cảnh báo trùng', `Thùng "${val}" đã được quét vào Container này rồi.`);
      } else {
        setBoxCodes((prev) => [val, ...prev]);
      }
    }
  };

  const addManualBox = () => {
    const val = manualBoxInput.trim();
    if (!val) return;
    if (boxCodes.includes(val)) {
      Alert.alert('Cảnh báo trùng', 'Mã thùng này đã được thêm trước đó.');
      return;
    }
    setBoxCodes((prev) => [val, ...prev]);
    setManualBoxInput('');
  };

  const removeBox = (index: number) => {
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

  return {
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
  };
}
