import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
  userInfo?: { name?: string };
  environment?: string;
  onExit?: () => void;
}

export const EBhxhHomeScreen: React.FC<Props> = ({ userInfo, environment, onExit }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>eBHXH • Bảo hiểm Xã hội Điện tử</Text>
          <Text style={styles.sub}>{userInfo?.name || 'Doanh nghiệp'} - Môi trường: {environment?.toUpperCase()}</Text>
        </View>
        {onExit ? (
          <TouchableOpacity style={styles.exitBtn} onPress={onExit}>
            <Text style={styles.exitBtnText}>Thoát ✕</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Cổng Dịch vụ BHXH Doanh nghiệp</Text>
          <Text style={styles.bannerSub}>Kê khai, tra cứu đóng nộp và giải quyết chế độ ốm đau, thai sản</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>📋</Text>
            <Text style={styles.cardTitle}>Hồ sơ chờ gửi</Text>
            <Text style={styles.cardCount}>2 bộ</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>⌛</Text>
            <Text style={styles.cardTitle}>BHXH tiếp nhận</Text>
            <Text style={styles.cardCount}>5 bộ</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardEmoji}>✔️</Text>
            <Text style={styles.cardTitle}>Đã có kết quả</Text>
            <Text style={styles.cardCount}>28 bộ</Text>
          </View>
        </View>

        <View style={styles.placeholderBox}>
          <Text style={styles.placeholderText}>
            Module eBHXH đã sẵn sàng tiếp nhận các biểu mẫu kê khai 600, 601 và ký nộp token số.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    backgroundColor: '#0C4A6E',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { color: '#38BDF8', fontSize: 17, fontWeight: '700' },
  sub: { color: '#BAE6FD', fontSize: 12, marginTop: 2 },
  exitBtn: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  exitBtnText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  content: { padding: 16 },
  banner: { backgroundColor: '#0284C7', borderRadius: 12, padding: 16, marginBottom: 16 },
  bannerTitle: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  bannerSub: { color: '#E0F2FE', fontSize: 12, marginTop: 4 },
  grid: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card: { flex: 1, backgroundColor: '#FFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  cardEmoji: { fontSize: 24, marginBottom: 4 },
  cardTitle: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  cardCount: { fontSize: 15, color: '#0F172A', fontWeight: '700', marginTop: 2 },
  placeholderBox: { backgroundColor: '#F0F9FF', borderRadius: 8, padding: 16, borderLeftWidth: 4, borderLeftColor: '#0284C7' },
  placeholderText: { color: '#0369A1', fontSize: 13, lineHeight: 18 },
});
