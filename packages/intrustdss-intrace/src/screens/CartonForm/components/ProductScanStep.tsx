import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { styles } from '../CartonForm.styles';

interface Props {
  productQrCodes: string[];
  manualProductInput: string;
  onChangeManualInput: (val: string) => void;
  onAddManualProduct: () => void;
  onOpenScanner: () => void;
  onRemoveProduct: (index: number) => void;
}

export const ProductScanStep: React.FC<Props> = ({
  productQrCodes,
  manualProductInput,
  onChangeManualInput,
  onAddManualProduct,
  onOpenScanner,
  onRemoveProduct,
}) => {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={styles.sectionStep}>BƯỚC 2: QUÉT TEM SẢN PHẨM VÀO THÙNG</Text>
          <Text style={styles.sectionDesc}>Quét liên tục từng tem sản phẩm để đóng gói:</Text>
        </View>
        <View style={styles.counterBadge}>
          <Text style={styles.counterText}>{productQrCodes.length} SP</Text>
        </View>
      </View>

      {/* Nút camera native mở scanner */}
      <TouchableOpacity style={styles.scanMainBtn} onPress={onOpenScanner} activeOpacity={0.85}>
        <Text style={styles.scanMainBtnIcon}>📷</Text>
        <View>
          <Text style={styles.scanMainBtnTitle}>Bật Máy Quét Native (Camera)</Text>
          <Text style={styles.scanMainBtnSub}>Nhận diện siêu tốc &lt; 30ms, hỗ trợ bật đèn Flash</Text>
        </View>
      </TouchableOpacity>

      {/* Nhập tay phòng trường hợp tem bị rách/mờ */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tay mã sản phẩm nếu mờ tem"
          placeholderTextColor="#94A3B8"
          value={manualProductInput}
          onChangeText={onChangeManualInput}
          autoCapitalize="characters"
        />
        <TouchableOpacity style={styles.addBtn} onPress={onAddManualProduct} activeOpacity={0.8}>
          <Text style={styles.addBtnText}>+ Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách các tem sản phẩm đã quét */}
      <Text style={styles.listHeading}>
        Danh sách tem đã đưa vào thùng ({productQrCodes.length}):
      </Text>

      {productQrCodes.length === 0 ? (
        <View style={styles.emptyList}>
          <Text style={styles.emptyText}>Chưa có sản phẩm nào được quét vào thùng này.</Text>
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
                onPress={() => onRemoveProduct(index)}
              >
                <Text style={styles.removeTagText}>✕</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
