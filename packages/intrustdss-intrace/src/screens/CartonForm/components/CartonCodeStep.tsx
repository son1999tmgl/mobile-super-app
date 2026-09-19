import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../CartonForm.styles';

interface Props {
  cartonCode: string;
  onChangeCartonCode: (val: string) => void;
  onOpenScanner: () => void;
}

export const CartonCodeStep: React.FC<Props> = ({
  cartonCode,
  onChangeCartonCode,
  onOpenScanner,
}) => {
  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionStep}>BƯỚC 1: MÃ THÙNG HÀNG</Text>
      <Text style={styles.sectionDesc}>Quét mã QR/Barcode trên thùng carton hoặc nhập mã:</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="VD: THUNG-2026-001"
          placeholderTextColor="#94A3B8"
          value={cartonCode}
          onChangeText={onChangeCartonCode}
          autoCapitalize="characters"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.scanBtnInline} onPress={onOpenScanner} activeOpacity={0.8}>
          <Text style={styles.scanBtnText}>📷 Quét Mã</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
