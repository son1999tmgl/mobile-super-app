import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { InTraceStackParamList } from '../navigation/types';
import { Carton } from '../types/carton';
import { ProductCategory } from '../types/product';
import { InTraceStorageService } from '../services/intraceStorage';
import { NativeBarcodeScanner } from '../components/NativeBarcodeScanner';

type NavigationProp = StackNavigationProp<InTraceStackParamList, 'CartonList'>;

interface Props {
  navigation: NavigationProp;
}

export const CartonListScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductCategory | null>(null);
  const [cartons, setCartons] = useState<Carton[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scannerVisible, setScannerVisible] = useState<boolean>(false);

  const fetchCartons = async () => {
    try {
      setLoading(true);
      const selected = await InTraceStorageService.getSelectedProduct();
      setSelectedProduct(selected);
      const data = await InTraceStorageService.getCartons(
        selected?.product_category_id,
        selected?.config_id || selected?.id
      );
      setCartons(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách thùng hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchCartons();
    });
    fetchCartons();
    return unsubscribe;
  }, [navigation]);

  const handleDeleteCarton = (id: string, code: string) => {
    Alert.alert('Xác nhận xóa thùng', `Bạn có chắc muốn xóa thùng "${code}" khỏi hệ thống?`, [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await InTraceStorageService.deleteCarton(id);
          fetchCartons();
        },
      },
    ]);
  };

  const handleScanCarton = (scannedCode: string) => {
    setSearchQuery(scannedCode);
    const found = cartons.find((c) => c.cartonCode.toLowerCase() === scannedCode.toLowerCase());
    if (found) {
      Alert.alert('Tìm thấy Thùng', `Mã: ${found.cartonCode}\nSản phẩm: ${found.productName}`);
    } else {
      Alert.alert(
        'Không tìm thấy',
        `Chưa có thùng với mã "${scannedCode}". Bạn có muốn tạo mới ngay không?`,
        [
          { text: 'Đóng' },
          {
            text: 'Tạo mới',
            onPress: () => navigation.navigate('CartonForm', { initialCartonCode: scannedCode }),
          },
        ]
      );
    }
  };

  const filteredCartons = cartons.filter(
    (c) =>
      c.cartonCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.containerCode && c.containerCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const renderItem = ({ item }: { item: Carton }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CartonForm', { carton: item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.codeRow}>
          <Text style={styles.codeText}>📦 {item.cartonCode}</Text>
          <View
            style={[
              styles.badge,
              item.status === 'loaded' ? styles.badgeSuccess : styles.badgeWarning,
            ]}
          >
            <Text style={styles.badgeText}>
              {item.status === 'loaded' ? 'Đã xếp vào công' : 'Chờ xếp công'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => handleDeleteCarton(item.id, item.cartonCode)}
          style={styles.deleteBtn}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.productName}>{item.productName}</Text>

      <View style={styles.detailRow}>
        <Text style={styles.detailText}>
          SL: <Text style={styles.boldText}>{item.quantity} {item.unit}</Text>
        </Text>
        <Text style={styles.detailText}>Lô: {item.lotNumber}</Text>
        {item.weightKg ? <Text style={styles.detailText}>{item.weightKg} kg</Text> : null}
      </View>

      {item.containerCode ? (
        <View style={styles.containerTag}>
          <Text style={styles.containerTagText}>🚢 Thuộc công: {item.containerCode}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search & Scan Bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm mã thùng, tên sản phẩm, mã công..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#94A3B8"
        />
        {searchQuery.length > 0 ? (
          <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={styles.scanBtn} onPress={() => setScannerVisible(true)}>
          <Text style={styles.scanBtnText}>📷 Quét</Text>
        </TouchableOpacity>
      </View>

      {/* Product Banner Filter */}
      {selectedProduct ? (
        <View style={styles.productBanner}>
          <Text style={styles.productBannerText} numberOfLines={1}>
            Sản phẩm: <Text style={styles.productBannerName}>{selectedProduct.name}</Text>
          </Text>
          <TouchableOpacity
            style={styles.productChangeBtn}
            onPress={() => navigation.navigate('ProductSelect')}
          >
            <Text style={styles.productChangeText}>Đổi ⇄</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* List content */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#0284C7" />
        </View>
      ) : (
        <FlatList
          data={filteredCartons}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyTitle}>Chưa có thùng hàng nào</Text>
              <Text style={styles.emptySubtitle}>
                Bấm nút &quot;Thêm thùng&quot; bên dưới hoặc quét mã vạch để tạo mới
              </Text>
            </View>
          }
        />
      )}

      {/* Add New Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CartonForm')}
        >
          <Text style={styles.addButtonText}>+ Thêm Thùng Mới</Text>
        </TouchableOpacity>
      </View>

      {/* Barcode Scanner Modal */}
      <NativeBarcodeScanner
        visible={scannerVisible}
        title="Quét mã thùng hàng"
        onScanSuccess={handleScanCarton}
        onClose={() => setScannerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  searchBarContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 42,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  scanBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
  listContent: {
    padding: 12,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  codeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0284C7',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeSuccess: {
    backgroundColor: '#DCFCE7',
  },
  badgeWarning: {
    backgroundColor: '#FEF3C7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E293B',
  },
  deleteBtn: {
    padding: 6,
  },
  deleteText: {
    fontSize: 16,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 16,
  },
  detailText: {
    fontSize: 12,
    color: '#64748B',
  },
  boldText: {
    fontWeight: '700',
    color: '#334155',
  },
  containerTag: {
    marginTop: 8,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  containerTagText: {
    fontSize: 11,
    color: '#1D4ED8',
    fontWeight: '600',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 32,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  addButton: {
    backgroundColor: '#0284C7',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  productBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
  },
  productBannerText: {
    flex: 1,
    fontSize: 13,
    color: '#0369A1',
    fontWeight: '500',
    marginRight: 8,
  },
  productBannerName: {
    fontWeight: '700',
    color: '#0C4A6E',
  },
  productChangeBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#7DD3FC',
  },
  productChangeText: {
    color: '#0284C7',
    fontSize: 12,
    fontWeight: '700',
  },
});
