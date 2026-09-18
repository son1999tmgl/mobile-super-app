import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { InTraceStackParamList } from '../navigation/types';
import { InTraceProps } from '../types';
import { InTraceStorageService } from '../services/intraceStorage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getInTraceConfig } from '../config/env';
import { NativeBarcodeScanner } from '../components/NativeBarcodeScanner';

type DashboardNavigationProp = StackNavigationProp<InTraceStackParamList, 'InTraceDashboard'>;

interface Props extends InTraceProps {
  navigation: DashboardNavigationProp;
}

export const InTraceDashboardScreen: React.FC<Props> = ({
  navigation,
  token,
  userInfo,
  environment,
  onExit,
}) => {
  const insets = useSafeAreaInsets();
  const config = getInTraceConfig(environment);
  const [cartonCount, setCartonCount] = useState<number>(0);
  const [containerCount, setContainerCount] = useState<number>(0);
  const [unassignedCartonCount, setUnassignedCartonCount] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [scannerVisible, setScannerVisible] = useState<boolean>(false);

  const loadMetrics = async () => {
    try {
      InTraceStorageService.setAuth(token, environment);
      const cartons = await InTraceStorageService.getCartons();
      const containers = await InTraceStorageService.getContainers();
      const unassigned = await InTraceStorageService.getUnassignedCartons();
      setCartonCount(cartons.length);
      setContainerCount(containers.length);
      setUnassignedCartonCount(unassigned.length);
    } catch (err: any) {
      console.error('Error loading metrics', err);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadMetrics();
    });
    loadMetrics();
    return unsubscribe;
  }, [navigation]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadMetrics();
    setRefreshing(false);
  };

  const handleGlobalScan = async (scannedCode: string) => {
    const foundCarton = await InTraceStorageService.getCartonByCode(scannedCode);
    if (foundCarton) {
      Alert.alert(
        'Đã tìm thấy Thùng',
        `Mã: ${foundCarton.cartonCode}\nSản phẩm: ${foundCarton.productName}\nSố lượng: ${foundCarton.quantity} ${foundCarton.unit}`,
        [
          { text: 'Đóng' },
          {
            text: 'Chỉnh sửa',
            onPress: () => navigation.navigate('CartonForm', { carton: foundCarton }),
          },
        ]
      );
    } else {
      Alert.alert(
        'Mã mới',
        `Mã vừa quét: "${scannedCode}" chưa có trong hệ thống. Bạn có muốn tạo mới thùng với mã này?`,
        [
          { text: 'Hủy' },
          {
            text: 'Tạo thùng ngay',
            onPress: () => navigation.navigate('CartonForm', { initialCartonCode: scannedCode }),
          },
        ]
      );
    }
  };

  const getEnvBadgeColor = () => {
    switch (environment) {
      case 'prod':
        return '#10B981';
      case 'uat':
        return '#F59E0B';
      case 'dev':
      default:
        return '#3B82F6';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header bar */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        <View style={styles.headerLeft}>
          <Text style={styles.appTitle}>inTrace • Quản lý Chuỗi Cung Ứng</Text>
          <View style={styles.userRow}>
            <Text style={styles.userName}>{userInfo?.name || 'Cán bộ Vận hành'}</Text>
          </View>
        </View>

        {onExit ? (
          <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
            <Text style={styles.exitBtnText}>Thoát ✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Banner quét nhanh */}
        <TouchableOpacity style={styles.scanBanner} onPress={() => setScannerVisible(true)}>
          <View style={styles.scanBannerIcon}>
            <Text style={styles.scanBannerEmoji}>📷</Text>
          </View>
          <View style={styles.scanBannerTextContainer}>
            <Text style={styles.scanBannerTitle}>Quét mã vạch / QR tức thì</Text>
            <Text style={styles.scanBannerSubtitle}>
              Sử dụng Camera Native siêu nhạy để tra cứu hoặc nhập hàng
            </Text>
          </View>
        </TouchableOpacity>

        {/* Thống kê nhanh */}
        <Text style={styles.sectionHeader}>Tổng quan hệ thống</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{cartonCount}</Text>
            <Text style={styles.statLabel}>Tổng số Thùng</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{containerCount}</Text>
            <Text style={styles.statLabel}>Container (Công)</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: '#F59E0B' }]}>{unassignedCartonCount}</Text>
            <Text style={styles.statLabel}>Thùng chưa xếp</Text>
          </View>
        </View>

        {/* 2 Modules cốt lõi */}
        <Text style={styles.sectionHeader}>Nghiệp vụ Quản lý</Text>

        {/* Module 1: Quản lý Thùng */}
        <TouchableOpacity
          style={styles.moduleCard}
          onPress={() => navigation.navigate('CartonList')}
        >
          <View style={[styles.moduleIconBox, { backgroundColor: '#E0F2FE' }]}>
            <Text style={styles.moduleEmoji}>📦</Text>
          </View>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitle}>Quản lý Thùng (Carton)</Text>
            <Text style={styles.moduleDesc}>
              Danh sách thùng hàng, thêm mới thùng, in/quét mã vạch, phân bổ sản phẩm
            </Text>
          </View>
          <Text style={styles.arrowIcon}>›</Text>
        </TouchableOpacity>

        {/* Module 2: Quản lý Công */}
        <TouchableOpacity
          style={styles.moduleCard}
          onPress={() => navigation.navigate('ContainerList')}
        >
          <View style={[styles.moduleIconBox, { backgroundColor: '#DCFCE7' }]}>
            <Text style={styles.moduleEmoji}>🚢</Text>
          </View>
          <View style={styles.moduleInfo}>
            <Text style={styles.moduleTitle}>Quản lý Công (Container)</Text>
            <Text style={styles.moduleDesc}>
              Danh sách container, số seal kẹp chì, bốc xếp thùng vào công, xuất bãi
            </Text>
          </View>
          <Text style={styles.arrowIcon}>›</Text>
        </TouchableOpacity>

        {/* Thông tin môi trường backend */}
        <View style={styles.endpointCard}>
          <Text style={styles.endpointTitle}>Cấu hình Backend inTrace:</Text>
          <Text style={styles.endpointUrl}>{config.apiBaseUrl}</Text>
        </View>
      </ScrollView>

      {/* Camera Barcode Scanner Modal */}
      <NativeBarcodeScanner
        visible={scannerVisible}
        title="Quét mã Thùng hoặc Công"
        onScanSuccess={handleGlobalScan}
        onClose={() => setScannerVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#0F172A',
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
  },
  appTitle: {
    color: '#38BDF8',
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  userName: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '500',
  },
  envBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  envBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  exitBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  exitBtnText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  scanBanner: {
    backgroundColor: '#0284C7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  scanBannerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  scanBannerEmoji: {
    fontSize: 24,
  },
  scanBannerTextContainer: {
    flex: 1,
  },
  scanBannerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  scanBannerSubtitle: {
    color: '#BAE6FD',
    fontSize: 12,
    marginTop: 2,
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  moduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  moduleIconBox: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  moduleEmoji: {
    fontSize: 24,
  },
  moduleInfo: {
    flex: 1,
  },
  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  moduleDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 16,
  },
  arrowIcon: {
    fontSize: 24,
    color: '#94A3B8',
    marginLeft: 8,
  },
  endpointCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#0284C7',
  },
  endpointTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },
  endpointUrl: {
    fontSize: 11,
    color: '#0369A1',
    marginTop: 2,
    fontFamily: 'monospace',
  },
});
