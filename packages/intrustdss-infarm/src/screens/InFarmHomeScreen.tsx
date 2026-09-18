import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
  userInfo?: { name?: string };
  environment?: string;
  onExit?: () => void;
}

export const InFarmHomeScreen: React.FC<Props> = ({ userInfo, environment, onExit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>inFarm • Nông trại Thông minh</Text>
          <Text style={styles.sub}>{userInfo?.name || 'Chủ trang trại'} - Môi trường: {environment?.toUpperCase()}</Text>
        </View>
        {onExit ? (
          <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
            <Text style={styles.exitBtnText}>Thoát ✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Số hóa Vùng trồng & Nhật ký Canh tác</Text>
          <Text style={styles.bannerSub}>Giám sát chỉ số thổ nhưỡng, độ ẩm, phân bón đạt chuẩn VietGAP</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>🌱</Text>
            <Text style={styles.cardTitle}>Vùng trồng</Text>
            <Text style={styles.cardCount}>4 khu vực</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>💧</Text>
            <Text style={styles.cardTitle}>Tưới tiêu</Text>
            <Text style={styles.cardCount}>Tự động</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>📖</Text>
            <Text style={styles.cardTitle}>Nhật ký</Text>
            <Text style={styles.cardCount}>18 sự kiện</Text>
          </View>
        </View>

        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderText}>
            Module inFarm đã hoàn tất bộ khung, sẵn sàng tích hợp dữ liệu cảm biến IoT và bản đồ vùng trồng.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#064E3B',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#34D399', fontSize: 17, fontWeight: '700' },
  sub: { color: '#A7F3D0', fontSize: 12, marginTop: 2 },
  exitBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  exitBtnText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  content: { padding: 16 },
  banner: { backgroundColor: '#059669', borderRadius: 12, padding: 16, marginBottom: 16 },
  bannerTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  bannerSub: { color: '#D1FAE5', fontSize: 12, marginTop: 4 },
  grid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card: { flex: 1, backgroundColor: '#FFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cardEmoji: { fontSize: 24, marginBottom: 4 },
  cardTitle: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  cardCount: { fontSize: 15, color: '#0F172A', fontWeight: '700', marginTop: 2 },
  placeholderBox: { backgroundColor: '#ECFDF5', borderRadius: 8, padding: 16, borderLeftWidth: 4, borderLeftColor: '#10B981' },
  placeholderText: { color: '#065F46', fontSize: 13, lineHeight: 18 },
});
