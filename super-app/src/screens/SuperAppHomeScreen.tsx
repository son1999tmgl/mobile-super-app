import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SuperAppEnvironmentConfig } from '../config/types';
import { UserInfo } from '../types/auth';

export interface MiniAppItem {
  id: 'intrace' | 'econtract' | 'infarm' | 'ebhxh';
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  badgeColor: string;
  ready: boolean;
}

const MINI_APPS: MiniAppItem[] = [
  {
    id: 'intrace',
    title: 'inTrace',
    subtitle: 'Truy xuất nguồn gốc, Quản lý Thùng & Container',
    icon: '📦',
    badge: 'ĐÃ KẾT NỐI',
    badgeColor: '#10B981',
    ready: true,
  },
  {
    id: 'econtract',
    title: 'eContract',
    subtitle: 'Hợp đồng điện tử & Ký số từ xa SmartCA',
    icon: '✍️',
    badge: 'MẪU CHUẨN',
    badgeColor: '#6366F1',
    ready: true,
  },
  {
    id: 'infarm',
    title: 'inFarm',
    subtitle: 'Nông trại thông minh & Nhật ký IoT VietGAP',
    icon: '🌾',
    badge: 'MẪU CHUẨN',
    badgeColor: '#059669',
    ready: true,
  },
  {
    id: 'ebhxh',
    title: 'eBHXH',
    subtitle: 'Kê khai & Nộp hồ sơ Bảo hiểm Xã hội',
    icon: '🏛️',
    badge: 'MẪU CHUẨN',
    badgeColor: '#0284C7',
    ready: true,
  },
];

interface Props {
  config: SuperAppEnvironmentConfig;
  userInfo: UserInfo;
  onOpenMiniApp: (appId: MiniAppItem['id']) => void;
  onLogout: () => void;
}

export const SuperAppHomeScreen: React.FC<Props> = ({
  userInfo,
  onOpenMiniApp,
  onLogout,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.safeArea, { paddingTop: Math.max(insets.top, 16) }]}>
      {/* Top App Header */}
      <View style={styles.topHeader}>
        <View>
          <Text style={styles.brandTitle}>intrustDSS</Text>
          <Text style={styles.superAppTag}>ENTERPRISE ECOSYSTEM</Text>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout} activeOpacity={0.7}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>
              {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{userInfo?.name || ''}</Text>
            <Text style={styles.userCompany}>
              {userInfo?.companyName || (userInfo?.tax_code ? `MST: ${userInfo.tax_code}` : 'Công ty CP intrustDSS')}
            </Text>
          </View>
        </View>

        {/* Section title */}
        <Text style={styles.sectionHeading}>Hệ sinh thái Ứng dụng Con</Text>
        <Text style={styles.sectionDesc}>
          Chọn ứng dụng để truy cập phân hệ nghiệp vụ của bạn:
        </Text>

        {/* Grid Danh sách Mini Apps */}
        <View style={styles.grid}>
          {MINI_APPS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.appCard}
              onPress={() => onOpenMiniApp(item.id)}
              activeOpacity={0.7}
            >
              <View style={styles.appCardHeader}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconEmoji}>{item.icon}</Text>
                </View>
                <View style={[styles.appBadge, { backgroundColor: item.badgeColor }]}>
                  <Text style={styles.appBadgeText}>{item.badge}</Text>
                </View>
              </View>

              <Text style={styles.appTitle}>{item.title}</Text>
              <Text style={styles.appSubtitle}>{item.subtitle}</Text>

              <View style={styles.openRow}>
                <Text style={styles.openText}>Mở ứng dụng</Text>
                <Text style={styles.openArrow}>→</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 1,
  },
  superAppTag: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1.5,
    marginTop: 2,
  },
  logoutBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  logoutText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '700',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarBox: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  userCompany: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  sectionHeading: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
    lineHeight: 18,
  },
  grid: {
    gap: 14,
  },
  appCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 1,
  },
  appCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconEmoji: {
    fontSize: 22,
  },
  appBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  appBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  appTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  appSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
  },
  openRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  openText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0284C7',
  },
  openArrow: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0284C7',
  },
});
