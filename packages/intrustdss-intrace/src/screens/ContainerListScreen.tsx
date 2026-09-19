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
import { Container } from '../types/container';
import { InTraceStorageService } from '../services/intraceStorage';
import { NativeBarcodeScanner } from '../components/NativeBarcodeScanner';

type NavigationProp = StackNavigationProp<InTraceStackParamList, 'ContainerList'>;

interface Props {
  navigation: NavigationProp;
}

export const ContainerListScreen: React.FC<Props> = ({ navigation }) => {
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [scannerVisible, setScannerVisible] = useState<boolean>(false);

  const fetchContainers = async () => {
    try {
      setLoading(true);
      const selected = await InTraceStorageService.getSelectedProduct();
      const data = await InTraceStorageService.getContainers(selected?.config_id || selected?.id);
      setContainers(data);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách Container');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchContainers();
    });
    fetchContainers();
    return unsubscribe;
  }, [navigation]);

  const handleDeleteContainer = (id: string, code: string) => {
    Alert.alert(
      'Xác nhận xóa Công',
      `Bạn có chắc muốn xóa Container "${code}"? Các thùng trong công này sẽ được chuyển về trạng thái chờ xếp lại.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await InTraceStorageService.deleteContainer(id);
            fetchContainers();
          },
        },
      ]
    );
  };

  const handleScanCode = (scannedCode: string) => {
    setSearchQuery(scannedCode);
    const found = containers.find(
      (c) =>
        c.containerCode.toLowerCase() === scannedCode.toLowerCase() ||
        c.sealNumber.toLowerCase() === scannedCode.toLowerCase()
    );
    if (found) {
      Alert.alert('Tìm thấy Container', `Số hiệu: ${found.containerCode}\nSố Seal: ${found.sealNumber}`);
    } else {
      Alert.alert(
        'Không tìm thấy',
        `Chưa có công nào trùng mã "${scannedCode}". Bạn có muốn tạo mới ngay không?`,
        [
          { text: 'Đóng' },
          {
            text: 'Tạo công mới',
            onPress: () => navigation.navigate('ContainerForm'),
          },
        ]
      );
    }
  };

  const filteredContainers = containers.filter(
    (c) =>
      c.containerCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sealNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: Container['status']) => {
    switch (status) {
      case 'sealed':
        return { label: 'Đã kẹp chì (Seal)', bg: '#E0E7FF', text: '#3730A3' };
      case 'departed':
        return { label: 'Đã xuất cảng', bg: '#DCFCE7', text: '#15803D' };
      case 'loading':
        return { label: 'Đang xếp hàng', bg: '#FEF3C7', text: '#B45309' };
      case 'draft':
      default:
        return { label: 'Khởi tạo', bg: '#F1F5F9', text: '#475569' };
    }
  };

  const renderItem = ({ item }: { item: Container }) => {
    const badge = getStatusBadge(item.status);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('ContainerForm', { container: item })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.codeRow}>
            <Text style={styles.containerCodeText}>🚢 {item.containerCode}</Text>
            <View style={[styles.badge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.badgeText, { color: badge.text }]}>{badge.label}</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => handleDeleteContainer(item.id, item.containerCode)}
            style={styles.deleteBtn}
          >
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Số Seal (Kẹp chì):</Text>
          <Text style={styles.sealNumber}>{item.sealNumber}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Cảng đích:</Text>
          <Text style={styles.infoValue}>{item.destination}</Text>
        </View>

        {item.truckPlate ? (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Xe & Tài xế:</Text>
            <Text style={styles.infoValue}>
              {item.truckPlate} {item.driverName ? `(${item.driverName})` : ''}
            </Text>
          </View>
        ) : null}

        <View style={styles.cartonCounterBox}>
          <Text style={styles.cartonCounterText}>
            📦 Số lượng thùng trong công:{' '}
            <Text style={styles.boldText}>{item.cartonCount} thùng</Text>
            {item.maxCartons ? ` / ${item.maxCartons} (Max)` : ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search & Barcode Scan bar */}
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm số công, số chì seal, cảng đến..."
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

      {/* List content */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#0284C7" />
        </View>
      ) : (
        <FlatList
          data={filteredContainers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyEmoji}>🚢</Text>
              <Text style={styles.emptyTitle}>Chưa có Container nào</Text>
              <Text style={styles.emptySubtitle}>
                Bấm nút &quot;Thêm Công Mới&quot; bên dưới để quản lý chuyến xuất hàng
              </Text>
            </View>
          }
        />
      )}

      {/* Add New Container Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('ContainerForm')}
        >
          <Text style={styles.addButtonText}>+ Thêm Công (Container) Mới</Text>
        </TouchableOpacity>
      </View>

      {/* Barcode Scanner Modal */}
      <NativeBarcodeScanner
        visible={scannerVisible}
        title="Quét mã số Công hoặc Seal"
        onScanSuccess={handleScanCode}
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
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  containerCodeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0369A1',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  deleteBtn: {
    padding: 6,
  },
  deleteText: {
    fontSize: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
  },
  sealNumber: {
    fontSize: 13,
    color: '#D97706',
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  cartonCounterBox: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  cartonCounterText: {
    fontSize: 13,
    color: '#334155',
  },
  boldText: {
    fontWeight: '700',
    color: '#0284C7',
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
});
