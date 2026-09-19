import React from 'react';
import { View, Text } from 'react-native';
import { AppCard, AppTextInput, AppButton } from '@intrustdss/ui';
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
    <AppCard variant="elevated" padding="md" style={styles.sectionCard}>
      <Text style={styles.sectionStep}>BƯỚC 1: MÃ THÙNG HÀNG</Text>
      <Text style={styles.sectionDesc}>Quét mã QR/Barcode trên thùng carton hoặc nhập mã:</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
        <View style={{ flex: 1, marginRight: 10 }}>
          <AppTextInput
            placeholder="VD: THUNG-2026-001"
            value={cartonCode}
            onChangeText={onChangeCartonCode}
            autoCapitalize="characters"
            autoCorrect={false}
            containerStyle={{ marginBottom: 0 }}
          />
        </View>
        <AppButton
          title="Quét"
          variant="secondary"
          size="md"
          icon={<Text>📷</Text>}
          onPress={onOpenScanner}
        />
      </View>
    </AppCard>
  );
};
